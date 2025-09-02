// Central place to configure global theming values
// Update BACKGROUND_IMAGE to point to your desired background image

// Example local asset path (uncomment and adjust when you add the file):
// export const BACKGROUND_IMAGE = require('../assets/backgrounds/ocean.png');

// Placeholder to avoid bundling errors until you set the real path.
// Using an empty string is fine; the component will fallback to a color.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const BACKGROUND_IMAGE: any = null;

// Example remote PNG placeholder (used if BACKGROUND_IMAGE is null)
// Replace with your own hosted image or keep until you add a local file
export const BACKGROUND_URI: string | null = require('../assets/d16e687e2f5ebfb628726f23ae2dead3e7d69395.png');

export const COLORS = {
  oceanDeep: '#002244',
  oceanBattle: '#003366',
  oceanWorkout: '#0066BB',
  gold: '#FFD700',
  sky: '#87CEEB',
  danger: '#FF4444',
  success: '#00AA44',
};


