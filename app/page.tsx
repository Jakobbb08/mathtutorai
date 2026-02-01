'use client';

import { useState, useRef, useEffect } from 'react';
import type { ReactElement } from 'react';
import { BlockMath, InlineMath } from 'react-katex';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input, history: messages }),
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMessage: Message = { role: 'assistant', content: data.response };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again or check if you have set up an API key.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const renderMathContent = (content: string) => {
    // Split content by $$ for block math and $ for inline math
    const parts: ReactElement[] = [];
    let currentIndex = 0;
    
    // Process block math first ($$...$$)
    const blockMathRegex = /\$\$(.*?)\$\$/gs;
    const inlineMathRegex = /\$(.*?)\$/g;
    
    let lastIndex = 0;
    const segments: Array<{ type: 'text' | 'block' | 'inline', content: string, start: number, end: number }> = [];
    
    // Find all block math
    let match;
    while ((match = blockMathRegex.exec(content)) !== null) {
      segments.push({ type: 'block', content: match[1], start: match.index, end: match.index + match[0].length });
    }
    
    // Find all inline math (but not those within block math)
    inlineMathRegex.lastIndex = 0;
    while ((match = inlineMathRegex.exec(content)) !== null) {
      // Check if this is not within a block math segment
      const isInBlock = segments.some(seg => seg.type === 'block' && match!.index >= seg.start && match!.index < seg.end);
      if (!isInBlock) {
        segments.push({ type: 'inline', content: match[1], start: match.index, end: match.index + match[0].length });
      }
    }
    
    // Sort segments by start position
    segments.sort((a, b) => a.start - b.start);
    
    // Build the output
    let pos = 0;
    segments.forEach((seg, idx) => {
      // Add text before this segment
      if (pos < seg.start) {
        const text = content.substring(pos, seg.start);
        parts.push(<span key={`text-${idx}`}>{text}</span>);
      }
      
      // Add the math segment
      try {
        if (seg.type === 'block') {
          parts.push(
            <div key={`math-${idx}`} className="my-4 overflow-x-auto">
              <BlockMath>{seg.content}</BlockMath>
            </div>
          );
        } else {
          parts.push(
            <span key={`math-${idx}`} className="inline-block mx-1">
              <InlineMath>{seg.content}</InlineMath>
            </span>
          );
        }
      } catch (e) {
        // If KaTeX fails to render, show the raw content
        parts.push(<span key={`math-${idx}`}>${seg.content}$</span>);
      }
      
      pos = seg.end;
    });
    
    // Add remaining text
    if (pos < content.length) {
      parts.push(<span key="text-end">{content.substring(pos)}</span>);
    }
    
    return <div>{parts}</div>;
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            🧮 MathTutorAI
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Free & Open Source AI Math Tutor
          </p>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Welcome to MathTutorAI!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Ask me any math question and I'll help you solve it step by step.
              </p>
              <div className="grid gap-3 max-w-2xl mx-auto">
                <button
                  onClick={() => setInput('Solve: 2x + 5 = 13')}
                  className="p-3 bg-white dark:bg-gray-700 rounded-lg shadow hover:shadow-md transition-shadow text-left"
                >
                  <span className="font-medium">Solve an equation:</span> 2x + 5 = 13
                </button>
                <button
                  onClick={() => setInput('Explain the Pythagorean theorem')}
                  className="p-3 bg-white dark:bg-gray-700 rounded-lg shadow hover:shadow-md transition-shadow text-left"
                >
                  <span className="font-medium">Learn a concept:</span> Pythagorean theorem
                </button>
                <button
                  onClick={() => setInput('Find the derivative of x^2 + 3x + 2')}
                  className="p-3 bg-white dark:bg-gray-700 rounded-lg shadow hover:shadow-md transition-shadow text-left"
                >
                  <span className="font-medium">Calculus help:</span> Derivative of x² + 3x + 2
                </button>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow'
                  }`}
                >
                  {message.role === 'user' ? (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  ) : (
                    renderMathContent(message.content)
                  )}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a math question..."
              className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
