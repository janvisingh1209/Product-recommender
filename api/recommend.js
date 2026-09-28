import { recommend } from "../server/recommendation.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Use POST for recommendations." });
  }
  const preferences = req.body?.preferences;
  if (
    typeof preferences !== "string" ||
    preferences.trim().length < 3 ||
    preferences.length > 500
  ) {
    return res
      .status(400)
      .json({
        error: "Enter between 3 and 500 characters describing what you need.",
      });
  }
  try {
    return res.status(200).json(await recommend(preferences.trim()));
  } catch (error) {
    const timedOut =
      error.name === "TimeoutError" || error.name === "AbortError";
    return res
      .status(timedOut ? 504 : error.status || 502)
      .json({
        error: timedOut
          ? "The AI took too long. Please try again."
          : error.status
            ? error.message
            : "We could not read the AI response. Please try again.",
      });
  }
}
