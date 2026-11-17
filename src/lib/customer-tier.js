export const TIER_OPTIONS = ["Mới", "Thân thiết", "VIP"];

export const TIER_STYLE = {
  "Mới": "bg-slate-100 text-slate-600 border-slate-200",
  "Thân thiết": "bg-sky-50 text-sky-700 border-sky-200",
  "VIP": "bg-violet-50 text-violet-700 border-violet-200",
};

export function tierStyle(tier) {
  return TIER_STYLE[tier] || TIER_STYLE["Mới"];
}