/**
 * Supabase Database Schema Definitions for Kalahari Pub & Restaurant
 * Phase 2 & Phase 3 Database Schema (Menu & Orders)
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

export type OrderType = "pickup" | "delivery";

export interface Database {
  public: {
    Tables: {
      menu_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      menu_items: {
        Row: {
          id: string;
          category_id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          price: number;
          is_sample_price: boolean;
          is_available: boolean;
          is_featured: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          price: number;
          is_sample_price?: boolean;
          is_available?: boolean;
          is_featured?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          price?: number;
          is_sample_price?: boolean;
          is_available?: boolean;
          is_featured?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "menu_items_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "menu_categories";
            referencedColumns: ["id"];
          }
        ];
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          access_token: string;
          idempotency_key: string | null;
          customer_name: string;
          customer_phone: string;
          order_type: OrderType;
          delivery_address: string | null;
          delivery_area: string | null;
          delivery_instructions: string | null;
          customer_note: string | null;
          status: OrderStatus;
          currency: string;
          subtotal: number;
          delivery_fee: number;
          total: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          access_token: string;
          idempotency_key?: string | null;
          customer_name: string;
          customer_phone: string;
          order_type: OrderType;
          delivery_address?: string | null;
          delivery_area?: string | null;
          delivery_instructions?: string | null;
          customer_note?: string | null;
          status?: OrderStatus;
          currency?: string;
          subtotal: number;
          delivery_fee?: number;
          total: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          access_token?: string;
          idempotency_key?: string | null;
          customer_name?: string;
          customer_phone?: string;
          order_type?: OrderType;
          delivery_address?: string | null;
          delivery_area?: string | null;
          delivery_instructions?: string | null;
          customer_note?: string | null;
          status?: OrderStatus;
          currency?: string;
          subtotal?: number;
          delivery_fee?: number;
          total?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          menu_item_id: string | null;
          item_name: string;
          unit_price: number;
          quantity: number;
          line_total: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          menu_item_id?: string | null;
          item_name: string;
          unit_price: number;
          quantity: number;
          line_total: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          menu_item_id?: string | null;
          item_name?: string;
          unit_price?: number;
          quantity?: number;
          line_total?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_menu_item_id_fkey";
            columns: ["menu_item_id"];
            isOneToOne: false;
            referencedRelation: "menu_items";
            referencedColumns: ["id"];
          }
        ];
      };
      order_status_logs: {
        Row: {
          id: string;
          order_id: string;
          previous_status: OrderStatus | null;
          new_status: OrderStatus;
          changed_by: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          previous_status?: OrderStatus | null;
          new_status: OrderStatus;
          changed_by?: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          previous_status?: OrderStatus | null;
          new_status?: OrderStatus;
          changed_by?: string;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "order_status_logs_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          }
        ];
      };
      restaurant_settings: {
        Row: {
          id: string;
          key: string;
          value: Json;
          description: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: Json;
          description?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: Json;
          description?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type MenuCategoryRow = Database["public"]["Tables"]["menu_categories"]["Row"];
export type MenuItemRow = Database["public"]["Tables"]["menu_items"]["Row"];
export type OrderRow = Database["public"]["Tables"]["orders"]["Row"];
export type OrderItemRow = Database["public"]["Tables"]["order_items"]["Row"];
export type OrderStatusLogRow = Database["public"]["Tables"]["order_status_logs"]["Row"];
export type RestaurantSettingRow = Database["public"]["Tables"]["restaurant_settings"]["Row"];

export type PaymentStatus = "unpaid" | "pending" | "paid" | "failed" | "refunded";

export interface DeliveryZone {
  area: string;
  fee: number;
}

export interface DeliveryConfig {
  enabled: boolean;
  policy_notice?: string;
  zones: DeliveryZone[];
  min_order: number;
}

export interface OperatingHoursConfig {
  monday_saturday: string;
  sunday: string;
  pickup_enabled: boolean;
  location: string;
}

export type MenuItemWithCategory = MenuItemRow & {
  category?: MenuCategoryRow | null;
};

export type OrderWithItems = OrderRow & {
  order_items: OrderItemRow[];
  order_status_logs?: OrderStatusLogRow[];
};
