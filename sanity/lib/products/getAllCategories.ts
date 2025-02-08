import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

// Function to get all categories

export const getAllCategories = async () => {
const ALL_CATEGORIES_QUERY = defineQuery(`
*[
  _type == "category" 
] | order(name asc) 
`);

try {
    // Use sanityFetch to send the query
    const categories = await sanityFetch({
      query: ALL_CATEGORIES_QUERY,
    });

    // Return the list of categories, or an empty array if there are none
    return categories.data || [];
  } catch (error) {
    console.error("error fetching all categories", error);
  }
};