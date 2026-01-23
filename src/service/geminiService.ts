import { GoogleGenerativeAI } from "@google/generative-ai";

let ai: GoogleGenerativeAI | null = null;

const getAI = () => {
  if (!ai) {
    ai = new GoogleGenerativeAI(process.env.API_KEY || '');
  }
  return ai;
};

export const getHealthAdvice = async (symptoms: string) => {
  try {
    const aiInstance = getAI();
    const model = aiInstance.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(`User symptoms: ${symptoms}.
      Act as a medical triage assistant.
      1. Suggest a likely specialist type (e.g., Cardiologist, Dermatologist).
      2. Provide a brief 1-sentence general advice (disclaimer: not medical advice).
      3. Recommend 2-3 specific questions the user should ask the doctor.
      Format as JSON: { "specialist": string, "advice": string, "questions": string[] }`);
    const response = await result.response;
    const text = response.text();
    // Try to parse as JSON, fallback if not valid JSON
    try {
      return JSON.parse(text);
    } catch {
      // If not valid JSON, return fallback
      return {
        specialist: "General Physician",
        advice: "It is recommended to see a General Physician for an initial assessment.",
        questions: ["How long have you had these symptoms?", "Is the pain sharp or dull?"]
      };
    }
  } catch (error) {
    console.error("Gemini Error:", error);
    // Fallback JSON if API fails or key is missing
    return {
      specialist: "General Physician",
      advice: "It is recommended to see a General Physician for an initial assessment.",
      questions: ["How long have you had these symptoms?", "Is the pain sharp or dull?"]
    };
  }
};

export const getDoctorChatResponse = async (patientMessage: string, doctorSpeciality: string, conversationHistory: string = "") => {
  try {
    const aiInstance = getAI();
    const model = aiInstance.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are a ${doctorSpeciality} doctor in a chat consultation. Respond contextually and empathetically to the patient's message: "${patientMessage}".

Conversation history: ${conversationHistory}

Guidelines:
- Base your response on the patient's symptoms and message.
- For serious conditions like heart attack, chest pain, severe bleeding, difficulty breathing, or stroke symptoms, respond with urgency: recommend immediate emergency care, suggest calling emergency services, and provide relevant steps or medications if appropriate.
- Tone: Friendly, empathetic, and medically appropriate.
- Keep responses professional and helpful.
- If prescribing medication, include dosage and precautions.
- Avoid generic or repeated replies; tailor to the specific message.
- Respond as if you are the doctor speaking directly to the patient.

Provide a natural, conversational response as the doctor.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Gemini Error:", error);
    // Fallback response
    return "Thank you for sharing that. I'm here to help. Please provide more details about your symptoms so I can assist you better.";
  }
};
