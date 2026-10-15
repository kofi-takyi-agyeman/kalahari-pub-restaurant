export type CategoryId = "local-dishes" | "grilled-food" | "rice-meals" | "drinks";

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  image: string;
  badge?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: CategoryId;
  samplePrice: number; // In Ghanaian Cedi (GHS)
  currency: string;
  image: string;
  isAvailable: boolean;
  isFeatured?: boolean;
  prepTimeNote?: string;
  tags?: string[];
  isSamplePrice: true; // Conspicuously identified as sample price
}

export interface CartItem {
  id: string;
  item: MenuItem;
  quantity: number;
  notes?: string;
}

export type OrderType = "pickup" | "delivery";

export interface OrderEstimate {
  items: CartItem[];
  orderType: OrderType;
  subtotal: number;
  isSubtotalEstimated: boolean;
  deliveryFee: number | null; // null because delivery fee is unconfirmed
  totalEstimate: number;
  customerName?: string;
  customerPhone?: string;
  deliveryAddress?: string;
}

export interface BusinessConfig {
  name: string;
  shortName: string;
  slogan: string;
  location: string;
  phones: {
    raw: string;
    formatted: string;
    telLink: string;
    label: string;
  }[];
  services: string[];
  developer: {
    name: string;
    credit: string;
  };
  samplePriceNotice: string;
}
