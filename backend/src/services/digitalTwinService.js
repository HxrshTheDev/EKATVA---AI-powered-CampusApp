const supabase = require("../config/supabase");
const saarthiEngine = require("../utils/saarthiEngine");

class DigitalTwinService {
  // Get digital twin for user
  async getDigitalTwin(userId) {
    const { data: digitalTwin, error } = await supabase
      .from("digital_twins")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error || !digitalTwin) {
      throw new Error("Digital twin not found");
    }

    return digitalTwin;
  }

  // Update attendance
  async updateAttendance(userId, attendanceData) {
    const { data: digitalTwin, error: fetchError } = await supabase
      .from("digital_twins")
      .select("attendance")
      .eq("user_id", userId)
      .single();

    if (fetchError || !digitalTwin) {
      throw new Error("Digital twin not found");
    }

    const attendance = digitalTwin.attendance || {};
    
    if (attendanceData.totalClasses) {
      attendance.totalClasses = attendanceData.totalClasses;
    }

    if (attendanceData.attendedClasses !== undefined) {
      attendance.attendedClasses = attendanceData.attendedClasses;
      // Calculate percentage
      const percentage = (
        (attendanceData.attendedClasses / (attendance.totalClasses || 1)) *
        100
      ).toFixed(2);
      attendance.attendancePercentage = parseFloat(percentage);
    }

    attendance.lastUpdated = new Date().toISOString();

    const { data: updatedTwin, error: updateError } = await supabase
      .from("digital_twins")
      .update({ attendance })
      .eq("user_id", userId)
      .select()
      .single();

    if (updateError) throw updateError;

    return updatedTwin.attendance;
  }

  // Update study hours
  async updateStudyHours(userId, hoursStored) {
    const { data: digitalTwin, error: fetchError } = await supabase
      .from("digital_twins")
      .select("study_hours")
      .eq("user_id", userId)
      .single();

    if (fetchError || !digitalTwin) {
      throw new Error("Digital twin not found");
    }

    const studyHours = digitalTwin.study_hours || { currentWeek: 0, totalHours: 0, history: [] };
    
    studyHours.currentWeek += hoursStored;
    studyHours.totalHours += hoursStored;
    studyHours.history.push({
      date: new Date().toISOString(),
      hours: hoursStored,
    });

    const { data: updatedTwin, error: updateError } = await supabase
      .from("digital_twins")
      .update({ study_hours: studyHours })
      .eq("user_id", userId)
      .select()
      .single();

    if (updateError) throw updateError;

    return updatedTwin.study_hours;
  }

  // Update assignments
  async updateAssignments(userId, assignmentData) {
    const { data: digitalTwin, error: fetchError } = await supabase
      .from("digital_twins")
      .select("assignments")
      .eq("user_id", userId)
      .single();

    if (fetchError || !digitalTwin) {
      throw new Error("Digital twin not found");
    }

    const assignments = digitalTwin.assignments || { total: 0, completed: 0, pending: [] };

    assignments.total = assignmentData.total || assignments.total;
    assignments.completed = assignmentData.completed || assignments.completed;

    if (assignmentData.pending) {
      assignments.pending = assignmentData.pending;
    }

    const { data: updatedTwin, error: updateError } = await supabase
      .from("digital_twins")
      .update({ assignments })
      .eq("user_id", userId)
      .select()
      .single();

    if (updateError) throw updateError;

    return updatedTwin.assignments;
  }

  // Log activity
  async logActivity(userId, activity, xpEarned = 10) {
    const { data: digitalTwin, error: fetchError } = await supabase
      .from("digital_twins")
      .select("activity_score")
      .eq("user_id", userId)
      .single();

    if (fetchError || !digitalTwin) {
      throw new Error("Digital twin not found");
    }

    const activityScore = digitalTwin.activity_score || { dailyScore: 0, activities: [] };

    activityScore.activities.push({
      type: activity,
      description: `User completed ${activity}`,
      timestamp: new Date().toISOString(),
      xpEarned,
    });

    // Recalculate daily score
    const today = new Date().toDateString();
    const todayActivities = activityScore.activities.filter(
      (a) => new Date(a.timestamp).toDateString() === today,
    );
    const dailyXP = todayActivities.reduce((sum, a) => sum + a.xpEarned, 0);
    activityScore.dailyScore = Math.min(dailyXP / 10, 100); // Normalize to 0-100

    const { data: updatedTwin, error: updateError } = await supabase
      .from("digital_twins")
      .update({ activity_score: activityScore })
      .eq("user_id", userId)
      .select()
      .single();

    if (updateError) throw updateError;

    return {
      activity,
      xpEarned,
      dailyScore: updatedTwin.activity_score.dailyScore,
    };
  }

  // Generate AI insights
  async generateInsights(userId) {
    const { data: digitalTwin, error: fetchError } = await supabase
      .from("digital_twins")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (fetchError || !digitalTwin) {
      throw new Error("Digital twin not found");
    }

    const attendance = digitalTwin.attendance || {};
    const studyHours = digitalTwin.study_hours || {};
    const assignments = digitalTwin.assignments || {};

    // Analyze academic health
    const academicHealth = saarthiEngine.analyzeAcademicHealth(
      attendance.attendancePercentage || 0,
      digitalTwin.current_gpa || 0,
      studyHours.currentWeek || 0,
      ((assignments.completed || 0) / (assignments.total || 1)) * 100,
    );

    // GPA prediction
    const gpaPrediction = saarthiEngine.predictGPA(
      attendance.attendancePercentage || 0,
      studyHours.currentWeek || 0,
      ((assignments.completed || 0) / (assignments.total || 1)) * 100,
      digitalTwin.current_gpa || 0,
    );

    const insights = [];

    insights.push({
      date: new Date().toISOString(),
      title: "GPA Prediction",
      description: `Your predicted GPA is ${gpaPrediction.toFixed(2)} based on current performance`,
      type: "suggestion",
    });

    // Risk detection
    const riskLevel = saarthiEngine.detectAttendanceRisk(
      attendance.attendancePercentage || 0,
      null,
    );

    if (riskLevel.level !== "low") {
      insights.push({
        date: new Date().toISOString(),
        title: "Attendance Alert",
        description: `Your attendance is ${riskLevel.level}. Current: ${attendance.attendancePercentage}%`,
        type: "warning",
      });
    }

    // Study hours suggestion
    if (studyHours.currentWeek < (studyHours.weeklyTarget || 10)) {
      const deficit = (studyHours.weeklyTarget || 10) - studyHours.currentWeek;
      insights.push({
        date: new Date().toISOString(),
        title: "Study Hours Suggestion",
        description: `You need ${deficit} more hours to meet your weekly target. Aim for 2-3 hours daily.`,
        type: "suggestion",
      });
    }

    const { data: updatedTwin, error: updateError } = await supabase
      .from("digital_twins")
      .update({
        academic_health: academicHealth,
        insights: insights,
        last_insight_generated: new Date().toISOString()
      })
      .eq("user_id", userId)
      .select()
      .single();

    if (updateError) throw updateError;

    return {
      academicHealth,
      insights,
      gpaPrediction,
      riskLevel: riskLevel.level,
    };
  }

  // Get dashboard data
  async getDashboardData(userId) {
    const { data: digitalTwin, error } = await supabase
      .from("digital_twins")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error || !digitalTwin) {
      throw new Error("Digital twin not found");
    }

    const attendance = digitalTwin.attendance || {};
    const studyHours = digitalTwin.study_hours || {};
    const assignments = digitalTwin.assignments || {};
    const activityScore = digitalTwin.activity_score || {};

    // Extracts achievements and participation from the packed insights field
    const insights = digitalTwin.insights || [];
    const certifications = insights.filter(i => i.type === 'achievement') || [];
    const participations = insights.filter(i => i.type === 'participation') || [];

    const holisticScore = saarthiEngine.calculateHolisticScore({
      gpa: digitalTwin.current_gpa,
      attendance: attendance.attendancePercentage,
      certifications,
      participationCount: participations.length
    });

    return {
      gpa: digitalTwin.current_gpa,
      attendance: attendance.attendancePercentage || 0,
      studyHours: studyHours.currentWeek || 0,
      activityScore: activityScore.dailyScore || 0,
      holisticScore,
      achievements: certifications,
      participation: participations,
      pendingAssignments: (assignments.pending || []).length,
      recentInsights: insights.filter(i => i.type === 'insight').slice(-3),
      academicHealth: digitalTwin.academic_health,
    };
  }
}

module.exports = new DigitalTwinService();
