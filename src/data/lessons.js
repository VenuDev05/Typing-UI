// Original practice passages, grouped by difficulty.
export const LESSONS = {
  easy: [
    'the cat sat on the soft mat and had a nap in the warm sun all day long',
    'a red bird can fly up to the top of the old oak tree by the blue lake',
    'we like to run and jump and play in the green park with our two dogs',
    'she has a new pen and a big red book that she reads late every night',
    'my mom and dad go to the shop to buy some milk eggs bread and fresh fish',
    'the boy and his pet frog hop over the wet log near the small pond today',
    'ten kids ran to the bus stop to wait for the ride to their new school',
    'we sat by the fire and told fun tales about the ship lost at deep sea',
  ],
  medium: [
    'The quick brown fox jumps over the lazy dog while the sleepy cat watches from the fence.',
    'Practice makes progress, so keep your fingers moving and your eyes on the words ahead.',
    'A steady rhythm beats raw speed; type each letter cleanly before you try to go faster.',
    'Good posture, relaxed hands, and a calm mind will carry you through any typing test.',
    'Every expert typist once struggled with the home row, so be patient with yourself today.',
    'Reading the next word before you finish the current one keeps your typing smooth and fast.',
    'Small daily sessions build muscle memory better than one long practice once in a while.',
    'Focus on accuracy first and speed will follow, because clean typing needs no corrections.',
  ],
  hard: [
    'In 2024, roughly 87% of users typed at ~40 WPM — can you beat that by 15 words?',
    'Email me at chris_92@site.io or call +1 (555) 274-8830 before 9:45 AM on Friday!',
    'The list [3, 7, 11, 42] maps to values like 3.14, -0.5, and 88; parse & print each one.',
    'Strong keys mix UPPER, lower, digits 0-9, and symbols such as ^ & * $ % @ in one line.',
    'Q4 revenue rose 23.6%, from $1,204,500 to about $1.49M — that is a *significant* jump!',
    'She typed "hello, world!" then pressed <Enter>; the cost was 12.50 for 3 items (x4 each).',
    'Use the path C:\\Users\\Sam\\file_02.txt or ~/data/output-2025.csv to load the report now.',
    'Roughly 3/4 of the team (about 68 people) hit the 55-WPM goal by March 1st this year.',
  ],
};

// Remember the last passage shown per difficulty so the next test differs.
const lastByDiff = {};

export function getPassage(difficulty = 'medium') {
  const pool = LESSONS[difficulty] || LESSONS.medium;
  if (pool.length === 1) return pool[0];
  let pick;
  do {
    pick = pool[Math.floor(Math.random() * pool.length)];
  } while (pick === lastByDiff[difficulty]);
  lastByDiff[difficulty] = pick;
  return pick;
}
