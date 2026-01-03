export const cn = (...classes: (string | boolean | undefined | null)[]) =>
classes.filter(Boolean).join(' ')


export const sqmToSqft = (sqm: number) => sqm * 10.7639
export const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n))