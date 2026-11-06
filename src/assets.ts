/** Build-correct public asset URLs in every environment (dev, Pages sub-path). */
export const asset = (path: string) => `${import.meta.env.BASE_URL}assets/${path}`;

export const IMAGES = {
  profile: {
    src: asset('profile/profile-pic-1200.webp'),
    srcSet: `${asset('profile/profile-pic-800.webp')} 800w, ${asset('profile/profile-pic-1200.webp')} 1200w`,
    width: 1200,
    height: 1500,
  },
  logo: asset('logo.png'),
  cv: asset('cv.pdf'),
} as const;
