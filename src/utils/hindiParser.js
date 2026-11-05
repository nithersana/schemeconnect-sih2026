/**
 * Hindi Number Word → Numeral Parser
 * Converts spoken Hindi number words to integers/floats.
 * Supports: age (0–120), income (up to ₹1 crore)
 *
 * Examples:
 *  "पैंतीस"        → 35
 *  "दो लाख"        → 200000
 *  "पचास हजार"    → 50000
 *  "एक लाख पचास हजार" → 150000
 */

const ONES = {
  "शून्य": 0, "एक": 1, "दो": 2, "तीन": 3, "चार": 4, "पाँच": 5, "पांच": 5,
  "छह": 6, "छः": 6, "सात": 7, "आठ": 8, "नौ": 9, "दस": 10,
  "ग्यारह": 11, "बारह": 12, "तेरह": 13, "चौदह": 14, "पंद्रह": 15,
  "सोलह": 16, "सत्रह": 17, "अठारह": 18, "उन्नीस": 19, "बीस": 20,
  "इक्कीस": 21, "बाईस": 22, "तेईस": 23, "चौबीस": 24, "पच्चीस": 25,
  "छब्बीस": 26, "सत्ताईस": 27, "अट्ठाईस": 28, "उनतीस": 29, "तीस": 30,
  "इकत्तीस": 31, "बत्तीस": 32, "तैंतीस": 33, "चौंतीस": 34, "पैंतीस": 35,
  "छत्तीस": 36, "सैंतीस": 37, "अड़तीस": 38, "उनतालीस": 39, "चालीस": 40,
  "इकतालीस": 41, "बयालीस": 42, "तैंतालीस": 43, "चौवालीस": 44, "पैंतालीस": 45,
  "छियालीस": 46, "सैंतालीस": 47, "अड़तालीस": 48, "उनचास": 49, "पचास": 50,
  "इक्यावन": 51, "बावन": 52, "तिरपन": 53, "चौवन": 54, "पचपन": 55,
  "छप्पन": 56, "सत्तावन": 57, "अट्ठावन": 58, "उनसठ": 59, "साठ": 60,
  "इकसठ": 61, "बासठ": 62, "तिरसठ": 63, "चौंसठ": 64, "पैंसठ": 65,
  "छियासठ": 66, "सड़सठ": 67, "अड़सठ": 68, "उनहत्तर": 69, "सत्तर": 70,
  "इकहत्तर": 71, "बहत्तर": 72, "तिहत्तर": 73, "चौहत्तर": 74, "पचहत्तर": 75,
  "छिहत्तर": 76, "सतहत्तर": 77, "अठहत्तर": 78, "उनासी": 79, "अस्सी": 80,
  "इक्यासी": 81, "बयासी": 82, "तिरासी": 83, "चौरासी": 84, "पचासी": 85,
  "छियासी": 86, "सत्तासी": 87, "अट्ठासी": 88, "नवासी": 89, "नब्बे": 90,
  "इक्यानबे": 91, "बानबे": 92, "तिरानबे": 93, "चौरानबे": 94, "पचानबे": 95,
  "छियानबे": 96, "सत्तानबे": 97, "अट्ठानबे": 98, "निन्यानबे": 99, "सौ": 100
};

const MULTIPLIERS = {
  "सौ": 100,
  "हजार": 1000,
  "लाख": 100000,
  "करोड़": 10000000,
  "करोड": 10000000,
};

/**
 * Parse Hindi number words in a string and return the integer value.
 * Returns null if no number found.
 */
export function parseHindiNumber(text) {
  if (!text) return null;
  const normalized = text.trim().toLowerCase().replace(/[।,.]/g, "");
  const words = normalized.split(/\s+/);

  let total = 0;
  let current = 0;

  for (const word of words) {
    if (ONES[word] !== undefined) {
      current += ONES[word];
    } else if (MULTIPLIERS[word]) {
      const mult = MULTIPLIERS[word];
      if (mult >= 100000) {
        // Lakh / Crore — multiply the accumulated current, add to total
        if (current === 0) current = 1;
        total += current * mult;
        current = 0;
      } else {
        // Hazar / Sau
        if (current === 0) current = 1;
        current *= mult;
      }
    }
  }
  total += current;

  return total > 0 ? total : null;
}

/**
 * Extract age from Hindi voice input.
 * Tries word-form first, then falls back to digit extraction.
 */
export function extractAgeFromHindi(transcript) {
  // Try word-form parse
  const wordNum = parseHindiNumber(transcript);
  if (wordNum && wordNum >= 18 && wordNum <= 80) return wordNum;

  // Fallback: extract digit
  const digitMatch = transcript.match(/\d+/);
  if (digitMatch) {
    const n = parseInt(digitMatch[0], 10);
    if (n >= 18 && n <= 80) return n;
  }
  return null;
}

/**
 * Extract annual income from Hindi voice input.
 */
export function extractIncomeFromHindi(transcript) {
  const wordNum = parseHindiNumber(transcript);
  if (wordNum && wordNum >= 10000 && wordNum <= 10000000) return wordNum;

  // Handle "X लाख" pattern with digits: "2 लाख" → 200000
  const lakhjMatch = transcript.match(/(\d+(?:\.\d+)?)\s*लाख/);
  if (lakhjMatch) return Math.round(parseFloat(lakhjMatch[1]) * 100000);

  const hazarMatch = transcript.match(/(\d+(?:\.\d+)?)\s*हजार/);
  if (hazarMatch) return Math.round(parseFloat(hazarMatch[1]) * 1000);

  const digitMatch = transcript.match(/\d+/);
  if (digitMatch) {
    const n = parseInt(digitMatch[0], 10);
    if (n >= 10000) return n;
    if (n >= 1 && n <= 100) return n * 100000; // assume "X lakh" spoken as digit
  }
  return null;
}
