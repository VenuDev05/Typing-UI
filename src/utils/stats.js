// Standard typing-speed math.
// A "word" is conventionally 5 characters, so WPM = (chars / 5) / minutes.

/**
 * @param {number} correctChars  characters typed correctly
 * @param {number} totalChars    all characters typed (correct + wrong)
 * @param {number} errors        number of incorrect keystrokes
 * @param {number} elapsedMs     time elapsed in milliseconds
 */
export function computeStats(correctChars, totalChars, errors, elapsedMs) {
  const minutes = Math.max(elapsedMs / 60000, 1 / 60000); // avoid divide-by-zero

  // Raw WPM counts everything typed; net WPM counts only correct characters.
  const rawWpm = Math.max(0, Math.round((totalChars / 5) / minutes));
  const wpm = Math.max(0, Math.round((correctChars / 5) / minutes));

  const accuracy = totalChars === 0 ? 100 : Math.max(0, (correctChars / totalChars) * 100);

  return {
    wpm,
    rawWpm,
    accuracy: Math.round(accuracy * 10) / 10,
    errors,
    charsTyped: totalChars,
    correctChars,
  };
}

// A friendly title based on the score — mirrors the backend logic.
export function levelFor(wpm, accuracy) {
  if (accuracy < 80) return 'Improving Typist';
  if (wpm >= 80) return 'Master Typist';
  if (wpm >= 60) return 'Advanced Typist';
  if (wpm >= 40) return 'Proficient Typist';
  if (wpm >= 25) return 'Developing Typist';
  return 'Beginner Typist';
}
