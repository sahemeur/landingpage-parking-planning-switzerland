export function sanitizeForUrl(input: string): string {
  // Replace German umlauts and ß
  const umlautMap: { [key: string]: string } = {
    ä: "ae",
    ö: "oe",
    ü: "ue",
    Ä: "Ae",
    Ö: "Oe",
    Ü: "Ue",
    ß: "ss",
  };

  const replacedUmlauts = input.replace(/[äöüÄÖÜß]/g, (char) => umlautMap[char] || char);

  // Replace all whitespace characters with underscores
  const noWhitespace = replacedUmlauts.replace(/\s+/g, "_");

  // Remove or replace any remaining unsafe characters
  const safe = noWhitespace.replace(/[^a-zA-Z0-9_-]/g, "");

  return safe;
}
