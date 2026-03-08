interface TagChipProps {
  label: string
  variant?: 'default' | 'accent'
}

export default function TagChip({ label, variant = 'default' }: TagChipProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        variant === 'accent'
          ? 'bg-accent-subtle text-accent-light border-accent/30'
          : 'bg-surface text-text-secondary border-border'
      }`}
    >
      {label}
    </span>
  )
}
