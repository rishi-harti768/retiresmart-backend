import express from "express";
import pool from "../db/database.js";
import { generateInvestmentStrategy } from "../utils/openAiService.js";

const router = express.Router();

router.post("/analyze", async (req, res) => {
  try {
    const {
      name,
      age,
      current_income,
      monthly_expenditure,
      existing_savings,
      retirement_age,
      risk_tolerance,
      retirement_lifestyle,
    } = req.body;

    const analysis = await generateInvestmentStrategy({
      name,
      age,
      current_income,
      monthly_expenditure,
      existing_savings,
      retirement_age,
      risk_tolerance,
      retirement_lifestyle,
    });

    // Calculate projections
    const yearsToRetirement = retirement_age - age;
    const monthlyInvestmentNeeded = calculateMonthlyInvestment(
      current_income,
      monthly_expenditure,
      yearsToRetirement
    );

    // Store analysis results
    await pool.query(
      `INSERT INTO genai_analysis (
      name,
        age,
        current_income,
        monthly_expenditure,
        existing_savings,
        retirement_age,
        risk_tolerance,
        retirement_lifestyle,
        investment_strategy,
        projected_savings,
        monthly_investment_needed
        )
        VALUES ($11, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        age,
        current_income,
        monthly_expenditure,
        existing_savings,
        retirement_age,
        risk_tolerance,
        retirement_lifestyle,
        JSON.stringify(analysis),
        calculateProjectedSavings(monthlyInvestmentNeeded, yearsToRetirement),
        monthlyInvestmentNeeded,
        name,
      ]
    );

    res.status(200).json({
      strategy: analysis,
      monthly_investment: monthlyInvestmentNeeded,
      projected_savings: calculateProjectedSavings(
        monthlyInvestmentNeeded,
        yearsToRetirement
      ),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/history", async (req, res) => {
  try {
    const result = await pool.query(`SELECT id, name, age FROM genai_analysis`);

    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/view-analysis", async (req, res) => {
  try {
    const { id } = req.body;
    const result = await pool.query(
      `SELECT * FROM genai_analysis WHERE id = $1`,
      [id]
    );
    console.log(result.rows[0].investment_strategy);

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

function calculateMonthlyInvestment(income, expenditure, years) {
  const monthlyIncome = income / 12;
  return (monthlyIncome - expenditure) * 0.8; // Suggesting 80% of disposable income
}

function calculateProjectedSavings(monthlyInvestment, years) {
  const monthlyRate = 0.07 / 12; // Assuming 7% annual return
  const months = years * 12;
  return (
    (monthlyInvestment * (Math.pow(1 + monthlyRate, months) - 1)) / monthlyRate
  );
}
