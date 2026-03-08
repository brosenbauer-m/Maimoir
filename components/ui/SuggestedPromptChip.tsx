'use client'

interface SuggestedPromptChipProps {
  prompt: string
  onClick: (prompt: string) => void
}

export default function SuggestedPromptChip({ prompt, onClick }: SuggestedPromptChipProps) {
  return (
    <button
      onClick={() => onClick(prompt)}
      className="text-left px-3 py-2 rounded-lg border border-border bg-surface hover:border-accent/50 hover:bg-accent-subtle text-text-secondary hover:text-text-primary text-xs transition-colors"
    >
      {prompt}
    </button>
  )
}
