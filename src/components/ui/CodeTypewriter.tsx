import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CodeTypewriterProps {
  code: string;
  language?: string;
  speed?: number;
  className?: string;
  backgroundLogo?: string;
}

// Simple word-based highlighting (safer for typewriter effect)
const highlightLine = (line: string): JSX.Element[] => {
  const keywords = ['import', 'from', 'const', 'await', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'interface', 'type', 'export', 'default'];
  const parts: JSX.Element[] = [];
  let currentPart = '';
  let inString = false;
  let stringChar = '';
  let inComment = false;
  let partIndex = 0;

  const addPart = (content: string, type: 'keyword' | 'string' | 'comment' | 'text') => {
    if (content) {
      const classMap = {
        keyword: 'text-purple-400',
        string: 'text-green-300',
        comment: 'text-gray-500',
        text: 'text-gray-100'
      };
      parts.push(
        <span key={partIndex++} className={classMap[type]}>
          {content}
        </span>
      );
    }
  };

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    // Handle comments
    if (!inString && char === '/' && nextChar === '/') {
      addPart(currentPart, 'text');
      currentPart = '';
      inComment = true;
    }

    if (inComment) {
      currentPart += char;
      continue;
    }

    // Handle strings
    if ((char === '"' || char === "'" || char === '`') && !inString) {
      addPart(currentPart, 'text');
      currentPart = char;
      inString = true;
      stringChar = char;
      continue;
    }

    if (inString) {
      currentPart += char;
      if (char === stringChar && line[i - 1] !== '\\') {
        inString = false;
        addPart(currentPart, 'string');
        currentPart = '';
        stringChar = '';
      }
      continue;
    }

    // Handle normal text and keywords
    if (/\s/.test(char) || /[^\w]/.test(char)) {
      if (currentPart && keywords.includes(currentPart)) {
        addPart(currentPart, 'keyword');
      } else {
        addPart(currentPart, 'text');
      }
      currentPart = '';
      if (char.trim()) {
        parts.push(<span key={partIndex++} className="text-gray-100">{char}</span>);
      } else {
        parts.push(<span key={partIndex++}>{char}</span>);
      }
    } else {
      currentPart += char;
    }
  }

  // Handle remaining part
  if (inComment) {
    addPart(currentPart, 'comment');
  } else if (inString) {
    addPart(currentPart, 'string');
  } else if (currentPart && keywords.includes(currentPart)) {
    addPart(currentPart, 'keyword');
  } else {
    addPart(currentPart, 'text');
  }

  return parts;
};

export const CodeTypewriter: React.FC<CodeTypewriterProps> = ({
  code,
  language = 'typescript',
  speed = 30,
  className = '',
  backgroundLogo
}) => {
  const [displayedCode, setDisplayedCode] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Calculate progress for logo animation
  const progress = code.length > 0 ? currentIndex / code.length : 0;

  useEffect(() => {
    if (currentIndex < code.length) {
      const timer = setTimeout(() => {
        setDisplayedCode(code.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, code, speed]);

  // Split displayed code into lines and highlight each line
  const lines = displayedCode.split('\n');
  const highlightedLines = lines.map((line, lineIndex) => (
    <div key={lineIndex}>
      {highlightLine(line)}
      {lineIndex < lines.length - 1 && <br />}
    </div>
  ));

  return (
    <motion.div
      className={`bg-gray-900 rounded-lg border border-gray-700 overflow-hidden relative ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background Logo */}
      {backgroundLogo && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <motion.img
            src={backgroundLogo}
            alt="Background Logo"
            className="w-96 h-96"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: progress * 0.08, // Very subtle opacity based on progress
              scale: 0.8 + (progress * 0.2) // Slightly grow as code types
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      {/* Terminal header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700 relative z-10">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-xs text-gray-400 font-mono">{language}</div>
      </div>

      {/* Code content */}
      <div className="p-4 font-mono text-sm relative z-10">
        <div className="whitespace-pre-wrap relative">
          {highlightedLines}
          <motion.span
            className="bg-green-400 text-gray-900 ml-0.5"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            ▊
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
};