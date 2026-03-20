export interface Question {
  id: number;
  text: string;
  options: string[];
}

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "What's your ideal weekend plan?",
    options: ["Netflix & chill at home", "Go on an adventure outdoors", "Try a new restaurant", "Sleep all day"],
  },
  {
    id: 2,
    text: "Pick a superpower:",
    options: ["Read minds", "Time travel", "Fly anywhere", "Be invisible"],
  },
  {
    id: 3,
    text: "What's your biggest fear?",
    options: ["Spiders / bugs", "Heights", "Being alone", "Public speaking"],
  },
  {
    id: 4,
    text: "Your go-to comfort food?",
    options: ["Pizza", "Ice cream", "Biryani", "Chocolate"],
  },
  {
    id: 5,
    text: "If we won the lottery, first thing you'd do?",
    options: ["Travel the world", "Buy a dream house", "Quit my job", "Throw a huge party"],
  },
  {
    id: 6,
    text: "What do you notice first about someone?",
    options: ["Their smile", "Their eyes", "Their vibe / energy", "Their sense of humor"],
  },
  {
    id: 7,
    text: "Pick a dream vacation:",
    options: ["Beach resort in Maldives", "Road trip across Europe", "Mountain cabin getaway", "Tokyo, Japan"],
  },
  {
    id: 8,
    text: "How do you handle stress?",
    options: ["Listen to music", "Talk it out", "Go for a walk", "Sleep it off"],
  },
  {
    id: 9,
    text: "What's more important in a relationship?",
    options: ["Trust", "Communication", "Humor", "Quality time"],
  },
  {
    id: 10,
    text: "Your love language?",
    options: ["Words of affirmation", "Physical touch", "Acts of service", "Quality time"],
  },
  {
    id: 11,
    text: "Pick a movie genre for tonight:",
    options: ["Romantic comedy", "Action / thriller", "Horror", "Animated / feel-good"],
  },
  {
    id: 12,
    text: "What's the one thing you can't live without?",
    options: ["My phone", "Music", "Coffee / tea", "You 😏"],
  },
];
