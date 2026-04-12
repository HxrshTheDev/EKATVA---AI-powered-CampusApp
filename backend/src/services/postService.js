const supabase = require("../config/supabase");

class PostService {
  // Create post
  async createPost(userId, postData) {
    const newPost = {
      author_id: userId,
      content: postData.content,
      images: postData.images || [],
      // visibility not used in current schema but can be added
    };

    const { data: post, error } = await supabase
      .from("posts")
      .insert([newPost])
      .select(`
        *,
        author:users!author_id(first_name, last_name, profile_image)
      `)
      .single();

    if (error) throw error;

    return post;
  }

  // Get all posts with pagination
  async getAllPosts(page = 1, limit = 10) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: posts, count, error } = await supabase
      .from("posts")
      .select(`
        *,
        author:users!author_id(first_name, last_name, profile_image)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      posts,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit),
      },
    };
  }

  // Get post by ID
  async getPostById(postId) {
    const { data: post, error } = await supabase
      .from("posts")
      .select(`
        *,
        author:users!author_id(first_name, last_name, profile_image)
      `)
      .eq("id", postId)
      .single();

    if (error || !post) {
      throw new Error("Post not found");
    }

    return post;
  }

  // Like post
  async likePost(postId, userId) {
    // 1. Get current likes
    const { data: post, error: fetchError } = await supabase
      .from("posts")
      .select("likes")
      .eq("id", postId)
      .single();

    if (fetchError || !post) throw new Error("Post not found");

    let currentLikes = post.likes || [];
    const alreadyLiked = currentLikes.includes(userId);

    if (alreadyLiked) {
      // Remove like
      currentLikes = currentLikes.filter(id => id !== userId);
    } else {
      // Add like
      currentLikes.push(userId);
    }

    // 2. Update post
    const { error: updateError } = await supabase
      .from("posts")
      .update({ likes: currentLikes })
      .eq("id", postId);

    if (updateError) throw updateError;

    return {
      liked: !alreadyLiked,
      totalLikes: currentLikes.length,
    };
  }

  // Add comment to post
  async addComment(postId, userId, commentText) {
    // Comments are stored as JSONB in this simplified migration
    const { data: post, error: fetchError } = await supabase
      .from("posts")
      .select("comments")
      .eq("id", postId)
      .single();

    if (fetchError || !post) throw new Error("Post not found");

    const newComment = {
      id: crypto.randomUUID(), // Using crypto for simple ID
      userId,
      text: commentText,
      created_at: new Date().toISOString()
    };

    const updatedComments = [...(post.comments || []), newComment];

    const { data: updatedPost, error: updateError } = await supabase
      .from("posts")
      .update({ comments: updatedComments })
      .eq("id", postId)
      .select()
      .single();

    if (updateError) throw updateError;

    return newComment;
  }

  // Delete post
  async deletePost(postId, userId) {
    const { data: post, error: fetchError } = await supabase
      .from("posts")
      .select("author_id")
      .eq("id", postId)
      .single();

    if (fetchError || !post) throw new Error("Post not found");

    if (post.author_id !== userId) {
      throw new Error("Unauthorized to delete this post");
    }

    const { error: deleteError } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId);

    if (deleteError) throw deleteError;

    return { message: "Post deleted successfully" };
  }

  // Get user's posts
  async getUserPosts(userId, page = 1, limit = 10) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: posts, count, error } = await supabase
      .from("posts")
      .select(`
        *,
        author:users!author_id(first_name, last_name, profile_image)
      `, { count: 'exact' })
      .eq("author_id", userId)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      posts,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit),
      },
    };
  }
}

module.exports = new PostService();
