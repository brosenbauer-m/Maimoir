import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="font-bold text-xl text-accent-light">Maimoir</span>
          <div className="flex items-center gap-4">
            <Link href="/discover" className="text-text-secondary hover:text-text-primary text-sm transition-colors">
              Discover
            </Link>
            <Link href="/login" className="text-text-secondary hover:text-text-primary text-sm transition-colors">
              Login
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-accent hover:bg-accent/90 text-white text-sm rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-subtle border border-accent/30 text-accent-light text-xs font-medium mb-8">
            <span>✨</span>
            <span>Your personal AI representative</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-text-primary leading-tight mb-6">
            Your AI.{' '}
            <span className="text-accent-light">Your Story.</span>
            <br />
            On Your Terms.
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-10">
            Create your Maimoir — an AI agent that knows you deeply and speaks on your behalf to anyone who visits your profile.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-4 bg-accent hover:bg-accent/90 text-white font-semibold rounded-xl transition-colors text-lg"
            >
              Create Your Maimoir
            </Link>
            <Link
              href="/discover"
              className="px-8 py-4 bg-surface border border-border hover:border-accent/50 text-text-primary font-semibold rounded-xl transition-colors text-lg"
            >
              See an Example
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-20 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-text-primary mb-12">
            Everything you need to share who you are
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '📖',
                title: 'Share Your Story',
                desc: 'Feed your Maimoir everything that makes you unique — your work, passions, values, and goals. It speaks for you with precision.',
              },
              {
                icon: '🔍',
                title: 'Be Discovered',
                desc: 'Let the right people find you. Set your discoverability preferences and let your Maimoir surface you to relevant connections.',
              },
              {
                icon: '🤝',
                title: 'Connect Meaningfully',
                desc: "When mutual interest sparks, Maimoir generates a compatibility summary so both of you know exactly why you'd connect well.",
              },
            ].map(f => (
              <div key={f.title} className="bg-card border border-border rounded-xl p-6">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-semibold text-text-primary mb-3">{f.title}</h3>
                <p className="text-text-secondary leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mock Chat UI */}
      <section className="py-20 px-4 bg-surface">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-text-primary mb-4">
            See it in action
          </h2>
          <p className="text-center text-text-secondary mb-10">
            This is what it looks like to talk to someone&apos;s Maimoir
          </p>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="border-b border-border px-5 py-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-white font-bold">
                A
              </div>
              <div>
                <p className="font-semibold text-text-primary text-sm">Alex&apos;s Maimoir</p>
                <p className="text-xs text-text-secondary">Ask me anything about Alex</p>
              </div>
            </div>
            <div className="p-5 space-y-4 min-h-[260px]">
              <div className="flex justify-end">
                <div className="bg-accent text-white rounded-2xl rounded-br-none px-4 py-3 text-sm max-w-[75%]">
                  What does Alex do for work?
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-xs font-bold">M</span>
                </div>
                <div className="bg-background border border-border rounded-2xl rounded-bl-none px-4 py-3 text-sm text-text-primary max-w-[75%]">
                  Alex is a product designer with 7 years of experience, currently leading design at a Series B startup in the climate tech space. She specialises in design systems and user research.
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-accent text-white rounded-2xl rounded-br-none px-4 py-3 text-sm max-w-[75%]">
                  What is she passionate about outside of work?
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-xs font-bold">M</span>
                </div>
                <div className="bg-background border border-border rounded-2xl rounded-bl-none px-4 py-3 text-sm text-text-primary max-w-[75%]">
                  Outside of work, Alex is an avid rock climber and amateur ceramicist. She&apos;s also deeply interested in sustainable architecture and spends a lot of time exploring how design can influence behaviour at a city scale.
                </div>
              </div>
            </div>
            <div className="border-t border-border p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask about Alex..."
                  className="flex-1 bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent/60"
                  readOnly
                />
                <button className="px-4 py-2 bg-accent text-white rounded-lg text-sm">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="font-bold text-xl text-accent-light">Maimoir</span>
          <div className="flex flex-wrap gap-6 text-sm text-text-secondary">
            <Link href="/discover" className="hover:text-text-primary transition-colors">Discover</Link>
            <Link href="/privacy" className="hover:text-text-primary transition-colors">Privacy</Link>
            <Link href="/login" className="hover:text-text-primary transition-colors">Login</Link>
            <Link href="/signup" className="hover:text-text-primary transition-colors">Sign Up</Link>
          </div>
          <p className="text-xs text-text-secondary">© 2025 Maimoir. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
