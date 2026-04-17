import { supabase } from "../config/supabaseClient";

export const getAllPosts = async () => {
  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      users:user_id ( first_name, last_name, role, avatar_url )
    `)
    .order("created_at", { ascending: false });

  if (error) return { success: false, error: error.message };
  return { success: true, data };
};

export const createPost = async (userId: string, content: string) => {
  const { data, error } = await supabase
    .from("posts")
    .insert([{ user_id: userId, content }])
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data };
};

export const likePost = async (postId: string, userId: string) => {
  // First, get current post
  const { data: post, error: fetchError } = await supabase
    .from("posts")
    .select("likes")
    .eq("id", postId)
    .single();

  if (fetchError || !post) return { success: false, error: fetchError?.message };

  let likes = post.likes || [];
  if (likes.includes(userId)) {
    likes = likes.filter((id: string) => id !== userId);
  } else {
    likes.push(userId);
  }

  const { data, error } = await supabase
    .from("posts")
    .update({ likes })
    .eq("id", postId)
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data };
};

export const commentOnPost = async (postId: string, userId: string, commentText: string) => {
  const { data: post, error: fetchError } = await supabase
    .from("posts")
    .select("comments")
    .eq("id", postId)
    .single();

  if (fetchError || !post) return { success: false, error: fetchError?.message };

  const comments = post.comments || [];
  comments.push({
    user_id: userId,
    text: commentText,
    created_at: new Date().toISOString()
  });

  const { data, error } = await supabase
    .from("posts")
    .update({ comments })
    .eq("id", postId)
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data };
};
