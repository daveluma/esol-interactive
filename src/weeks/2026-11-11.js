// Wednesday 11/11 — activities not added yet (add them when the slides are ready).

const sunriseGif = new URL('../assets/gifs/sunrise.gif', import.meta.url).href;
const foreverGif = new URL('../assets/gifs/forever-heart.gif', import.meta.url).href;

export default {
  id: '2026-11-11',
  tabLabel: 'Wed 11/11',
  tabTopic: 'Coming soon',
  dateLabel: 'Wednesday, November 11, 2026',
  title: 'Wednesday practice',
  subtitle: 'Activities for this week are coming soon.',
  goals: [],
  powerpoint: { files: [] },
  activities: [],
  practical: { activities: [] },
  goodNews: {
    reference: 'Psalm 107:1',
    version: 'NIV',
    text: ['Give thanks to the LORD, for he is good;', 'his love endures forever.'],
    keyWords: [
      { word: 'give thanks', emoji: '🙏', meaning: 'say “thank you”' },
      { word: 'good', emoji: '👍' },
      { word: 'love', emoji: '❤️' },
      { word: 'forever', emoji: '♾️', meaning: 'always — it never stops' },
    ],
    translations: [],
    gifs: [
      { src: sunriseGif, alt: 'The sun rises over hills.', caption: 'Give thanks to the LORD, for he is good.' },
      { src: foreverGif, alt: 'A heart glows inside a never-ending loop.', caption: 'His love endures forever.' },
    ],
  },
};
