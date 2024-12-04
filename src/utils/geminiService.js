import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateInvestmentStrategy = async (userData) => {
  const prompt = `Analyze the following retirement planning data and provide a detailed response in JSON format:
    - Age: ${userData.age}
    - Current Income: ${userData.current_income}
    - Monthly Expenditure: ${userData.monthly_expenditure}
    - Existing Savings: ${userData.existing_savings}
    - Retirement Age Goal: ${userData.retirement_age}
    - Risk Tolerance: ${userData.risk_tolerance}
    - Desired Retirement Lifestyle: ${userData.retirement_lifestyle}
    
    Respond with ONLY a JSON object using this exact structure and do not return in markdown format. I just need the exact json object. Do not give it in the style, as you give in the chat. This is an API call so just send the JSON, I need to store that directly into the database without formatting.:

    {
      summary: {a Basic Overview in 30 words},
      investment_strategy: {
      fixed_income_percentage:number,
      equities_percentage: number,
      reits_percentage: number,
      cash_percentage: number,
      suggested_allocations: {
        us_stocks_percentage: number,
        international_stocks_percentage: number,
        corporate_bonds_percentage: number,
        government_bonds_percentage: number,
        reits_percentage: number,
        cash_percentage: number
      }
    },
    projections: {
      monthly_savings_needed: number,
      retirement_corpus: number,
      yearly_projections: [
        { year: number, projected_savings: number },
        { year: number, projected_savings: number },
        { year: number, projected_savings: number },
      ],
      retirement_income_sources: [
        { source: string, amount: number },
        { source: string, amount: number },
        { source: string, amount: number }
      ]
    },
    risk_analysis: {
      risk_score: number,
      market_sensitivity: number,
      diversification_score: number,
      risk_factors: [
        { factor: string, impact: High|Medium|Low },
        { factor: string, impact: High|Medium|Low },
        { factor: Longevity Risk, impact: High|Medium|Low }
      ]
    },
    visualizations: {
      charts: [
        {
          type: pie,
          title: Asset Allocation,
          data: {
            labels: [Fixed Income, Equities, REITs, Cash],
            values: [number, number, number, number]
          },
          description: {a one line description of the chart in text string}
        },
        {
          type: line,
          title: Retirement Savings Projection,
          data: {
          labels: [2024, 2025, 2026, 2027, 2028],
          values: [number, number, number, number, number]
        },
        description: {a one line description of the chart in text string}
        },
        {
          type: bar,
          title: Monthly Income Sources in Retirement,
          data: {
          labels: [Social Security, Investments, Pension],
          values: [number, number, number]
        },
        description: {a one line description of the chart in text string}
      }
    ]
  },
  monte_carlo: {
    success_rate: number,
    scenarios: {
      conservative: number,
      moderate: number,
      aggressive: number
    },
  },
  recommendations: [
    {
      priority: number,
      action: string,
      impact: string
    },
    {
      priority: number,
      action: string,
      impact: string
    },
    {
      priority: number,
      action: string,
      impact: string
    }
  ]
}  
   If calculatiing the percentage number, then do it with childrens of same parent.
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
};
