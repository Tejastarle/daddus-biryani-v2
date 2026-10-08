'use client';

/* eslint-disable @next/next/no-img-element --
   This admin screen previews image URLs typed in by the admin, which can point
   at any host. next/image would require every one of those hosts to be listed
   in next.config.js, so a plain <img> is the correct choice here. These
   previews are admin-only and never rendered on the public site. */

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit, Loader, X, Search, Youtube, Upload, Film, Trash } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { errorMessage } from '@/lib/errors';
import { getYouTubeId, getYouTubeThumbnail } from '@/lib/youtube';

interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  author: string;
  image: string;
  video_url: string | null;
  video_file_url: string | null;
  status: string;
  created_at: string;
}

const EMPTY_FORM = {
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  category: 'Recipes',
  author: "Daddu's Biryani",
  image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&h=400&fit=crop',
  video_url: '',
  video_file_url: '',
  status: 'published',
};

const MAX_FILE_SIZE_MB = 50;

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  async function fetchBlogs() {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (err) throw err;
      setBlogs(data || []);
      setError('');
    } catch (err: unknown) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  function makeSlug(title: string) {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  function handleTitleChange(title: string) {
    setForm({ ...form, title, slug: makeSlug(title) });
  }

  function openNewForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
    setError('');
  }

  function openEditForm(blog: Blog) {
    setForm({
      title: blog.title,
      slug: blog.slug,
      content: blog.content || '',
      excerpt: blog.excerpt || '',
      category: blog.category || 'Recipes',
      author: blog.author || "Daddu's Biryani",
      image: blog.image || EMPTY_FORM.image,
      video_url: blog.video_url || '',
      video_file_url: blog.video_file_url || '',
      status: blog.status || 'published',
    });
    setEditingId(blog.id);
    setShowForm(true);
    setError('');
  }

  // ----------------------------------------------------------------
  // UPLOAD A VIDEO FILE TO SUPABASE STORAGE
  // ----------------------------------------------------------------
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setError('Please choose a video file (mp4, mov, webm...).');
      return;
    }

    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > MAX_FILE_SIZE_MB) {
      setError(`File is ${sizeMB.toFixed(1)}MB. Max allowed is ${MAX_FILE_SIZE_MB}MB — compress it and try again.`);
      return;
    }

    setUploading(true);
    setError('');

    try {
      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-media')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('blog-media').getPublicUrl(fileName);

      setForm((prev) => ({ ...prev, video_file_url: urlData.publicUrl, video_url: '' }));
    } catch (err: unknown) {
      const msg = errorMessage(err);
      setError(
        msg.includes('bucket')
          ? 'Storage bucket "blog-media" not found. Create it in Supabase → Storage first.'
          : msg
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function removeUploadedVideo() {
    setForm((prev) => ({ ...prev, video_file_url: '' }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    if (form.video_url && !form.video_file_url && !getYouTubeId(form.video_url)) {
      setError('That doesn\'t look like a valid YouTube link.');
      setSaving(false);
      return;
    }

    try {
      const payload = {
        title: form.title,
        slug: form.slug,
        content: form.content,
        excerpt: form.excerpt,
        category: form.category,
        author: form.author,
        image: form.image,
        video_url: form.video_file_url ? null : form.video_url || null,
        video_file_url: form.video_file_url || null,
        status: form.status,
      };

      if (editingId) {
        const { error: err } = await supabase
          .from('blogs')
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq('id', editingId);
        if (err) throw err;
      } else {
        const { error: err } = await supabase.from('blogs').insert([payload]);
        if (err) throw err;
      }

      setShowForm(false);
      setForm(EMPTY_FORM);
      setEditingId(null);
      fetchBlogs();
    } catch (err: unknown) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function deleteBlog(id: string) {
    if (!confirm('Delete this blog post permanently?')) return;
    try {
      const { error: err } = await supabase.from('blogs').delete().eq('id', id);
      if (err) throw err;
      setBlogs(blogs.filter((b) => b.id !== id));
    } catch (err: unknown) {
      alert('Error deleting: ' + errorMessage(err));
    }
  }

  const filtered = blogs.filter((b) => b.title.toLowerCase().includes(search.toLowerCase()));
  const previewYoutubeId = getYouTubeId(form.video_url);
  const hasAnyVideo = Boolean(form.video_file_url || previewYoutubeId);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-4xl font-bold font-playfair text-gradient">Blog Management</h1>
        <button onClick={openNewForm} className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          New Blog Post
        </button>
      </div>

      {error && !showForm && (
        <div className="bg-red-500/20 border border-red-500 text-red-400 p-4 rounded-lg text-sm">{error}</div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-3 text-muted" size={20} />
        <input
          type="text"
          placeholder="Search blog posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center p-4 overflow-y-auto"
        >
          <div className="bg-card border border-border rounded-lg w-full max-w-3xl my-8">
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h2 className="text-2xl font-bold">{editingId ? 'Edit Blog Post' : 'New Blog Post'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-card-hover rounded-lg">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="input-field"
                  placeholder="How to Cook Perfect Biryani"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  URL Slug * <span className="text-muted font-normal">(auto-filled)</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="input-field"
                  >
                    <option>Recipes</option>
                    <option>Health</option>
                    <option>Culture</option>
                    <option>Techniques</option>
                    <option>News</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Author</label>
                  <input
                    type="text"
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="input-field"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              {/* ===== FEATURED MEDIA ===== */}
              <div className="border border-border rounded-lg p-4 space-y-4">
                <p className="text-sm font-medium flex items-center gap-2">
                  <Film size={18} className="text-accent" />
                  Featured Media
                </p>

                {/* Uploaded video */}
                <div>
                  <label className="block text-sm font-medium mb-2">Upload a video file</label>

                  {form.video_file_url ? (
                    <div className="space-y-2">
                      <video
                        src={form.video_file_url}
                        controls
                        className="w-full max-h-48 rounded-lg bg-black"
                      />
                      <button
                        type="button"
                        onClick={removeUploadedVideo}
                        className="text-sm text-red-400 flex items-center gap-1 hover:underline"
                      >
                        <Trash size={14} />
                        Remove video
                      </button>
                    </div>
                  ) : (
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/*"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="hidden"
                        id="video-upload"
                      />
                      <label
                        htmlFor="video-upload"
                        className={`flex items-center justify-center gap-2 px-4 py-6 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-accent transition-colors ${
                          uploading ? 'opacity-50 cursor-wait' : ''
                        }`}
                      >
                        {uploading ? (
                          <>
                            <Loader className="animate-spin" size={18} />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload size={18} className="text-accent" />
                            Click to choose a video file (max {MAX_FILE_SIZE_MB}MB)
                          </>
                        )}
                      </label>
                    </div>
                  )}
                </div>

                {/* OR: YouTube link — only shown if no file uploaded */}
                {!form.video_file_url && (
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <Youtube size={16} className="text-accent" />
                      Or paste a YouTube link instead
                    </label>
                    <input
                      type="url"
                      value={form.video_url}
                      onChange={(e) => setForm({ ...form, video_url: e.target.value })}
                      className="input-field"
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                    {form.video_url && !previewYoutubeId && (
                      <p className="text-xs text-red-400 mt-2">Not a valid YouTube link yet.</p>
                    )}
                    {previewYoutubeId && (
                      <img
                        src={getYouTubeThumbnail(previewYoutubeId)}
                        alt="Preview"
                        className="mt-3 h-32 w-full object-cover rounded-lg"
                      />
                    )}
                  </div>
                )}

                {/* Fallback image — only shown if no video at all */}
                {!hasAnyVideo && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Image URL <span className="text-muted font-normal">(used when there&apos;s no video)</span>
                    </label>
                    <input
                      type="url"
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      className="input-field"
                      placeholder="https://images.unsplash.com/..."
                    />
                    {form.image && (
                      <img src={form.image} alt="Preview" className="mt-3 h-32 w-full object-cover rounded-lg" />
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Excerpt</label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  className="input-field h-20"
                  placeholder="Short summary for the card..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Content <span className="text-muted font-normal">(supports Markdown)</span>
                </label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="input-field h-64 font-mono text-sm"
                  placeholder={'# Heading\n\nYour blog content here...'}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving || uploading} className="btn-primary flex-1">
                  {saving ? 'Saving...' : editingId ? 'Update Post' : 'Publish Post'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}

      {/* Blog List */}
      <div className="card overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="animate-spin mr-2" />
            Loading blog posts...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-muted">No blog posts yet.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-4 font-semibold">Media</th>
                <th className="text-left px-4 py-4 font-semibold">Title</th>
                <th className="text-left px-4 py-4 font-semibold">Category</th>
                <th className="text-left px-4 py-4 font-semibold">Status</th>
                <th className="text-left px-4 py-4 font-semibold">Date</th>
                <th className="text-left px-4 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((blog) => {
                const ytId = blog.video_url ? getYouTubeId(blog.video_url) : null;
                const isUploaded = Boolean(blog.video_file_url);
                const thumb = isUploaded
                  ? null
                  : ytId
                  ? getYouTubeThumbnail(ytId)
                  : blog.image || EMPTY_FORM.image;

                return (
                  <tr key={blog.id} className="border-b border-border hover:bg-card-hover">
                    <td className="px-4 py-3">
                      <div className="relative w-16 h-12 bg-black rounded overflow-hidden flex items-center justify-center">
                        {isUploaded ? (
                          <Film size={20} className="text-accent" />
                        ) : (
                              <img src={thumb!} alt={blog.title} className="w-16 h-12 object-cover" />
                        )}
                        {(ytId || isUploaded) && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            {!isUploaded && <Youtube size={14} className="text-white" />}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium max-w-xs truncate">{blog.title}</td>
                    <td className="px-4 py-3 text-muted text-sm">{blog.category}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          blog.status === 'published'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {blog.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted">
                      {new Date(blog.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEditForm(blog)} className="p-2 hover:bg-card rounded" title="Edit">
                          <Edit size={18} className="text-accent" />
                        </button>
                        <button onClick={() => deleteBlog(blog.id)} className="p-2 hover:bg-card rounded" title="Delete">
                          <Trash2 size={18} className="text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="text-2xl font-bold text-accent">{blogs.filter((b) => b.status === 'published').length}</p>
          <p className="text-sm text-muted">Published</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-accent">
            {blogs.filter((b) => b.video_file_url || b.video_url).length}
          </p>
          <p className="text-sm text-muted">With Video</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-accent">{blogs.length}</p>
          <p className="text-sm text-muted">Total Posts</p>
        </div>
      </div>
    </motion.div>
  );
}
