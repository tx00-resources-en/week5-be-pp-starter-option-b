const model = require("../config/gemini");

// POST request to /ai/POST /ai/tour-suggestions with the following JSON payload:
// {
//   "destination": "Tokyo",
//   "duration": "5 days",
//   "budget": "1500",
//   "season": "Spring",
//   "preferences": "food, culture, technology",
//   "travelStyle": "guided tour"
// }


const generateTourSuggestion = async (req, res) => {
  const { destination, duration, budget, season, preferences, travelStyle } = req.body;

  if (!destination || !duration || !budget || !season || !preferences || !travelStyle) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const prompt = `
    A traveler is interested in visiting ${destination} for ${duration}.
    Their budget is around ${budget}, and they prefer traveling in the ${season} season.
    Their interests include: ${preferences}.
    They prefer a ${travelStyle} experience.

    Based on this, recommend a suitable tour. 
    Include:
    - A short tour description
    - Key highlights
    - Why this tour matches their preferences
    - Estimated price range
    - Best time to visit
    - Any special offers or tips
  `;

  try {
    const result = await model(prompt);
    res.json({ output: result.text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = generateTourSuggestion;
