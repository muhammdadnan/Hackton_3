import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const searchProductsByName = async (searchParam: string) => {
  const PRODUCT_SEARCH_QUERY = defineQuery(`
    *[
    _type == "ProductType" && name match
    $searchParam 
    ]    | order(name desc)
    `);

  try {
    const products = await sanityFetch({
      query: PRODUCT_SEARCH_QUERY,
      params: { searchParam: `${searchParam}*` },
    });
    return products.data || [];
  } catch (error) {
    console.error("Error fatching products by name", error);
    return [];
  }
};
