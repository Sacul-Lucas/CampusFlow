export function getAppBaseUrl(): string | undefined {
  const appUrl = process.env.API_URL?.trim();
  if (!appUrl) return undefined;
  return appUrl.replace(/\/+$|\s+$/gu, '');
}

const absoluteUrlRegExp = /^https?:\/\//u;
const localUrlRegExp = /^https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?/u;

export function normalizeMediaUrl(url?: string): string | undefined {
  if (!url) return undefined;

  const appUrl = getAppBaseUrl();

  if (absoluteUrlRegExp.test(url)) {
    if (localUrlRegExp.test(url)) {
      const normalizedPath = url.replace(localUrlRegExp, '');
      if (appUrl) {
        return `${appUrl}${normalizedPath}`;
      }
      return normalizedPath || url;
    }

    return url;
  }

  if (url.startsWith('/uploads') || url.startsWith('/seed')) {
    return appUrl ? `${appUrl}${url}` : url;
  }

  return url;
}
