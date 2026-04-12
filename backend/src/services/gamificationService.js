const supabase = require("../config/supabase");
const gamificationUtils = require("../utils/gamificationUtils");

class GamificationService {
  // Get gamification data
  async getGamification(userId) {
    const { data: gamification, error } = await supabase
      .from("gamification")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error || !gamification) {
      throw new Error("Gamification data not found");
    }

    return gamification;
  }

  // Award XP to user
  async awardXP(userId, xpAmount, activity) {
    const { data: gamification, error: fetchError } = await supabase
      .from("gamification")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (fetchError || !gamification) {
      throw new Error("Gamification data not found");
    }

    const oldLevel = gamification.level;
    const totalXP = gamification.total_xp + xpAmount;
    
    const xp_history = gamification.xp_history || [];
    xp_history.push({
      date: new Date().toISOString(),
      xpEarned: xpAmount,
      activity,
      description: `Earned ${xpAmount} XP for ${activity}`,
    });

    const newLevel = gamificationUtils.calculateLevel(totalXP);
    const leveledUp = newLevel > oldLevel;

    const badges = gamification.badges || [];
    if (leveledUp) {
      badges.push({
        badgeId: `level_${newLevel}`,
        name: `Level ${newLevel}`,
        description: `Reached level ${newLevel}`,
        icon: `https://example.com/badges/level_${newLevel}.png`,
      });
    }

    const { data: updatedGamification, error: updateError } = await supabase
      .from("gamification")
      .update({
        total_xp: totalXP,
        level: newLevel,
        xp_history: xp_history,
        badges: badges,
        last_xp_awarded: new Date().toISOString()
      })
      .eq("user_id", userId)
      .select()
      .single();

    if (updateError) throw updateError;

    return {
      totalXP: updatedGamification.total_xp,
      level: updatedGamification.level,
      xpEarned: xpAmount,
      leveledUp,
    };
  }

  // Update daily streak
  async updateDailyStreak(userId) {
    const { data: gamification, error: fetchError } = await supabase
      .from("gamification")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (fetchError || !gamification) {
      throw new Error("Gamification data not found");
    }

    const today = new Date().toDateString();
    const lastActiveDate = gamification.last_activity_date ? new Date(gamification.last_activity_date).toDateString() : null;

    if (lastActiveDate === today) {
      return { streak: gamification.daily_streak };
    }

    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toDateString();
    let dailyStreak = gamification.daily_streak;

    if (lastActiveDate === yesterday) {
      dailyStreak += 1;
    } else {
      dailyStreak = 1;
    }

    const maxDailyStreak = Math.max(dailyStreak, gamification.max_daily_streak || 0);

    const { data: updatedGamification, error: updateError } = await supabase
      .from("gamification")
      .update({
        daily_streak: dailyStreak,
        max_daily_streak: maxDailyStreak,
        last_activity_date: new Date().toISOString()
      })
      .eq("user_id", userId)
      .select()
      .single();

    if (updateError) throw updateError;

    return {
      streak: updatedGamification.daily_streak,
      maxStreak: updatedGamification.max_daily_streak,
    };
  }

  // Complete daily task
  async completeDailyTask(userId, taskId) {
    const { data: gamification, error: fetchError } = await supabase
      .from("gamification")
      .select("daily_tasks")
      .eq("user_id", userId)
      .single();

    if (fetchError || !gamification) {
      throw new Error("Gamification data not found");
    }

    const dailyTasks = [...(gamification.daily_tasks || [])];
    const taskIndex = dailyTasks.findIndex((t) => t.taskId === taskId);

    if (taskIndex === -1) throw new Error("Task not found");
    if (dailyTasks[taskIndex].status === "completed") throw new Error("Task already completed");

    dailyTasks[taskIndex].status = "completed";
    dailyTasks[taskIndex].completedAt = new Date().toISOString();

    const { error: updateError } = await supabase
      .from("gamification")
      .update({ daily_tasks: dailyTasks })
      .eq("user_id", userId);

    if (updateError) throw updateError;

    const xpResult = await this.awardXP(
      userId,
      dailyTasks[taskIndex].xpReward,
      `Complete daily task: ${dailyTasks[taskIndex].title}`
    );

    return {
      taskCompleted: true,
      xpEarned: dailyTasks[taskIndex].xpReward,
      leveledUp: xpResult.leveledUp,
    };
  }

  // Complete mission
  async completeMission(userId, missionId) {
    const { data: gamification, error: fetchError } = await supabase
      .from("gamification")
      .select("missions")
      .eq("user_id", userId)
      .single();

    if (fetchError || !gamification) {
      throw new Error("Gamification data not found");
    }

    const missions = [...(gamification.missions || [])];
    const missionIndex = missions.findIndex((m) => m.missionId === missionId);

    if (missionIndex === -1) throw new Error("Mission not found");
    if (missions[missionIndex].status === "completed") throw new Error("Mission already completed");

    missions[missionIndex].status = "completed";
    missions[missionIndex].completedAt = new Date().toISOString();

    const { error: updateError } = await supabase
      .from("gamification")
      .update({ missions: missions })
      .eq("user_id", userId);

    if (updateError) throw updateError;

    const xpResult = await this.awardXP(
      userId,
      missions[missionIndex].xpReward,
      `Complete mission: ${missions[missionIndex].title}`
    );

    return {
      missionCompleted: true,
      xpEarned: missions[missionIndex].xpReward,
      leveledUp: xpResult.leveledUp,
    };
  }

  // Get leaderboard
  async getLeaderboard(limit = 10) {
    const { data: leaderboard, error } = await supabase
      .from("gamification")
      .select(`
        total_xp,
        level,
        daily_streak,
        user:users!user_id(first_name, last_name, profile_image)
      `)
      .order('total_xp', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return leaderboard.map((entry, index) => ({
      rank: index + 1,
      user: entry.user,
      totalXP: entry.total_xp,
      level: entry.level,
      streak: entry.daily_streak,
    }));
  }

  // Initialize default daily tasks
  async initializeDailyTasks(userId) {
    const defaultTasks = [
      { taskId: "login", title: "Daily Login", xpReward: 10, status: "pending" },
      { taskId: "study-2-hours", title: "Study for 2 Hours", xpReward: 50, status: "pending" },
      { taskId: "complete-assignment", title: "Complete an Assignment", xpReward: 30, status: "pending" },
      { taskId: "attend-class", title: "Attend a Class", xpReward: 20, status: "pending" },
      { taskId: "connect-user", title: "Make a Connection", xpReward: 25, status: "pending" },
    ];

    const { error } = await supabase
      .from("gamification")
      .update({ daily_tasks: defaultTasks })
      .eq("user_id", userId);

    if (error) throw error;

    return defaultTasks;
  }
}

module.exports = new GamificationService();
