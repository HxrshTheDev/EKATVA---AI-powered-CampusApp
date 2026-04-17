import { supabase } from "../config/supabaseClient";
import { generateAIContent } from "./geminiService";

// Simulated Digital Twin & AI logic for the Frontend

export const getDigitalTwin = async (userId: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("gpa, attendance, xp, level, streak")
    .eq("id", userId)
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data };
};

export const updateDigitalTwin = async (userId: string, updateData: any) => {
  const { data, error } = await supabase
    .from("users")
    .update(updateData)
    .eq("id", userId)
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data };
};

export const getSaarthiInsights = async (userId: string) => {
  try {
    const { data: userData } = await getDigitalTwin(userId);
    if (!userData) return { success: false, error: "User not found" };

    const prompt = `
      User Stats:
      - GPA: ${userData.gpa || "7.5"}
      - Attendance: ${userData.attendance || "85"}%
      - Level: ${userData.level || "1"}
      - Streak: ${userData.streak || "0"}
      
      Generate a single, high-impact Saarthi AI Insight for the student dashboard.
      Include:
      1. A catchy headline (Reclaim X hours, Boost GPA by Y, etc.)
      2. A short description (2 sentences max) based on their energy cycles or stats.
      3. A recommendation message.
      Respond ONLY with a JSON object:
      {
        "headline": "headline here",
        "description": "description here",
        "recommendation": "recommendation here",
        "placementScore": 85,
        "predictedGpa": "8.2",
        "burnoutRisk": "Low"
      }
    `;

    const aiResponse = await generateAIContent(prompt);
    const cleanJson = aiResponse.replace(/```json|```/g, "").trim();
    const insights = JSON.parse(cleanJson);

    return { success: true, data: insights };
  } catch (error: any) {
    console.error("Insights error:", error);
    return { success: false, error: error.message || "Failed to generate insights" };
  }
};

export const chatWithSaarthi = async (userId: string, content: string) => {
  try {
    const { data: userData } = await getDigitalTwin(userId);
    
    const context = `
      User Profile:
      - GPA: ${userData?.gpa || "7.5"}
      - Attendance: ${userData?.attendance || "85"}%
      - Level: ${userData?.level || "1"}
      - XP: ${userData?.xp || "0"}
      - Streak: ${userData?.streak || "0"}
      
      You are Saarthi, an AI academic mentor for the Ekatva Campus App. 
      Your goal is to provide personalized academic guidance, placement tips, and daily planning based on the user's profile.
      Keep your responses professional, encouraging, and focused on student success.
      Format your response using markdown.
      
      User Question: ${content}
    `;

    const aiResponse = await generateAIContent(context);

    return { success: true, data: { content: aiResponse } };
  } catch (error: any) {
    console.error("Chat error:", error);
    return { success: false, error: error.message || "AI failed to respond" };
  }
};

export const enrollInProgram = async (userId: string, program: string) => {
  const { data, error } = await supabase
    .from("enrollments")
    .insert([{ user_id: userId, program, status: "enrolled", enrolled_at: new Date().toISOString() }]);

  if (error) {
    console.error("Enrolment error:", error.message);
    return { success: false, error: error.message };
  }
  return { success: true, data };
};

export const generateAndSaveExam = async (userId: string, topic: string, hasDocument: boolean) => {
  const examTitle = topic || "Document Comprehension";
  
  try {
    const prompt = `
      You are an academic examiner. Create a specialized test about "${examTitle}".
      ${hasDocument ? "The user has uploaded a document about this topic." : ""}
      Generate 3 multiple-choice questions.
      Respond ONLY with a JSON object in the following format:
      {
        "title": "${examTitle}",
        "questions": [
          {
            "id": 1,
            "text": "question text",
            "options": ["opt1", "opt2", "opt3", "opt4"],
            "correctIndex": 0
          }
        ]
      }
    `;

    const aiResponse = await generateAIContent(prompt);
    // Remove markdown code blocks if present
    const cleanJson = aiResponse.replace(/```json|```/g, "").trim();
    const simulatedExam = JSON.parse(cleanJson);
    simulatedExam.generatedAt = new Date().toISOString();

  // Save dynamically generated test directly to Supabase via client
  const { data, error } = await supabase
    .from("generated_exams")
    .insert([{ user_id: userId, topic: examTitle, content: simulatedExam }]);

    if (error) {
      // If table doesn't exist, log and proceed with mocked data anyway
      console.warn("Could not save to Supabase. Table 'generated_exams' might not exist.", error.message);
    }

    return { success: true, data: simulatedExam };
  } catch (error: any) {
    console.error("Exam generation error:", error);
    return { success: false, error: error.message || "Failed to generate exam" };
  }
};

export const analyzeResumeAI = async (userId: string) => {
  try {
    const { data: userData } = await getDigitalTwin(userId);
    const prompt = `
      Analyze a student resume for a user with these stats: GPA ${userData?.gpa || "7.5"}, Attendance ${userData?.attendance || "85"}%.
      Generate a professional resume analysis report.
      Include:
      1. ATS Score (0-100)
      2. Keyword Match percentage
      3. formatting quality
      4. Core Skills identified
      5. Specific recommendations for improvement.
      Format the response with clear sections and markdown.
    `;
    const aiResponse = await generateAIContent(prompt);
    return { success: true, data: aiResponse };
  } catch (error: any) {
    console.error("Resume analysis error:", error);
    return { success: false, error: error.message || "Failed to analyze resume" };
  }
};

export const enhanceResumeAI = async (userId: string) => {
  try {
    const prompt = `
      Provide 3 high-impact, AI-driven bullet point enhancements for a Software Engineering internship resume.
      The suggestions should focus on using strong action verbs and quantifying results.
    `;
    const aiResponse = await generateAIContent(prompt);
    return { success: true, data: aiResponse };
  } catch (error: any) {
    console.error("Resume enhancement error:", error);
    return { success: false, error: error.message || "Failed to enhance resume" };
  }
};
