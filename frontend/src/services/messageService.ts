import { supabase } from "../config/supabaseClient";

export const getMessages = async (userId: string, contactId: string) => {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .or(`and(sender_id.eq.${userId},receiver_id.eq.${contactId}),and(sender_id.eq.${contactId},receiver_id.eq.${userId})`)
    .order("created_at", { ascending: true });

  if (error) return { success: false, error: error.message };
  return { success: true, data };
};

export const sendMessage = async (senderId: string, receiverId: string, content: string) => {
  const { data, error } = await supabase
    .from("messages")
    .insert([{ sender_id: senderId, receiver_id: receiverId, content }])
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data };
};
