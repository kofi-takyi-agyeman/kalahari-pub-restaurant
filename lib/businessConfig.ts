import { BusinessConfig } from "@/types";

export const businessConfig: BusinessConfig = {
  name: "Kalahari Pub & Restaurant",
  shortName: "Kalahari Pub",
  slogan: "Good Food, Good Drinks, Great Vibes",
  location: "Kalahari Pub, A-Lang Taxi Rank",
  phones: [
    {
      raw: "0245656849",
      formatted: "024 565 6849",
      telLink: "tel:0245656849",
      label: "Line 1 (MTN)",
    },
    {
      raw: "0207157071",
      formatted: "020 715 7071",
      telLink: "tel:0207157071",
      label: "Line 2 (Telecel)",
    },
    {
      raw: "0246773225",
      formatted: "024 677 3225",
      telLink: "tel:0246773225",
      label: "Line 3 (MTN)",
    },
  ],
  services: [
    "Pub & Chilled Drinks",
    "Restaurant Dining",
    "Authentic Ghanaian Local Dishes",
    "Fresh Grilled Specialties",
    "Flavorful Rice Meals",
  ],
  developer: {
    name: "Data_Nova",
    credit: "Website by Data_Nova",
  },
  samplePriceNotice: "SAMPLE PRICE — CONFIRM WITH RESTAURANT",
};
