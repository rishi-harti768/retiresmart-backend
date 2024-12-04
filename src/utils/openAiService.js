// services/openaiService.js
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

export const generateInvestmentStrategy = async (userData) => {
  const prompt = `Analyze retirement data and respond ONLY in valid JSON format matching this exact structure:

{
  "summary": "string describing overall strategy",
  "investment_strategy": {
    "fixed_income": number,
    "equities": number,
    "reits": number,
    "cash": number,
    "suggested_allocations": {
      "us_stocks": number,
      "international_stocks": number,
      "corporate_bonds": number,
      "government_bonds": number,
      "reits": number,
      "cash": number
    }
  },
  "projections": {
    "monthly_savings_needed": number,
    "retirement_corpus": number,
    "yearly_projections": [{ "year": number, "projected_savings": number }],
    "retirement_income_sources": [{ "source": string, "amount": number }]
  },
  "risk_analysis": {
    "risk_score": number 0-100,
    "market_sensitivity": number 0-1,
    "diversification_score": number 0-100,
    "risk_factors": [{ "factor": "string", "impact": "Low"|"Medium"|"High" }]
  },
  "visualizations": {
    "charts": [
      {
        "type": "pie",
        "title": string,
        "data": {
          "labels": string[],
          "values": number[]
        },
        "description": string
      }
    ]
  },
  "monte_carlo": {
    "success_rate": number 0-100,
    "scenarios": {
      "conservative": number,
      "moderate": number,
      "aggressive": number
    },
    "probability_distribution": [{ "percentile": number, "value": number }]
  },
  "recommendations": [
    {
      "priority": number 1-5,
      "action": string,
      "impact": string
    }
  ]
}

User data:
- Name: ${userData.name}
- Age: ${userData.age}
- Current Income: ${userData.current_income}
- Monthly Expenditure: ${userData.monthly_expenditure}
- Existing Savings: ${userData.existing_savings}
- Retirement Age Goal: ${userData.retirement_age}
- Risk Tolerance: ${userData.risk_tolerance}
- Desired Retirment Lifestyle: ${userData.retirement_lifestyle}

Important: Return ONLY valid JSON, no other text or explanations.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or "gpt-3.5-turbo" for a more economical option
      messages: [
        {
          role: "system",
          content:
            "You are a financial advisor expert. Analyze user data and provide retirement planning advice in JSON format only. Use realistic calculations and numbers.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" }, // Ensures JSON response
      temperature: 0.7,
    });

    // Parse the response
    const jsonResponse = JSON.parse(completion.choices[0].message.content);
    return jsonResponse;
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw new Error("Failed to generate investment strategy");
  }
};
