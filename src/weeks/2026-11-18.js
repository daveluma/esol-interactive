// Wednesday 11/18 — activities not added yet (add them when the slides are ready).

const gatesGif = new URL('../assets/gifs/gates-open.gif', import.meta.url).href;
const generationsGif = new URL('../assets/gifs/generations.gif', import.meta.url).href;

export default {
  id: '2026-11-18',
  tabLabel: 'Wed 11/18',
  tabTopic: 'Coming soon',
  dateLabel: 'Wednesday, November 18, 2026',
  title: 'Wednesday practice',
  subtitle: 'Activities for this week are coming soon.',
  goals: [],
  powerpoint: { files: [] },
  activities: [],
  practical: { activities: [] },
  goodNews: {
    reference: 'Psalm 100:4-5',
    version: 'NIV',
    text: [
      'Enter his gates with thanksgiving',
      'and his courts with praise;',
      'give thanks to him and praise his name.',
      'For the LORD is good and his love endures forever;',
      'his faithfulness continues through all generations.',
    ],
    keyWords: [
      { word: 'gates', emoji: '🚪', meaning: 'big doors' },
      { word: 'praise', emoji: '🙌', meaning: 'say good things about God' },
      { word: 'faithfulness', emoji: '🤝', meaning: 'always keeping promises' },
      { word: 'generations', emoji: '👨‍👩‍👧', meaning: 'grandparents, parents, children…' },
    ],
    translations: [],
    gifs: [
      { src: gatesGif, alt: 'Two gates open and light shines through.', caption: 'Enter his gates with thanksgiving.' },
      { src: generationsGif, alt: 'A grandparent, a parent and a child appear one after another.', caption: 'Through all generations' },
    ],
  },
};
