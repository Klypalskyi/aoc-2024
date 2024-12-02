exports.fetchInputByDay = async (day) => {
  const baseUrl = `https://adventofcode.com/2024/day/${day}/input`;
  const cookie = process.env.AOC_SESSION_COOKIE || "";
  const response = await fetch(baseUrl, {
    headers: {
      cookie: `session=${cookie ?? ""}`
    }
  });
  return response.text();
};