const KG_TO_LB = 2.2046226218;
const KMH_TO_MPH = 0.6213711922;
const MM_TO_IN = 1 / 25.4;

export const nf0 = (l) =>
  new Intl.NumberFormat(l, { maximumFractionDigits: 0 });
export const nf1 = (l) =>
  new Intl.NumberFormat(l, { maximumFractionDigits: 1 });

export const asWeight = (kg, l) => {
  if (l === "en") return `${nf0(l).format(Math.round(kg * KG_TO_LB))} lb`;
  return `${nf0(l).format(kg)} kg`;
};

export const asLengthMm = (mm, l) => {
  if (l === "en") return `${nf0(l).format(Math.round(mm * MM_TO_IN))} in`;
  return `${nf0(l).format(mm)} mm`;
};

export const asDimensions = ({ length_mm, width_mm, height_mm }, l) => {
  if (l === "en") {
    const L = Math.round(length_mm * MM_TO_IN);
    const W = Math.round(width_mm * MM_TO_IN);
    const H = Math.round(height_mm * MM_TO_IN);
    return `${nf0(l).format(L)} × ${nf0(l).format(W)} × ${nf0(l).format(H)} in`;
  }
  return `${nf0(l).format(length_mm)} × ${nf0(l).format(width_mm)} × ${nf0(
    l
  ).format(height_mm)} mm`;
};

export { KMH_TO_MPH };
