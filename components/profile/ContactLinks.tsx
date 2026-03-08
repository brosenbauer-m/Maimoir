import type { ContactLink } from '@/types'

interface ContactLinksProps {
  links: ContactLink[]
}

const platformIcons: Record<string, string> = {
  instagram: '📷',
  linkedin: '💼',
  whatsapp: '💬',
  twitter: '🐦',
  x: '𝕏',
  github: '🐙',
  email: '✉️',
  website: '🌐',
  other: '🔗',
}

function detectPlatform(url: string): string {
  const lower = url.toLowerCase()
  if (lower.includes('instagram.com')) return 'instagram'
  if (lower.includes('linkedin.com')) return 'linkedin'
  if (lower.includes('wa.me') || lower.includes('whatsapp')) return 'whatsapp'
  if (lower.includes('twitter.com') || lower.includes('x.com')) return 'x'
  if (lower.includes('github.com')) return 'github'
  if (lower.startsWith('mailto:') || lower.includes('@')) return 'email'
  return 'other'
}

export default function ContactLinks({ links }: ContactLinksProps) {
  if (!links || links.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link, i) => {
        const platformKey = detectPlatform(link.url)
        const icon = platformIcons[link.platform?.toLowerCase() ?? ''] ?? platformIcons[platformKey] ?? '🔗'
        const href = link.url.startsWith('http') ? link.url : `mailto:${link.url}`

        return (
          <a
            key={i}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-card border border-border hover:border-accent/50 transition-colors text-lg"
            title={link.platform}
          >
            {icon}
          </a>
        )
      })}
    </div>
  )
}
