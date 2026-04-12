const supabase = require("../config/supabase");

class SaarthiController {
  // Generate a test based on a provided topic or document
  async generateTest(req, res) {
    try {
      const { topic, hasDocument } = req.body;
      
      // Simulate generic AI text generation process
      // In a real application, this would call OpenAI/Gemini APIs using the document/topic text
      
      const examTitle = topic || "Document Comprehension";
      
      const simulatedExam = {
        title: examTitle,
        questions: [
          {
            id: 1,
            text: hasDocument 
              ? `Based on the provided ${topic} document, what is the primary structural component described?`
              : `What is the core principle of ${topic}?`,
            options: [
              hasDocument ? "Client-Server Architecture" : "Scalability",
              hasDocument ? "Microservices" : "Optimization",
              hasDocument ? "Monolithic Design" : "Redundancy",
              hasDocument ? "Event-Driven Integration" : "Polymorphism"
            ],
            correctIndex: 1
          },
          {
            id: 2,
            text: `Which of the following problems does ${examTitle} solve effectively?`,
            options: [
              "Data normalization",
              "Distributed caching",
              "Latency issues",
              "None of the above"
            ],
            correctIndex: 2
          }
        ],
        generatedAt: new Date().toISOString()
      };

      // Ensure mock 1.5s delay to simulate AI processing time if needed, though usually handled by frontend
      res.status(200).json({
        success: true,
        data: simulatedExam,
        message: "Exam generated successfully."
      });
      
    } catch (error) {
      console.error("Test generation error:", error);
      res.status(500).json({ error: "Failed to generate test. Please try again later." });
    }
  }
}

module.exports = new SaarthiController();
