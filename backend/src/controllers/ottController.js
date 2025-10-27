import { fetchOttReleases } from "../services/geminiService.js";

export const getOttReleases = async (req, res) => {
  const {
    timeframe = "week",
    limit = "20",
    offset = "0",
    sortBy = "release_date",
    order = "asc",
  } = req.query;

  // Sanitize/validate
  const validTimeframe = timeframe === "month" ? "month" : "week";
  const parsedLimit = Number.isFinite(Number(limit)) && Number(limit) > 0 ? Number(limit) : 20;
  const parsedOffset = Number.isFinite(Number(offset)) && Number(offset) >= 0 ? Number(offset) : 0;
  const validSortBy = ["release_date", "title", "platform"].includes(String(sortBy))
    ? String(sortBy)
    : "release_date";
  const validOrder = String(order).toLowerCase() === "desc" ? "desc" : "asc";

  const allReleases = await fetchOttReleases(validTimeframe);

  // Sorting helper
  const compare = (a, b) => {
    let left = a[validSortBy];
    let right = b[validSortBy];

    if (validSortBy === "release_date") {
      // Expecting YYYY-MM-DD; fallback to string compare if invalid date
      const leftTime = Date.parse(left) || 0;
      const rightTime = Date.parse(right) || 0;
      return leftTime - rightTime;
    }

    // Case-insensitive string compare for other fields
    left = typeof left === "string" ? left.toLowerCase() : String(left);
    right = typeof right === "string" ? right.toLowerCase() : String(right);
    if (left < right) return -1;
    if (left > right) return 1;
    return 0;
  };

  const sorted = [...allReleases].sort(compare);
  const ordered = validOrder === "desc" ? sorted.reverse() : sorted;

  const total = ordered.length;
  const paged = ordered.slice(parsedOffset, parsedOffset + parsedLimit);

  res.status(200).json({
    timeframe: validTimeframe,
    total,
    count: paged.length,
    offset: parsedOffset,
    limit: parsedLimit,
    order: validOrder,
    releases: paged,
  });
};
