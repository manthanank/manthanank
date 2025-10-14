import { fetchOttReleases } from "../services/geminiService.js";

export const getOttReleases = async (req, res) => {
  const { timeframe } = req.query; // week or month
  const validTimeframe = timeframe === "month" ? "month" : "week";

  const data = await fetchOttReleases(validTimeframe);
  res.status(200).json({ timeframe: validTimeframe, count: data.length, releases: data });
};
