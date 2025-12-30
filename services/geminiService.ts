import { GoogleGenAI, Type } from "@google/genai";
import { Category, Transaction } from '../types';

// In a real native app, this would be an on-device model or a secure backend proxy.
// For this demo, we assume the environment variable is set.
const apiKey = process.env.API_KEY || ''; 

let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const categorizeTransaction = async (transaction: Transaction): Promise<Category> => {
  if (!ai) {
    console.warn("Gemini API Key not found. Skipping AI classification.");
    return Category.OTHER;
  }

  // If it's income, don't waste tokens, usually just "Income" or "Transfer"
  if (transaction.type === 'CREDIT') {
    return Category.INCOME;
  }

  try {
    const prompt = `
      You are a financial transaction classifier for the African market.
      Classify the following transaction description into exactly one of these categories:
      - Food
      - Transport
      - Rent
      - Utilities
      - Internet
      - Transfer
      - Fees
      - Other
      
      Transaction Description: "${transaction.description}"
      Original SMS: "${transaction.originalSms}"
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: {
              type: Type.STRING,
              enum: [
                "Food", "Transport", "Rent", "Utilities", "Internet", "Transfer", "Fees", "Other"
              ]
            }
          }
        }
      }
    });

    const result = response.text ? JSON.parse(response.text) : null;
    
    if (result && result.category) {
      // Validate against Enum
      const cat = Object.values(Category).find(c => c === result.category);
      return cat || Category.OTHER;
    }

    return Category.OTHER;

  } catch (error) {
    console.error("AI Categorization failed:", error);
    return Category.OTHER;
  }
};