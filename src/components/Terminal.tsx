'use client'

import { useState, useRef, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import {trainedResponses} from './responses'

interface CommandHistory {
  command: string
  output: string
  loading?: boolean
}

const getReply = (message: string) => {
  const lowercaseMessage = message.toLowerCase()

  const keywordMappings = {
    greetings: ["hi", "hello", "hey", "greetings"],
    howAreYou: ["how are you", "how are things", "how's it going"],
    loveYou: ["love you", "i love you"],
    jokes: ["tell me a joke", "make me laugh", "joke"],
    encouragement: ["motivate me", "encourage me", "uplift me"]
  }

  for (const [category, keywords] of Object.entries(keywordMappings)) {
    if (keywords.some((keyword) => lowercaseMessage.includes(keyword))) {
      const responses = trainedResponses[category as keyof typeof trainedResponses]
      return responses[Math.floor(Math.random() * responses.length)]
    }
  }

  // Default to sarcasm if no keyword matches
  const sarcasticResponses = trainedResponses.sarcasm
  return sarcasticResponses[Math.floor(Math.random() * sarcasticResponses.length)]
}

export default function Terminal() {
  const [history, setHistory] = useState<CommandHistory[]>([])
  const [currentCommand, setCurrentCommand] = useState('')
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const terminalRef = useRef<HTMLDivElement>(null)

  const commands = {
    help: () => `Available commands:
help     : Show this list
features : List MikasaAI features
roadmap  : View project roadmap
about    : What is MikasaAI?
github   : Visit GitHub profile
twitter  : Visit Twitter profile
ca       : Display token address`,

ca: () => 'E7Rbz6xX45yGS8jWbkkLQvWiP4pXRsUyyosiYYCXpump',

github: () => {
  window.open('https://github.com', '_blank')
  return 'Opening GitHub... Stay vigilant out there.'
},

twitter: () => {
  window.open('https://x.com', '_blank')
  return 'Opening Twitter... Don\'t let it distract you from our mission.'
},

about: () => `MikasaAI: Your relentless AI-powered developer assistant. As unstoppable as a titan, but on your side.`,

features: () => `MikasaAI Features:
Titan-class CLI: Unbeatable interface
ODM-gear API: Swift, agile responses
Walls of Code: Impenetrable security
Ackerman Reflex: Lightning-fast dev
Precision Coding: Surgical accuracy`,

roadmap: () => `MikasaAI Roadmap:
Phase 1: Breach the Walls (Launch)
Phase 2: Retake Wall Maria (Integrate)
Phase 3: Reach the Sea (Expand)`
}

  const handleCommand = async (command: string) => {
    const trimmedCommand = command.trim().toLowerCase()
    if (!trimmedCommand) return

    setCommandHistory(prev => [...prev, trimmedCommand])
    setHistoryIndex(-1)

    const newHistoryItem = { command: trimmedCommand, output: '', loading: false }
    setHistory(prev => [...prev, newHistoryItem])

    const [cmd, ...args] = trimmedCommand.split(' ')
    const handler = commands[cmd as keyof typeof commands]

    if (handler) {
      const output = await handler()
      setHistory(prev => prev.map((item, i) =>
        i === prev.length - 1 ? { ...item, output } : item
      ))
    } else {
      setHistory(prev => prev.map((item, i) =>
        i === prev.length - 1 ? { ...item, loading: true } : item
      ))

      await new Promise(resolve => setTimeout(resolve, 1000))
      const reply = getReply(trimmedCommand)
      setHistory(prev => prev.map((item, i) =>
        i === prev.length - 1 ? { ...item, loading: false, output: reply } : item
      ))
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(currentCommand)
      setCurrentCommand('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setCurrentCommand('')
      }
    }
  }

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  return (
    <div
      className="terminal-container w-full h-[70vh] bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white font-mono rounded-lg overflow-hidden border border-gray-700 shadow-xl relative"
      style={{
        backgroundImage: 'url("/path-to-attack-on-titan-bg.jpg")',
        backgroundSize: 'cover',
        backgroundBlendMode: 'multiply',
      }}
    >
      <div className="terminal-header flex items-center gap-2 p-2 bg-black/80 border-b border-gray-700">
        <div className="h-3 w-3 rounded-full bg-red-600 shadow-md"></div>
        <div className="h-3 w-3 rounded-full bg-yellow-500 shadow-md"></div>
        <div className="h-3 w-3 rounded-full bg-green-500 shadow-md"></div>
        <div className="ml-2 text-xs font-bold text-white/80">MikasaAI Terminal v1.0.2</div>
      </div>
      <div
        ref={terminalRef}
        className="terminal-body h-[calc(100%-2rem)] overflow-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent text-sm"
      >
        <div className="text-white font-bold">
          MikasaAI combat systems initialized. Type <span className="text-red-500">'help'</span> for available commands.
        </div>
        {history.map((item, i) => (
          <div key={i} className="space-y-1 py-2 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-red-500">$</span>
              <span className="font-bold text-white">{item.command}</span>
            </div>
            <div className="ml-4 whitespace-pre-wrap text-gray-300">
              {item.loading ? (
                <div className="flex items-center gap-2 text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing request...
                </div>
              ) : (
                item.output
              )}
            </div>
          </div>
        ))}
        <div className="flex items-center gap-2 pt-2">
          <span className="text-red-500">$</span>
          <input
            type="text"
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-white placeholder-gray-500"
            placeholder="Enter command..."
            autoFocus
          />
        </div>
      </div>
    </div>
  )
}
