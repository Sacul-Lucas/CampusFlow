import { API_BASE_URL } from "@/Config";

const apiBaseUrl = API_BASE_URL?.replace(/\/api\/?$/u, '') ?? '';

export function resolveMediaUrl(mediaUrl?: string | null): string | undefined {
  if (!mediaUrl) return undefined;
  if (/^https?:\/\//u.test(mediaUrl)) return mediaUrl;
  if (mediaUrl.startsWith('/')) {
    return apiBaseUrl ? `${apiBaseUrl}${mediaUrl}` : mediaUrl;
  }
  return mediaUrl;
}
