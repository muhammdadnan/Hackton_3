import { defineQuery } from "next-sanity";
import { CouponCode } from "./CouponCode";
import { sanityFetch } from "../live";

export const getActiveSaleByCouponCode = async (couponCode: CouponCode) => {
const ACTIVE_SALE_BY_COUPON_QUERY = defineQuery(`
*[
_type == "sale"
&& isActive == true
&& couponCode == $couponCode
] |order(va1idFrom desc) {
_id,
title,
description,
discountAmount,
couponCode,
validFrom,
validUntil,
isActive
}[0]
`);
try{
const activeSale = await sanityFetch({
    query: ACTIVE_SALE_BY_COUPON_QUERY, 
    params:{
        couponCode,
    },// Pass the coupon code to the query parameter.
});
return activeSale ? activeSale.data : null;
} catch (error) {
    console.error("Error fatching active sale by coupon code",error);
    return null;
}
};