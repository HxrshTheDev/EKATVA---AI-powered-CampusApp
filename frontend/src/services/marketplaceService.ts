import { supabase } from "../config/supabaseClient";

export const getListings = async () => {
  const { data, error } = await supabase
    .from("marketplace")
    .select(`
      *,
      seller:seller_id ( first_name, last_name, email )
    `)
    .order("created_at", { ascending: false });

  if (error) return { success: false, error: error.message };
  return { success: true, data };
};

export const createListing = async (sellerId: string, listingData: any) => {
  const { data, error } = await supabase
    .from("marketplace")
    .insert([{ seller_id: sellerId, ...listingData }])
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data };
};

export const messageSeller = async (senderId: string, sellerId: string, message: string) => {
  const { data, error } = await supabase
    .from("messages")
    .insert([{ 
      sender_id: senderId, 
      receiver_id: sellerId, 
      content: message,
      is_read: false 
    }])
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data };
};

export const addToWishlist = async (userId: string, itemTitle: string) => {
  const { data, error } = await supabase
    .from("wishlists")
    .insert([{ user_id: userId, item_name: itemTitle }])
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data };
};

export const checkoutItem = async (buyerId: string, sellerName: string, itemTitle: string, price: string) => {
  const { data, error } = await supabase
    .from("purchases")
    .insert([{ 
      buyer_id: buyerId, 
      seller_name: sellerName, 
      item_name: itemTitle, 
      price: price 
    }])
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data };
};
