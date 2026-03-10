'use client'

interface SuggestedPromptChipProps {
  prompt: string
  onClick: (prompt: string) => void
}

export default function SuggestedPromptChip({ prompt, onClick }: SuggestedPromptChipProps) {
  return (
    <button
      onClick={() => onClick(prompt)}
      className="text-left px-4 py-2 rounded-full border-2 border-accent/30 bg-accent-tint hover:bg-accent/10 text-text-primary text-sm transition-all hover:border-accent hover:shadow-soft"
    >
      {prompt}
    </button>
  )
}
