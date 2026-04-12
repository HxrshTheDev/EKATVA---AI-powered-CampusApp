// Calculate level from XP
const calculateLevel = (totalXP) => {
  // Simple formula: 500 XP per level
  return Math.floor(totalXP / 500) + 1;
};

// Calculate XP required for next level
const calculateXPToNextLevel = (currentLevel) => {
  return 500 * currentLevel;
};

// Calculate current level XP
const calculateCurrentLevelXP = (totalXP) => {
  const currentLevel = calculateLevel(totalXP);
  return totalXP - (currentLevel - 1) * 500;
};

// Get level badge based on level
const getLevelBadge = (level) => {
  if (level < 5) return "Novice";
  if (level < 10) return "Beginner";
  if (level < 15) return "Intermediate";
  if (level < 20) return "Advanced";
  if (level < 25) return "Expert";
  return "Master";
};

module.exports = {
  calculateLevel,
  calculateXPToNextLevel,
  calculateCurrentLevelXP,
  getLevelBadge,
};
