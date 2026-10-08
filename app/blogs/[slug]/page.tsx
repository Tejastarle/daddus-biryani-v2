'use client';

import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, Loader } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getYouTubeId, getYouTubeEmbedUrl } from '@/lib/youtube';

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
  created_at: string;
}

const FALLBACK_IMAGE =
  '/images/dishes/chicken-dum-biryani.webp';

const DARK_BG = '#0F0F0F';
const TEXT_WHITE = '#FFFFFF';
const TEXT_SOFT = '#D8D8D8';
const GOLD = '#D4AF37';

function YouTubeEmbed({ videoId }: { videoId: string }) {
  return (
    <div
      style={{
        position: 'relative',
        paddingBottom: '56.25%',
        height: 0,
        overflow: 'hidden',
        borderRadius: '0.75rem',
        margin: '2rem 0',
        border: '1px solid #333333',
      }}
    >
      <iframe
        src={getYouTubeEmbedUrl(videoId)}
        title="YouTube video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
      />
    </div>
  );
}

function renderMarkdown(text: string) {
  if (!text) return null;

  const lines = text.split('\n');
  const blocks: React.ReactNode[] = [];
  let listBuffer: string[] = [];
  let listType: 'ul' | 'ol' | null = null;

  const inline = (str: string) => {
    const parts = str.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} style={{ color: GOLD, fontWeight: 700 }}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
        return (
          <em key={i} style={{ color: TEXT_SOFT, fontStyle: 'italic' }}>
            {part.slice(1, -1)}
          </em>
        );
      }
      return part;
    });
  };

  const flushList = () => {
    if (listBuffer.length === 0) return;
    const items = listBuffer.map((item, i) => (
      <li key={i} style={{ color: TEXT_WHITE, marginBottom: '0.5rem', lineHeight: 1.75 }}>
        {inline(item)}
      </li>
    ));
    const listStyle: React.CSSProperties = {
      color: TEXT_WHITE,
      fontSize: '1.125rem',
      marginBottom: '1.5rem',
      marginLeft: '1.5rem',
      listStylePosition: 'outside',
    };
    blocks.push(
      listType === 'ol' ? (
        <ol key={`list-${blocks.length}`} style={{ ...listStyle, listStyleType: 'decimal' }}>
          {items}
        </ol>
      ) : (
        <ul key={`list-${blocks.length}`} style={{ ...listStyle, listStyleType: 'disc' }}>
          {items}
        </ul>
      )
    );
    listBuffer = [];
    listType = null;
  };

  lines.forEach((raw, index) => {
    const line = raw.trimEnd();
    const key = `line-${index}`;

    const youtubeId = getYouTubeId(line.trim());
    if (youtubeId) {
      flushList();
      blocks.push(<YouTubeEmbed key={key} videoId={youtubeId} />);
      return;
    }

    if (/^[-*]\s+/.test(line)) {
      if (listType === 'ol') flushList();
      listType = 'ul';
      listBuffer.push(line.replace(/^[-*]\s+/, ''));
      return;
    }
    if (/^\d+\.\s+/.test(line)) {
      if (listType === 'ul') flushList();
      listType = 'ol';
      listBuffer.push(line.replace(/^\d+\.\s+/, ''));
      return;
    }

    flushList();

    if (line.trim() === '') return;

    if (/^---+$/.test(line.trim())) {
      blocks.push(<hr key={key} style={{ border: 'none', borderTop: '1px solid #333333', margin: '2.5rem 0' }} />);
      return;
    }
    if (line.startsWith('#### ')) {
      blocks.push(
        <h4 key={key} style={{ color: TEXT_WHITE, fontSize: '1.25rem', fontWeight: 600, marginTop: '1.5rem', marginBottom: '0.75rem' }}>
          {inline(line.slice(5))}
        </h4>
      );
      return;
    }
    if (line.startsWith('### ')) {
      blocks.push(
        <h3 key={key} style={{ color: TEXT_WHITE, fontSize: '1.5rem', fontWeight: 600, marginTop: '2rem', marginBottom: '0.75rem' }}>
          {inline(line.slice(4))}
        </h3>
      );
      return;
    }
    if (line.startsWith('## ')) {
      blocks.push(
        <h2 key={key} className="font-display" style={{ color: GOLD, fontSize: '1.875rem', fontWeight: 700, marginTop: '2.5rem', marginBottom: '1rem' }}>
          {inline(line.slice(3))}
        </h2>
      );
      return;
    }
    if (line.startsWith('# ')) {
      blocks.push(
        <h1 key={key} className="font-display" style={{ color: GOLD, fontSize: '2.25rem', fontWeight: 700, marginTop: '2rem', marginBottom: '1.5rem' }}>
          {inline(line.slice(2))}
        </h1>
      );
      return;
    }
    if (line.startsWith('> ')) {
      blocks.push(
        <blockquote
          key={key}
          style={{
            borderLeft: `4px solid ${GOLD}`,
            paddingLeft: '1.5rem',
            paddingTop: '0.75rem',
            paddingBottom: '0.75rem',
            margin: '1.5rem 0',
            fontStyle: 'italic',
            color: TEXT_SOFT,
            backgroundColor: '#181818',
            borderRadius: '0 0.5rem 0.5rem 0',
          }}
        >
          {inline(line.slice(2))}
        </blockquote>
      );
      return;
    }

    blocks.push(
      <p key={key} style={{ color: TEXT_WHITE, fontSize: '1.125rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
        {inline(line)}
      </p>
    );
  });

  flushList();
  return blocks;
}

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlog() {
      try {
        const { data, error } = await supabase.from('blogs').select('*').eq('slug', slug).single();
        if (error) throw error;
        setBlog(data);
      } catch (err) {
        console.error('Blog not found:', err);
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: DARK_BG }}>
        <Header />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8rem 0', color: '#999999' }}>
          <Loader className="animate-spin mr-2" />
          Loading post...
        </div>
        <Footer />
      </main>
    );
  }

  if (!blog) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: DARK_BG }}>
        <Header />
        <div style={{ textAlign: 'center', padding: '8rem 1rem' }}>
          <h1 style={{ color: TEXT_WHITE, fontSize: '1.875rem', fontWeight: 700, marginBottom: '1rem' }}>
            Post Not Found
          </h1>
          <p style={{ color: '#999999', marginBottom: '2rem' }}>
            This blog post doesn&apos;t exist or was removed.
          </p>
          <Link href="/blogs" className="btn-primary">
            Back to Blog
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const heroVideoId = blog.video_url ? getYouTubeId(blog.video_url) : null;
  const hasUploadedVideo = Boolean(blog.video_file_url);

  return (
    <main style={{ minHeight: '100vh', backgroundColor: DARK_BG }}>
      <Header />

      {/* ===== HERO: UPLOADED VIDEO > YOUTUBE > IMAGE ===== */}
      {hasUploadedVideo || heroVideoId ? (
        <section style={{ backgroundColor: '#000000', padding: '2rem 1rem 0' }}>
          <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
            {hasUploadedVideo ? (
              <video
                src={blog.video_file_url!}
                controls
                poster={blog.image || FALLBACK_IMAGE}
                style={{ width: '100%', borderRadius: '0.75rem', backgroundColor: '#000' }}
              />
            ) : (
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '0.75rem' }}>
                <iframe
                  src={getYouTubeEmbedUrl(heroVideoId!)}
                  title={blog.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                />
              </div>
            )}
          </div>

          <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '2rem 0' }}>
            {blog.category && (
              <span
                style={{
                  display: 'inline-block',
                  backgroundColor: GOLD,
                  color: DARK_BG,
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  marginBottom: '1rem',
                }}
              >
                {blog.category}
              </span>
            )}
            <h1 className="font-display" style={{ color: GOLD, fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 700, marginBottom: '1rem' }}>
              {blog.title}
            </h1>
            <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem', color: '#999999' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={16} />
                {blog.author}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={16} />
                {new Date(blog.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </section>
      ) : (
        <section className="relative h-96 overflow-hidden">
          <Image src={blog.image || FALLBACK_IMAGE} alt={blog.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80" />
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="max-w-3xl text-center">
              {blog.category && (
                <span
                  style={{
                    display: 'inline-block',
                    backgroundColor: GOLD,
                    color: DARK_BG,
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    marginBottom: '1rem',
                  }}
                >
                  {blog.category}
                </span>
              )}
              <h1
                className="font-display"
                style={{
                  color: GOLD,
                  fontSize: 'clamp(1.875rem, 5vw, 3rem)',
                  fontWeight: 700,
                  marginBottom: '1rem',
                  textShadow: '0 2px 12px rgba(0,0,0,0.8)',
                }}
              >
                {blog.title}
              </h1>
              <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', fontSize: '0.875rem', color: '#E5E5E5' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={16} />
                  {blog.author}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={16} />
                  {new Date(blog.created_at).toLocaleDateString()}
                </span>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Content */}
      <section style={{ backgroundColor: DARK_BG, color: TEXT_WHITE, padding: '4rem 1rem' }}>
        <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
          <Link
            href="/blogs"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: GOLD, marginBottom: '2rem', textDecoration: 'none' }}
          >
            <ArrowLeft size={18} />
            Back to all posts
          </Link>

          {blog.excerpt && (
            <p
              style={{
                fontSize: '1.25rem',
                color: TEXT_SOFT,
                marginBottom: '2rem',
                paddingBottom: '2rem',
                borderBottom: '1px solid #333333',
                lineHeight: 1.75,
              }}
            >
              {blog.excerpt}
            </p>
          )}

          <article>{renderMarkdown(blog.content)}</article>
        </div>
      </section>

      <Footer />
    </main>
  );
}
