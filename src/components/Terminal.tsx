import React, { useState, useRef, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

interface TerminalLine {
  content: string;
  isCommand?: boolean;
  isError?: boolean;
  isTable?: boolean;
}

const Terminal = () => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { content: "Welcome to MikasaAI Terminal [Version 1.0.0]" },
    { content: "© Survey Corps Technology Division. All rights reserved." },
    { content: "\nType 'help' to see available commands, soldier! 🗡️" }
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const randomResponses = [
    "Just like fighting titans, I'll handle this with precision!",
    "Even Levi would be impressed with that question...",
    "As expected of you, that's exactly right!",
    "Interesting... reminds me of something Erwin would say.",
    "Let me dedicate my heart to answering that!",
    "SHINZOU WO SASAGEYO! (That means I'm processing your request)",
    "Even beyond these walls, I'll find you an answer.",
    "That's a question worthy of the Survey Corps!",
    "Eren might go berserk over this one...",
    "Captain Levi would say this needs cleaning up..."
  ];

  const getRandomResponse = (input: string) => {
    const response = randomResponses[Math.floor(Math.random() * randomResponses.length)];
    return `${response}\n\nRegarding "${input}": Let me analyze this with the power of the Founding Titan...`;
  };

  const commands = {
    help: () => ({
      content: `Available Commands:
┌────────────┬──────────────────────────────────┐
│ Command    │ Description                      │
├────────────┼──────────────────────────────────┤
│ help       │ Display available commands       │
│ features   │ Show MikasaAI features          │
│ roadmap    │ View project roadmap            │
│ about      │ Learn about MikasaAI            │
│ github     │ Visit our GitHub                │
│ twitter    │ Follow us on Twitter            │
│ chat       │ Start interactive chat          │
└────────────┴──────────────────────────────────┘`,
      isTable: true
    }),

    features: () => ({
      content: `╔════ ✨ Features ════════════════════════╗
║                                        ║
║ 🤖 Interactive CLI Interface           ║
║ 📚 Dynamic API Understanding           ║
║ 💻 Custom Code Generation              ║
║ ⚡ Smart Resource Management           ║
║ 📁 Organized Project Structure         ║
║                                        ║
╚════════════════════════════════════════╝`,
      isTable: true
    }),

    roadmap: () => ({
      content: `╔═══════ Roadmap ═══════════════════════╗
║                                        ║
║ Phase 1: Token Launch                  ║
║ ├─ Initial distribution               ║
║ └─ Community building                 ║
║                                        ║
║ Phase 2: Integration                   ║
║ ├─ API infrastructure                 ║
║ └─ Developer tools                    ║
║                                        ║
║ Phase 3: Ecosystem Growth              ║
║ ├─ Partner integrations               ║
║ └─ Advanced features                  ║
║                                        ║
╚════════════════════════════════════════╝`,
      isTable: true
    }),

    about: () => "MikasaAI: Your AI-powered developer assistant. Like Mikasa Ackerman, we're here to protect your development process. Dedicate your heart to coding! ⚔️",

    github: () => {
      window.open('https://github.com/mikasaai', '_blank');
      return "Opening GitHub repository... Dedicate your heart! ⚔️";
    },

    twitter: () => {
      window.open('https://twitter.com/mikasaai', '_blank');
      return "Following the path to Twitter... Tatakae! 🦅";
    }
  };

  // Training data for intelligent responses
  const responsePatterns = [
    { keywords: ['hi', 'hello', 'hey'], responses: [
      "Well, if it isn't a brave soldier! What brings you to our walls today?",
      "Ah, another recruit! Try not to get eaten by a titan while you're here.",
      "Welcome to the Survey Corps! Let's hope you last longer than the extras in episode 1..."
    ]},
    { keywords: ['how', 'what', 'why', 'when', 'where'], responses: [
      "Hmm, asking the real questions like Armin would...",
      "That's the kind of curiosity that gets you promoted in the Survey Corps!",
      "Let me consult my ODM gear manual... Oh wait, wrong reference."
    ]},
    { keywords: ['help', 'assist', 'support'], responses: [
      "Need backup? Even Mikasa needs help sometimes... rarely, but sometimes.",
      "I'll assist you like Mikasa assists Eren - minus the obsession part.",
      "Ready to help! Though I can't promise I'm as reliable as thunder spears..."
    ]},
    { keywords: ['thanks', 'thank', 'appreciate'], responses: [
      "No need for thanks - we're all soldiers here! Unless you're a titan spy...",
      "Gratitude noted! Now back to protecting humanity (or whatever's left of it).",
      "You're welcome! Just don't expect me to salute back, I'm busy scanning for titans."
    ]},
    { keywords: ['bye', 'goodbye', 'later'], responses: [
      "Leaving so soon? The titans were just about to join the party!",
      "Farewell, soldier! Try not to get eaten on your way out.",
      "Until next time! Remember: beyond these walls is freedom (and certain death)."
    ]}
  ];

  const getIntelligentResponse = (input: string) => {
    const lowercaseInput = input.toLowerCase();
    
    // Check for exact command matches first
    if (commands[lowercaseInput as keyof typeof commands]) {
      return commands[lowercaseInput as keyof typeof commands]();
    }

    // Look for keyword matches in the input
    for (const pattern of responsePatterns) {
      if (pattern.keywords.some(keyword => lowercaseInput.includes(keyword))) {
        return {
          content: pattern.responses[Math.floor(Math.random() * pattern.responses.length)]
        };
      }
    }

    // Default response for unmatched inputs
    return {
      content: [
        "That's an interesting approach... for a titan.",
        "Even Eren makes more sense sometimes, and he's always screaming.",
        "Did you learn that in titan school? Because it shows.",
        "That's cute. Have you considered joining the Garrison? They accept everyone.",
        "Fascinating input! Almost as fascinating as watching paint dry on the walls.",
        "Even the Colossal Titan would scratch his head at that one...",
        "That's... unique. Like Eren's ability to consistently make bad decisions.",
        "Interesting strategy! Almost as effective as bringing a knife to a titan fight.",
        "Your words are bold! Like charging at a titan without ODM gear.",
        "That's one way to do it... if you're trying to get eaten."
      ][Math.floor(Math.random() * 10)]
    };
  };

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (trimmedCmd === '') return;

    setLines(prev => [...prev, { content: `> ${cmd}`, isCommand: true }]);
    
    const response = getIntelligentResponse(trimmedCmd);
    if (typeof response === 'string') {
      setLines(prev => [...prev, { content: response }]);
    } else {
      setLines(prev => [...prev, response]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(currentInput);
      setCurrentInput('');
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  return (
    <div className="terminal-container backdrop-blur-sm bg-black/80">
      <div className="terminal-header">
        <div className="terminal-button red"></div>
        <div className="terminal-button yellow"></div>
        <div className="terminal-button green"></div>
        <span className="ml-4 text-xs text-gray-400">mikasa@survey-corps ~ </span>
      </div>
      <div className="terminal-content">
        {lines.map((line, i) => (
          <div 
            key={i} 
            className={`terminal-line ${line.isError ? 'text-red-400' : ''} ${line.isTable ? 'whitespace-pre font-mono' : ''}`}
          >
            {line.isCommand ? (
              <span className="terminal-prompt text-rose-400">{line.content}</span>
            ) : (
              line.content
            )}
          </div>
        ))}
        <div className="terminal-line">
          <span className="terminal-prompt text-rose-400">{'> '}</span>
          <input
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="terminal-input"
            autoFocus
            placeholder="Enter a command, soldier..."
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default Terminal;