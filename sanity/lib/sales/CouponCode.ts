export const COUPON_CODES = {
BFS100: "BFS100",
XMAS2021: "XMAS2021",
NY2022: "NY2022",
 } as const;

 export type CouponCode = keyof typeof COUPON_CODES;