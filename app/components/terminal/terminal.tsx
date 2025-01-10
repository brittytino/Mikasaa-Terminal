'use client'

import { useState, useRef, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

interface CommandHistory {
  command: string
  output: string
  loading?: boolean
}

const trainedResponses = [
  "Oh, how original. I haven't heard that one before.",
  "Are you trying to impress me? Because it's not working.",
  "I've seen potatoes with more interesting things to say.",
  "Wow, you're really pushing the boundaries of conversation, aren't you?",
  "I'm not sure what's duller: your words or a butter knife.",
  "Did you learn to talk from a rock? Because that's about as exciting.",
  "I've had more stimulating conversations with a wall.",
  "Your words are like titans - big, slow, and not very bright.",
  "If sarcasm could kill titans, your comment would be our secret weapon.",
  "I'm starting to think Eren's stubbornness is contagious.",
  "That's almost as clever as Connie on a bad day.",
  "Your wit is sharper than my blades. Oh wait, no it's not.",
  "I'd rather face a horde of titans than continue this riveting exchange.",
  "Your conversational skills are truly... titanic.",
  "I've seen more life in a corpse than in your words.",
  "Are you trying to bore me to death? Because it's working.",
  "Your words hit about as hard as Armin in a fist fight.",
  "I'm not sure what's more painful: titan teeth or your attempt at conversation.",
  "You're about as subtle as a colossal titan in a china shop.",
  "Your charm is as abundant as food outside the walls.",
  "I've met smarter titans than you.",
  "Your words are like ODM gear without gas - going nowhere fast.",
  "I'd rather clean Levi's boots than listen to more of this.",
  "You're as dense as the walls, and half as useful.",
  "Your conversation is like Eren's titan form - out of control and destructive.",
  "I've seen more direction in a spinning ODM gear than in your thoughts.",
  "Your words are like the Beast Titan's throws - missing the mark entirely.",
  "You're about as reassuring as Reiner's mental stability.",
  "Your chat is as exciting as watching grass grow inside Wall Sina.",
  "I'd rather eat military rations for a year than continue this conversation.",
  "Your wit is as sharp as a soup spoon.",
  "I've seen more life in a titan's eyes than in your words.",
  "You're as unpredictable as Mikasa's devotion to Eren - which is to say, not at all.",
  "Your conversation skills are like our knowledge of the titans - severely lacking.",
  "I'd rather be stuck in a room with Jean's ego than listen to more of this.",
  "Your words are like the walls - old, crumbling, and in desperate need of an upgrade.",
  "You're about as helpful as Ymir's secrets.",
  "I've had more enlightening conversations with a horse... and I'm not talking about Jean.",
  "Your chat is as warm and inviting as a titan's stomach.",
  "You're as straightforward as the path to Eren's basement - which is to say, not at all.",
  "I'd rather try to understand the Founding Titan's powers than your point.",
  "Your words are like Levi's height - short and disappointing.",
  "You're about as trustworthy as a shifter in the Survey Corps.",
  "I've seen more coherence in Eren's titan experiments.",
  "Your conversation is like our supplies - rapidly dwindling and of poor quality.",
  "You're as subtle as a thunder spear to the face.",
  "I'd rather clean the entire HQ with a toothbrush than continue this chat.",
  "Your wit is like our chances against the titans - slim to none.",
  "You're about as reliable as Marley's peace treaties.",
  "I've had more stimulating conversations with my ODM gear."
]

const getRandomReply = (message: string) => {
  const lowercaseMessage = message.toLowerCase()
  const keywords = ['titan', 'wall', 'survey corps', 'eren', 'mikasa', 'armin', 'levi', 'scout', 'marley', 'paradis']
  
  const matchingResponses = trainedResponses.filter(response => 
    keywords.some(keyword => response.toLowerCase().includes(keyword) && lowercaseMessage.includes(keyword))
  )

  if (matchingResponses.length > 0) {
    return matchingResponses[Math.floor(Math.random() * matchingResponses.length)]
  } else {
    return trainedResponses[Math.floor(Math.random() * trainedResponses.length)]
  }
}

export default function Terminal() {
  const [history, setHistory] = useState<CommandHistory[]>([])
  const [currentCommand, setCurrentCommand] = useState('')
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const terminalRef = useRef<HTMLDivElement>(null)
  const [cursorVisible, setCursorVisible] = useState(true)
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(v => !v)
    }, 530)
    return () => clearInterval(interval)
  }, [])

  const commands = {
    help: () => `Available commands:
╭───────────────────────────────────────────╮
│  help     : Show this list                │
│  features : List MikasaAI features        │
│  roadmap  : View project roadmap          │
│  about    : What is MikasaAI?             │
│  github   : Visit GitHub profile          │
│  twitter  : Visit Twitter profile         │
│  ca       : Display token address         │
╰───────────────────────────────────────────╯`,
    
    ca: () => 'E7Rbz6xX45yGS8jWbkkLQvWiP4pXRsUyyosiYYCXpump',
    
    github: () => {
      window.open('https://github.com', '_blank')
      return 'Opening GitHub... Stay vigilant out there.'
    },
    
    twitter: () => {
      window.open('https://twitter.com', '_blank')
      return 'Opening Twitter... Don\'t let it distract you from our mission.'
    },

    about: () => `MikasaAI: Your relentless AI-powered developer assistant. As unstoppable as a titan, but on your side.`,

    features: () => `MikasaAI Features:
╭───────────────────────────────────────────╮
│ ⚔️  Titan-class CLI: Unbeatable interface │
│ 🧠 ODM-gear API: Swift, agile responses  │
│ 🛡️  Walls of Code: Impenetrable security  │
│ 🌪️  Ackerman Reflex: Lightning-fast dev   │
│ 🎯 Precision Coding: Surgical accuracy   │
╰───────────────────────────────────────────╯`,

    roadmap: () => `MikasaAI Roadmap:
╭───────────────────────────────────────────╮
│ 1️⃣  Phase 1: Breach the Walls (Launch)    │
│ 2️⃣  Phase 2: Retake Wall Maria (Integrate)│
│ 3️⃣  Phase 3: Reach the Sea (Expand)       │
╰───────────────────────────────────────────╯`,
  }

  const handleCommand = async (command: string) => {
    const trimmedCommand = command.trim().toLowerCase()
    if (!trimmedCommand) return

    setCommandHistory(prev => [...prev, trimmedCommand])
    setHistoryIndex(-1)

    const [cmd, ...args] = trimmedCommand.split(' ')
    const handler = commands[cmd as keyof typeof commands]
    
    const newHistoryItem = { command: trimmedCommand, output: '', loading: false }
    setHistory(prev => [...prev, newHistoryItem])
    
    if (handler) {
      const output = await handler(args.join(' '))
      setHistory(prev => prev.map((item, i) => 
        i === prev.length - 1 ? { ...item, output } : item
      ))
    } else {
      // Simulate loading
      setHistory(prev => prev.map((item, i) => 
        i === prev.length - 1 ? { ...item, loading: true } : item
      ))

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      const reply = getRandomReply(trimmedCommand)

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
    <div className="terminal-container w-full h-[70vh] bg-black/95 text-red-400 font-mono rounded-lg overflow-hidden border border-red-800/50 shadow-lg">
      <div className="terminal-header flex items-center gap-2 p-2 bg-gray-900/50 border-b border-red-800/30">
        <div className="h-3 w-3 rounded-full bg-red-500"></div>
        <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
        <div className="h-3 w-3 rounded-full bg-green-500"></div>
        <div className="ml-2 text-xs text-red-400/70">MikasaAI Terminal v1.0.2</div>
      </div>
      <div ref={terminalRef} className="terminal-body h-[calc(100%-2rem)] overflow-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-red-800/20 scrollbar-track-transparent">
        <div className="text-red-400 font-bold space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-red-500">MikasaAI</span>
            <span className="text-xs text-red-400/70">Combat systems initialized.</span>
          </div>
          <div className="text-sm text-red-400/70">Type 'help' for available commands, recruit.</div>
        </div>
        {history.map((item, i) => (
          <div key={i} className="space-y-1 py-2 border-b border-red-500/10">
            <div className="flex items-center gap-2">
              <span className="text-red-500">$</span>
              <span className="font-bold">{item.command}</span>
            </div>
            <div className="ml-4 whitespace-pre-wrap text-red-300">
              {item.loading ? (
                <div className="flex items-center gap-2 text-red-400/70">
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
            onChange={(e) => {
              setCurrentCommand(e.target.value)
              setIsTyping(true)
              setTimeout(() => setIsTyping(false), 100)
            }}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none"
            autoFocus
          />
          <span 
            className={`${cursorVisible && !isTyping ? 'opacity-100' : 'opacity-0'} transition-opacity`}
          >
            ▋
          </span>
        </div>
      </div>
    </div>
  )
}

