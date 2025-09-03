const KG_TO_LB = 2.2046226218;
const KMH_TO_MPH = 0.6213711922;
const MM_TO_IN = 1 / 25.4;


const formatters = {
  "en-0": new Intl.NumberFormat("en", { maximumFractionDigits: 0 }),
  "en-1": new Intl.NumberFormat("en", { maximumFractionDigits: 1 }),
  "it-0": new Intl.NumberFormat("it", { maximumFractionDigits: 0 }),
  "it-1": new Intl.NumberFormat("it", { maximumFractionDigits: 1 }),
};

export const nf0 = (l) => formatters[`${l}-0`];
export const nf1 = (l) => formatters[`${l}-1`];

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
