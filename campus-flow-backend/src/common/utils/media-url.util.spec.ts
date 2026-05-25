import { normalizeMediaUrl, getAppBaseUrl } from './media-url.util';

describe('media-url.util', () => {
  const originalAppUrl = process.env.API_URL;

  afterEach(() => {
    process.env.API_URL = originalAppUrl;
  });

  it('returns absolute production URL when API_URL is configured', () => {
    process.env.API_URL = 'https://campusflow-85zn.onrender.com';

    const normalized = normalizeMediaUrl('http://localhost:3500/uploads/seed/js');

    expect(normalized).toBe('https://campusflow-85zn.onrender.com/uploads/seed/js');
  });

  it('returns relative upload path when API_URL is missing', () => {
    delete process.env.API_URL;

    const normalized = normalizeMediaUrl('http://localhost:3500/uploads/seed/js');

    expect(normalized).toBe('/uploads/seed/js');
  });

  it('prefixes relative uploads with API_URL when configured', () => {
    process.env.API_URL = 'https://campusflow-85zn.onrender.com';

    const normalized = normalizeMediaUrl('/uploads/seed/js');

    expect(normalized).toBe('https://campusflow-85zn.onrender.com/uploads/seed/js');
  });

  it('returns the same external absolute URL when it is not localhost', () => {
    process.env.API_URL = 'https://example.com';

    const normalized = normalizeMediaUrl('https://cdn.example.com/uploads/image.png');

    expect(normalized).toBe('https://cdn.example.com/uploads/image.png');
  });

  it('trims trailing slashes from API_URL', () => {
    process.env.API_URL = 'https://campusflow-85zn.onrender.com/';

    expect(getAppBaseUrl()).toBe('https://campusflow-85zn.onrender.com');
  });
});
