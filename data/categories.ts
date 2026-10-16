import { Category } from "@/types";

export const categories: Category[] = [
  {
    id: "local-dishes",
    name: "Local Dishes",
    description: "Authentic Ghanaian soups, swallows, and stews prepared with traditional aromatic spices.",
    image: "/dishes/red_red_plantain.jpg",
    badge: "House Specialty",
  },
  {
    id: "grilled-food",
    name: "Grilled Food",
    description: "Charcoal-grilled whole tilapia, seasoned meats, and savory kebabs hot off the flames.",
    image: "/dishes/grilled_tilapia_platter.jpg",
    badge: "Hot Off The Grill",
  },
  {
    id: "rice-meals",
    name: "Rice Meals",
    description: "Richly spiced Ghanaian Jollof rice, fried rice, and succulent protein pairings.",
    image: "/dishes/assorted_jollof_deluxe.jpg",
    badge: "Crowd Favorite",
  },
  {
    id: "drinks",
    name: "Drinks",
    description: "Chilled lagers, stout, malt, soft drinks, and cold refreshing beverages.",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80",
    badge: "Ice Chilled",
  },
];
