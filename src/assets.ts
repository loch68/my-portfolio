/** Build-correct public asset URLs in every environment (dev, Pages sub-path). */
export const asset = (path: string) => `${import.meta.env.BASE_URL}assets/${path}`;

export const IMAGES = {
  hero: {
    wide: { src: asset('hero/hero-2400.jpg'), width: 2400, height: 1349 },
  },
  profile: {
    src: asset('profile/profile-pic-1200.webp'),
    srcSet: `${asset('profile/profile-pic-800.webp')} 800w, ${asset('profile/profile-pic-1200.webp')} 1200w`,
    width: 1200,
    height: 1500,
  },
  logo: asset('logo.png'),
  cv: asset('cv.pdf'),
} as const;

export const VIDEO = {
  hero: asset('hero/heroVideo.mp4'),
} as const;
