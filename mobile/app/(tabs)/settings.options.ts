export type ToneOption = {
  label: string;
  value: string;
  color: string;
};

export const featuredTones: ToneOption[] = [
  { label: 'Cloud White', value: '#f8fafc', color: '#f8fafc' },
  { label: 'Sky Blue', value: '#dbeafe', color: '#dbeafe' },
  { label: 'Mint Leaf', value: '#dcfce7', color: '#dcfce7' },
  { label: 'Peach Bloom', value: '#fee2e2', color: '#fee2e2' },
  { label: 'Sun Glow', value: '#fef3c7', color: '#fef3c7' },
  { label: 'Lavender Mist', value: '#ede9fe', color: '#ede9fe' },
  { label: 'Slate Mist', value: '#e2e8f0', color: '#e2e8f0' },
  { label: 'Midnight Ink', value: '#0f172a', color: '#0f172a' },
];

type ToneFamily = {
  label: string;
  hue: number;
  saturation: number;
  lightness: number;
};

type ToneVariant = {
  label: string;
  saturationDelta: number;
  lightnessDelta: number;
};

const toneFamilies: ToneFamily[] = [
  { label: 'Rose', hue: 346, saturation: 74, lightness: 70 },
  { label: 'Coral', hue: 12, saturation: 82, lightness: 70 },
  { label: 'Peach', hue: 24, saturation: 80, lightness: 76 },
  { label: 'Apricot', hue: 34, saturation: 82, lightness: 74 },
  { label: 'Amber', hue: 42, saturation: 84, lightness: 66 },
  { label: 'Gold', hue: 50, saturation: 82, lightness: 60 },
  { label: 'Lemon', hue: 58, saturation: 84, lightness: 64 },
  { label: 'Lime', hue: 78, saturation: 72, lightness: 66 },
  { label: 'Mint', hue: 145, saturation: 60, lightness: 72 },
  { label: 'Seafoam', hue: 160, saturation: 58, lightness: 70 },
  { label: 'Teal', hue: 176, saturation: 60, lightness: 58 },
  { label: 'Aqua', hue: 188, saturation: 66, lightness: 68 },
  { label: 'Sky', hue: 202, saturation: 72, lightness: 72 },
  { label: 'Azure', hue: 210, saturation: 76, lightness: 68 },
  { label: 'Cobalt', hue: 224, saturation: 78, lightness: 62 },
  { label: 'Indigo', hue: 240, saturation: 74, lightness: 60 },
  { label: 'Violet', hue: 260, saturation: 68, lightness: 68 },
  { label: 'Lavender', hue: 274, saturation: 54, lightness: 78 },
  { label: 'Plum', hue: 292, saturation: 58, lightness: 62 },
  { label: 'Orchid', hue: 306, saturation: 64, lightness: 68 },
  { label: 'Magenta', hue: 318, saturation: 74, lightness: 66 },
  { label: 'Berry', hue: 332, saturation: 68, lightness: 60 },
  { label: 'Slate', hue: 214, saturation: 12, lightness: 58 },
];

const toneVariants: ToneVariant[] = [
  { label: 'Soft', saturationDelta: -10, lightnessDelta: 10 },
  { label: 'Bright', saturationDelta: 8, lightnessDelta: 2 },
  { label: 'Deep', saturationDelta: 4, lightnessDelta: -8 },
  { label: 'Muted', saturationDelta: -18, lightnessDelta: 0 },
];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const generatePaletteTones = (): ToneOption[] =>
  toneFamilies.flatMap((family) =>
    toneVariants.map((variant) => {
      const saturation = clamp(family.saturation + variant.saturationDelta, 12, 92);
      const lightness = clamp(family.lightness + variant.lightnessDelta, 26, 86);
      const color = `hsl(${family.hue} ${saturation}% ${lightness}%)`;

      return {
        label: `${variant.label} ${family.label}`,
        value: color,
        color,
      };
    }),
  );

export const paletteTones = [...featuredTones, ...generatePaletteTones()];
export const paletteItems = paletteTones.map(({ label, value }) => ({ label, value }));
