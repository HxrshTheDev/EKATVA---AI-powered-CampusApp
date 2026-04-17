// SAARTHI AI Engine - Simulated AI Logic

/**
 * Predict GPA based on attendance, study hours, and assignment completion
 */
const predictGPA = (
  attendance,
  studyHours,
  assignmentCompletion,
  currentGPA,
) => {
  let predicatedGPA = currentGPA;

  // Influence of attendance (up to 2 points)
  if (attendance >= 75) predicatedGPA += 0.5;
  if (attendance >= 85) predicatedGPA += 0.5;
  if (attendance >= 95) predicatedGPA += 0.5;

  // Influence of study hours (up to 2 points)
  if (studyHours >= 15) predicatedGPA += 0.4;
  if (studyHours >= 25) predicatedGPA += 0.6;
  if (studyHours >= 35) predicatedGPA += 0.6;

  // Influence of assignment completion (up to 1.5 points)
  if (assignmentCompletion >= 80) predicatedGPA += 0.75;
  if (assignmentCompletion >= 90) predicatedGPA += 0.75;

  // Cap at 10
  return Math.min(predicatedGPA, 10);
};

/**
 * Detect attendance risk level
 */
const detectAttendanceRisk = (attendance) => {
  if (attendance >= 85) return { level: "low", color: "green" };
  if (attendance >= 75) return { level: "medium", color: "yellow" };
  if (attendance >= 65) return { level: "high", color: "orange" };
  return { level: "critical", color: "red" };
};

/**
 * Calculate placement readiness score (0-100)
 */
const calculatePlacementReadiness = (
  user,
  skills,
  gpa,
  projects,
  internships,
) => {
  let score = 40; // Base score

  // GPA contribution (0-20)
  const gpaScore = (gpa / 10) * 20;
  score += gpaScore;

  // Skills contribution (0-15)
  const skillScore = Math.min(skills.length * 2, 15);
  score += skillScore;

  // Projects contribution (0-15)
  const projectScore = Math.min(projects * 3, 15);
  score += projectScore;

  // Internship contribution (0-10)
  const internshipScore = internships * 10;
  score += Math.min(internshipScore, 10);

  return Math.min(Math.round(score), 100);
};

/**
 * Generate AI suggestions based on user data
 */
const generateSuggestions = (digitalTwin, gamification) => {
  const suggestions = [];

  // Attendance suggestions
  if (digitalTwin.attendance.attendancePercentage < 75) {
    suggestions.push({
      type: "warning",
      priority: "high",
      suggestion: `Your attendance is ${digitalTwin.attendance.attendancePercentage}%. Try to attend more classes. Missing 5+ more classes could affect your final grade.`,
      action: "improve-attendance",
    });
  }

  // Study hour suggestions
  if (
    digitalTwin.studyHours.currentWeek < digitalTwin.studyHours.weeklyTarget
  ) {
    const deficit =
      digitalTwin.studyHours.weeklyTarget - digitalTwin.studyHours.currentWeek;
    suggestions.push({
      type: "suggestion",
      priority: "medium",
      suggestion: `You're ${deficit} hours short of your weekly study goal. Dedicate 2-3 hours daily to catch up.`,
      action: "increase-study-hours",
    });
  }

  // Assignment suggestions
  const pendingAssignments = digitalTwin.assignments.pending.length;
  if (pendingAssignments > 2) {
    suggestions.push({
      type: "warning",
      priority: "high",
      suggestion: `You have ${pendingAssignments} pending assignments. Complete them to improve your GPA.`,
      action: "complete-assignments",
    });
  }

  // Gamification suggestions
  if (gamification.dailyStreak === 0) {
    suggestions.push({
      type: "motivation",
      priority: "low",
      suggestion:
        "Start your daily streak! Login and complete a task every day to earn XP and badges.",
      action: "start-streak",
    });
  }

  // XP and level suggestions
  if (gamification.level < 5) {
    suggestions.push({
      type: "motivation",
      priority: "medium",
      suggestion:
        "You can reach level 2! Participate in activities, complete assignments, and join events.",
      action: "earn-xp",
    });
  }

  return suggestions;
};

/**
 * What-if simulation: Predict outcome if study hours increase
 */
const whatIfScenario = (currentData, changedValue, changeType) => {
  const simulation = { ...currentData };

  switch (changeType) {
    case "study-hours":
      simulation.projectedGPA = predictGPA(
        currentData.attendance,
        changedValue,
        currentData.assignmentCompletion,
        currentData.currentGPA,
      );
      simulation.gpaImprovement = (
        simulation.projectedGPA - currentData.currentGPA
      ).toFixed(2);
      break;

    case "attendance":
      simulation.riskLevel = detectAttendanceRisk(changedValue, null);
      simulation.projectedGPA = predictGPA(
        changedValue,
        currentData.studyHours,
        currentData.assignmentCompletion,
        currentData.currentGPA,
      );
      break;

    case "assignments":
      simulation.projectedGPA = predictGPA(
        currentData.attendance,
        currentData.studyHours,
        changedValue,
        currentData.currentGPA,
      );
      simulation.gpaImprovement = (
        simulation.projectedGPA - currentData.currentGPA
      ).toFixed(2);
      break;

    default:
      break;
  }

  return simulation;
};

/**
 * Calculate Holistic Excellence Score (0-100)
 * Weighted: 40% Academics, 30% Skills/Certs, 30% Participation
 */
const calculateHolisticScore = (userData) => {
  const { 
    gpa = 7.0, 
    attendance = 75, 
    certifications = [], 
    participationCount = 0 
  } = userData;

  // 1. Academic Score (0-40)
  const academicScore = ((gpa / 10) * 20) + ((attendance / 100) * 20);

  // 2. Skills/Certs Score (0-30)
  const certScore = Math.min(certifications.length * 7.5, 30);

  // 3. Participation Score (0-30)
  const partScore = Math.min(participationCount * 10, 30);

  return Math.round(academicScore + certScore + partScore);
};

/**
 * Analyze academic health
 */
const analyzeAcademicHealth = (attendance, gpa, studyHours, assignments) => {
  let health = "good";

  if (gpa >= 8 && attendance >= 85 && studyHours >= 20 && assignments >= 80) {
    health = "excellent";
  } else if (
    gpa >= 7 &&
    attendance >= 75 &&
    studyHours >= 15 &&
    assignments >= 70
  ) {
    health = "good";
  } else if (gpa >= 6 && attendance >= 65 && studyHours >= 10) {
    health = "average";
  } else {
    health = "at-risk";
  }

  return health;
};

module.exports = {
  predictGPA,
  detectAttendanceRisk,
  calculatePlacementReadiness,
  generateSuggestions,
  whatIfScenario,
  analyzeAcademicHealth,
  calculateHolisticScore,
};
