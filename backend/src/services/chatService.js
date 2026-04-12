const supabase = require("../config/supabase");

class ChatService {
  // Get or create conversation
  async getOrCreateConversation(participant1, participant2) {
    // 1. Check if exists
    const { data: conversation, error: fetchError } = await supabase
      .from("conversations")
      .select("*")
      .overlaps("participants", [participant1, participant2])
      .filter("participants", "cs", `{${participant1},${participant2}}`) // Contains all
      .single();

    if (conversation) return conversation;

    // 2. Create if not exists
    const { data: newConversation, error: createError } = await supabase
      .from("conversations")
      .insert([{ participants: [participant1, participant2] }])
      .select()
      .single();

    if (createError) throw createError;
    return newConversation;
  }

  // Send message
  async sendMessage(conversationId, sender, recipient, content) {
    // 1. Create message
    const { data: message, error: messageError } = await supabase
      .from("messages")
      .insert([{
        conversation_id: conversationId,
        sender_id: sender,
        recipient_id: recipient,
        text: content
      }])
      .select()
      .single();

    if (messageError) throw messageError;

    // 2. Update conversation
    await supabase
      .from("conversations")
      .update({
        last_message_text: content,
        last_message_time: new Date().toISOString()
      })
      .eq("id", conversationId);

    return message;
  }

  // Get conversation messages
  async getConversationMessages(conversationId, page = 1, limit = 20) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: messages, count, error } = await supabase
      .from("messages")
      .select(`
        *,
        sender:users!sender_id(first_name, last_name, profile_image),
        recipient:users!recipient_id(first_name, last_name, profile_image)
      `, { count: 'exact' })
      .eq("conversation_id", conversationId)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      messages: messages.reverse(),
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit),
      },
    };
  }

  // Mark message as read
  async markMessageAsRead(messageId) {
    const { data: message, error } = await supabase
      .from("messages")
      .update({
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq("id", messageId)
      .select()
      .single();

    if (error) throw error;
    return message;
  }

  // Get user conversations
  async getUserConversations(userId, page = 1, limit = 10) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: conversations, count, error } = await supabase
      .from("conversations")
      .select(`
        *,
        participants_data:users!participants(id, first_name, last_name, profile_image)
      `, { count: 'exact' })
      .filter("participants", "cs", `{${userId}}`) // Contains userId
      .order('last_message_time', { ascending: false, nullsFirst: false })
      .range(from, to);

    if (error) throw error;

    return {
      conversations,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit),
      },
    };
  }

  // Delete message
  async deleteMessage(messageId, userId) {
    const { data: message, error: fetchError } = await supabase
      .from("messages")
      .select("sender_id")
      .eq("id", messageId)
      .single();

    if (fetchError || !message) throw new Error("Message not found");
    if (message.sender_id !== userId) throw new Error("Unauthorized to delete this message");

    const { error: deleteError } = await supabase
      .from("messages")
      .delete()
      .eq("id", messageId);

    if (deleteError) throw deleteError;

    return { message: "Message deleted" };
  }

  // Get unread conversation count
  async getUnreadConversationCount(userId) {
    const { count, error } = await supabase
      .from("messages")
      .select("id", { count: 'exact', head: true })
      .eq("recipient_id", userId)
      .eq("is_read", false);

    if (error) throw error;

    return { unreadCount: count };
  }
}

module.exports = new ChatService();
