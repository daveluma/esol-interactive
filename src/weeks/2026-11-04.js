// Wednesday 11/4 — activities not added yet (add them when the slides are ready).

const peaceGif = new URL('../assets/gifs/peace-dove.gif', import.meta.url).href;
const prayerGif = new URL('../assets/gifs/prayer-candle.gif', import.meta.url).href;

export default {
  id: '2026-11-04',
  tabLabel: 'Wed 11/4',
  tabTopic: 'Coming soon',
  dateLabel: 'Wednesday, November 4, 2026',
  title: 'Wednesday practice',
  subtitle: 'Activities for this week are coming soon.',
  goals: [],
  powerpoint: { files: [] },
  activities: [],
  practical: { activities: [] },
  goodNews: {
    reference: 'Philippians 4:6-7',
    version: 'NIV',
    text: [
      'Do not be anxious about anything,',
      'but in every situation, by prayer and petition, with thanksgiving,',
      'present your requests to God.',
      'And the peace of God, which transcends all understanding,',
      'will guard your hearts and your minds in Christ Jesus.',
    ],
    keyWords: [
      { word: 'anxious', emoji: '😟', meaning: 'worried' },
      { word: 'prayer', emoji: '🙏', meaning: 'talking to God' },
      { word: 'thanksgiving', emoji: '🙌', meaning: 'saying “thank you”' },
      { word: 'peace', emoji: '🕊️', meaning: 'calm, no worry' },
    ],
    translations: [],
    gifs: [
      { src: peaceGif, alt: 'A dove flies over calm water.', caption: 'The peace of God' },
      { src: prayerGif, alt: 'Praying hands next to a small candle flame.', caption: 'By prayer, with thanksgiving' },
    ],
  },
};
