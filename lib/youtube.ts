/**
 * Shared YouTube helpers.
 * Extracts a video ID from any common URL format and builds
 * thumbnail / embed URLs from it.
 */

export function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  const patterns = [
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

export function getYouTubeEmbedUrl(videoId: string, autoplay = false): string {
  const params = autoplay ? '?autoplay=1&mute=1' : '';
  return `https://www.youtube.com/embed/${videoId}${params}`;
}
