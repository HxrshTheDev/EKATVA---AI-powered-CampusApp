const supabase = require("../config/supabase");
const bcrypt = require("bcryptjs");
const { generateTokens } = require("../utils/tokenUtils");

class AuthService {
  // Register new user
  async register(userData) {
    try {
      // Check if user exists
      const { data: existingUser, error: checkError } = await supabase
        .from("users")
        .select("id")
        .or(`email.eq.${userData.email},roll_number.eq.${userData.rollNumber}`)
        .single();

      if (existingUser) {
        throw new Error("User with this email or roll number already exists");
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Prepare user data for Supabase (camelCase to snake_case)
      const newUser = {
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        password: hashedPassword,
        profile_image: userData.profileImage || null,
        bio: userData.bio || "",
        college: userData.college,
        course: userData.course,
        year: userData.year,
        roll_number: userData.rollNumber,
        skills: userData.skills || [],
        interests: userData.interests || [],
        role: userData.role || "student",
      };

      // Create new user in Supabase
      const { data: user, error: insertError } = await supabase
        .from("users")
        .insert([newUser])
        .select()
        .single();

      if (insertError) throw insertError;

      // Create digital twin for user
      const { error: twinError } = await supabase
        .from("digital_twins")
        .insert([{ user_id: user.id }]);

      if (twinError) console.error("Failed to create digital twin:", twinError.message);

      // Create gamification record for user
      const { error: gamificationError } = await supabase
        .from("gamification")
        .insert([{ user_id: user.id }]);

      if (gamificationError) console.error("Failed to create gamification record:", gamificationError.message);

      // Generate token
      const { accessToken } = generateTokens(user.id, user.role);

      // Return user without password (using snake_to_camel conversion if needed, but for now just filter)
      const userResponse = { ...user };
      delete userResponse.password;

      return {
        user: userResponse,
        accessToken,
      };
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  // Login user
  async login(email, password) {
    try {
      const { data: user, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      if (fetchError || !user) {
        throw new Error("Invalid email or password");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new Error("Invalid email or password");
      }

      if (!user.is_active) {
        throw new Error("Account is deactivated");
      }

      const { accessToken } = generateTokens(user.id, user.role);

      const userResponse = { ...user };
      delete userResponse.password;

      return {
        user: userResponse,
        accessToken,
      };
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  // Get user by ID
  async getUserById(userId) {
    const { data: user, error } = await supabase
      .from("users")
      .select(`
        *,
        connection_requests:connection_requests!to_user_id(from_user_id, status)
      `)
      .eq("id", userId)
      .single();

    if (error || !user) {
      throw new Error("User not found");
    }

    // In a real app, you'd populate connections here. 
    // Supabase can do this with joins if the schema is right.
    
    const userResponse = { ...user };
    delete userResponse.password;

    return userResponse;
  }

  // Update user profile
  async updateProfile(userId, updateData) {
    const allowedFieldsMap = {
      firstName: "first_name",
      lastName: "last_name",
      bio: "bio",
      skills: "skills",
      interests: "interests",
      profileImage: "profile_image",
    };

    const updateObject = {};
    Object.keys(updateData).forEach((key) => {
      if (allowedFieldsMap[key]) {
        updateObject[allowedFieldsMap[key]] = updateData[key];
      }
    });

    const { data: user, error } = await supabase
      .from("users")
      .update(updateObject)
      .eq("id", userId)
      .select()
      .single();

    if (error || !user) {
      throw new Error(`Profile update failed: ${error?.message || "User not found"}`);
    }

    const userResponse = { ...user };
    delete userResponse.password;

    return userResponse;
  }

  // Send connection request
  async sendConnectionRequest(fromUserId, toUserId) {
    if (fromUserId === toUserId) {
      throw new Error("Cannot send connection request to yourself");
    }

    // Check if request already exists
    const { data: existingRequest } = await supabase
      .from("connection_requests")
      .select("id")
      .eq("from_user_id", fromUserId)
      .eq("to_user_id", toUserId)
      .eq("status", "pending")
      .single();

    if (existingRequest) {
      throw new Error("Connection request already sent");
    }

    const { error } = await supabase
      .from("connection_requests")
      .insert([
        { from_user_id: fromUserId, to_user_id: toUserId, status: "pending" }
      ]);

    if (error) throw error;

    return { message: "Connection request sent" };
  }

  // Accept connection request
  async acceptConnectionRequest(userId, fromUserId) {
    // Start a "transaction" - in Supabase we can use RPC or just multiple calls for simplicity here
    // In production, use a Postgres Function (RPC)

    // 1. Update request status
    const { error: updateError } = await supabase
      .from("connection_requests")
      .update({ status: "accepted" })
      .eq("from_user_id", fromUserId)
      .eq("to_user_id", userId);

    if (updateError) throw updateError;

    // 2. Add to connections array for both users
    // This is a bit tricky with arrays in SQL, usually a join table is better.
    // But sticking to the current array implementation for now.
    
    const { error: error1 } = await supabase.rpc('add_connection', { 
      user_id: userId, 
      friend_id: fromUserId 
    });
    
    const { error: error2 } = await supabase.rpc('add_connection', { 
      user_id: fromUserId, 
      friend_id: userId 
    });

    // NOTE: This requires a PG function 'add_connection'. I'll add it to the schema.

    return { message: "Connection request accepted" };
  }
}

module.exports = new AuthService();
