const supabase = require("../config/supabase");

class MarketplaceService {
  // Create marketplace item
  async createItem(itemData, sellerId) {
    const newItem = {
      seller_id: sellerId,
      title: itemData.title,
      description: itemData.description,
      price: itemData.price,
      images: itemData.images || [],
      category: itemData.category,
      condition: itemData.condition,
    };

    const { data: item, error } = await supabase
      .from("marketplace_items")
      .insert([newItem])
      .select(`
        *,
        seller:users!seller_id(first_name, last_name, profile_image)
      `)
      .single();

    if (error) throw error;
    return item;
  }

  // Get all items with pagination
  async getAllItems(page = 1, limit = 10, filters = {}) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("marketplace_items")
      .select("*, seller:users!seller_id(first_name, last_name, profile_image)", { count: 'exact' })
      .eq("status", "available");

    if (filters.category) query = query.eq("category", filters.category);
    if (filters.minPrice) query = query.gte("price", filters.minPrice);
    if (filters.maxPrice) query = query.lte("price", filters.maxPrice);
    if (filters.condition) query = query.eq("condition", filters.condition);
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    const { data: items, count, error } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      items,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit),
      },
    };
  }

  // Get item by ID
  async getItemById(itemId) {
    const { data: item, error } = await supabase
      .from("marketplace_items")
      .select(`
        *,
        seller:users!seller_id(first_name, last_name, email, profile_image)
      `)
      .eq("id", itemId)
      .single();

    if (error || !item) {
      throw new Error("Item not found");
    }

    // Increment views (Non-atomic in this simplified migration, ideally use RPC)
    await supabase.rpc('increment_item_views', { item_id: itemId });

    return item;
  }

  // Like item
  async likeItem(itemId, userId) {
    const { data: item, error: fetchError } = await supabase
      .from("marketplace_items")
      .select("likes")
      .eq("id", itemId)
      .single();

    if (fetchError || !item) throw new Error("Item not found");

    let currentLikes = item.likes || [];
    const alreadyLiked = currentLikes.includes(userId);

    if (alreadyLiked) {
      currentLikes = currentLikes.filter(id => id !== userId);
    } else {
      currentLikes.push(userId);
    }

    const { error: updateError } = await supabase
      .from("marketplace_items")
      .update({ likes: currentLikes })
      .eq("id", itemId);

    if (updateError) throw updateError;

    return {
      liked: !alreadyLiked,
      totalLikes: currentLikes.length,
    };
  }

  // Send inquiry
  async sendInquiry(itemId, buyerId, message) {
    const { data: item, error: fetchError } = await supabase
      .from("marketplace_items")
      .select("inquiries")
      .eq("id", itemId)
      .single();

    if (fetchError || !item) throw new Error("Item not found");

    const inquiries = [...(item.inquiries || []), { buyerId, message, date: new Date().toISOString() }];

    const { error: updateError } = await supabase
      .from("marketplace_items")
      .update({ inquiries })
      .eq("id", itemId);

    if (updateError) throw updateError;

    return {
      inquirySent: true,
      message: "Inquiry sent to seller",
    };
  }

  // Mark as sold
  async markAsSold(itemId, sellerId, buyerId) {
    const { data: item, error: fetchError } = await supabase
      .from("marketplace_items")
      .select("seller_id")
      .eq("id", itemId)
      .single();

    if (fetchError || !item) throw new Error("Item not found");
    if (item.seller_id !== sellerId) throw new Error("Unauthorized to sell this item");

    const { error: updateError } = await supabase
      .from("marketplace_items")
      .update({
        status: "sold",
        sold_to: buyerId,
        sold_at: new Date().toISOString()
      })
      .eq("id", itemId);

    if (updateError) throw updateError;

    return {
      sold: true,
      message: "Item marked as sold",
    };
  }

  // Get seller's items
  async getSellerItems(sellerId, page = 1, limit = 10) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: items, count, error } = await supabase
      .from("marketplace_items")
      .select("*, seller:users!seller_id(first_name, last_name, profile_image)", { count: 'exact' })
      .eq("seller_id", sellerId)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      items,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit),
      },
    };
  }

  // Get buyer's purchases
  async getBuyerPurchases(buyerId, page = 1, limit = 10) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: items, count, error } = await supabase
      .from("marketplace_items")
      .select("*, seller:users!seller_id(first_name, last_name, profile_image)", { count: 'exact' })
      .eq("sold_to", buyerId)
      .order('sold_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      items,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit),
      },
    };
  }
}

module.exports = new MarketplaceService();
