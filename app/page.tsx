'use client'

import Terminal from './components/terminal/terminal'
import InteractiveBackground from './components/interactive-background/interactive-background'

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black">
      <InteractiveBackground />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="mb-8 font-aot text-6xl font-bold tracking-wider text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)] sm:text-7xl lg:text-8xl animate-title">
          MikasaAI
        </h1>
        <div className="w-full max-w-4xl px-4">
          <Terminal />
        </div>
      </div>
    </main>
  )
}

