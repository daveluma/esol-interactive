// Activity registry. A week file uses an activity with `type: '<key>'`.
// To add a new kind of activity: make a component in this folder and add it here.
import SentenceBuilder from './SentenceBuilder';
import MultipleChoice from './MultipleChoice';
import CapitalFix from './CapitalFix';
import LocationScene from './LocationScene';
import Demonstratives from './Demonstratives';
import NumberChart from './NumberChart';
import Dictation from './Dictation';
import Syllables from './Syllables';
import StoryFill from './StoryFill';
import SpeakingCards from './SpeakingCards';
import Dialogue from './Dialogue';

export const ACTIVITY_TYPES = {
  sentenceBuilder: SentenceBuilder,
  multipleChoice: MultipleChoice,
  capitalFix: CapitalFix,
  locationScene: LocationScene,
  demonstratives: Demonstratives,
  numberChart: NumberChart,
  dictation: Dictation,
  syllables: Syllables,
  storyFill: StoryFill,
  speakingCards: SpeakingCards,
  dialogue: Dialogue,
};
