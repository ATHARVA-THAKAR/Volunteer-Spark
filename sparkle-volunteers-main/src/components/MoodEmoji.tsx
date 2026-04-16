interface MoodEmojiProps {
  mood: 1 | 2 | 3 | 4 | 5;
  size?: "sm" | "md" | "lg";
}

const emojis: Record<number, string> = { 1: "😞", 2: "😟", 3: "😐", 4: "🙂", 5: "😄" };
const sizes = { sm: "text-lg", md: "text-2xl", lg: "text-4xl" };

const MoodEmoji = ({ mood, size = "md" }: MoodEmojiProps) => (
  <span className={sizes[size]} role="img" aria-label={`mood ${mood}`}>{emojis[mood]}</span>
);

export default MoodEmoji;
