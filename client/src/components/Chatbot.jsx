import React, { useEffect, useRef, useState } from 'react';
import { Bot, MessageCircle, Send, X, Sparkles, Trash2 } from 'lucide-react';
import { chatbotAPI } from '../services/api';

const starterMessages = [
  { role: 'assistant', content: "Hi! I'm NexLearn AI 👋\nAsk me anything about programming, computer science, or your studies. How can I help?" },
];

const suggestions = ['Explain Python loops', 'Create a 7-day study plan', 'What is machine learning?'];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(starterMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, isOpen]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const sendMessage = async (text = input) => {
    const content = text.trim();
    if (!content || isLoading || content.length > 2000) return;

    const nextMessages = [...messages, { role: 'user', content }];
    setMessages(nextMessages);
    setInput('');
    setError('');
    setIsLoading(true);

    try {
      const response = await chatbotAPI.sendMessage(
        nextMessages.filter((message) => message.role !== 'assistant' || message !== starterMessages[0])
      );
      setMessages((current) => [...current, { role: 'assistant', content: response.data.reply }]);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to connect. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    setMessages(starterMessages);
    setError('');
    setInput('');
  };

  return (
    <>
      {isOpen && (
        <section className="fixed bottom-24 right-4 sm:right-6 z-[100] flex h-[600px] max-h-[calc(100dvh-7rem)] w-[calc(100vw-2rem)] max-w-[390px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <header className="flex items-center justify-between bg-[#102A43] px-4 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/15 p-2"><Bot size={21} /></div>
              <div>
                <h2 className="text-sm font-bold">NexLearn AI</h2>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-blue-100">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" /> Your learning assistant
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={resetChat} title="Clear chat" className="rounded-lg p-2 text-blue-100 hover:bg-white/10 hover:text-white"><Trash2 size={17} /></button>
              <button onClick={() => setIsOpen(false)} title="Close chat" className="rounded-lg p-2 text-blue-100 hover:bg-white/10 hover:text-white"><X size={19} /></button>
            </div>
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4">
            {messages.map((message, index) => (
              <div key={`${index}-${message.role}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.role === 'assistant' && (
                  <div className="mr-2 mt-1 h-7 w-7 shrink-0 rounded-lg bg-blue-100 p-1.5 text-blue-700"><Bot size={16} /></div>
                )}
                <div className={`max-w-[82%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-3 text-sm leading-6 ${
                  message.role === 'user'
                    ? 'rounded-br-md bg-blue-600 text-white'
                    : 'rounded-bl-md border border-slate-200 bg-white text-slate-700 shadow-sm'
                }`}>{message.content}</div>
              </div>
            ))}

            {messages.length === 1 && (
              <div className="ml-9 space-y-2">
                <p className="text-xs font-semibold text-slate-500">TRY ASKING</p>
                {suggestions.map((suggestion) => (
                  <button key={suggestion} onClick={() => sendMessage(suggestion)} className="block w-full rounded-xl border border-blue-100 bg-white px-3 py-2 text-left text-xs text-blue-700 transition hover:border-blue-300 hover:bg-blue-50">
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <div className="mr-1 rounded-lg bg-blue-100 p-1.5 text-blue-700"><Sparkles size={15} /></div>
                NexLearn AI is thinking...
                <span className="flex gap-1"><i className="h-1 w-1 animate-bounce rounded-full bg-blue-500" /><i className="h-1 w-1 animate-bounce rounded-full bg-blue-500 [animation-delay:120ms]" /><i className="h-1 w-1 animate-bounce rounded-full bg-blue-500 [animation-delay:240ms]" /></span>
              </div>
            )}
            {error && <p className="ml-9 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}
            <div ref={endRef} />
          </div>

          <form onSubmit={(event) => { event.preventDefault(); sendMessage(); }} className="border-t border-slate-200 bg-white p-3">
            <div className="flex items-end gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    sendMessage();
                  }
                }}
                rows={1}
                maxLength={2000}
                placeholder="Ask your learning question..."
                className="max-h-24 min-h-[38px] flex-1 resize-none bg-transparent px-1 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
              <button type="submit" disabled={!input.trim() || isLoading} aria-label="Send message" className="rounded-lg bg-blue-600 p-2.5 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40">
                <Send size={17} />
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] text-slate-400">AI can make mistakes. Verify important information.</p>
          </form>
        </section>
      )}

      <button
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? 'Close NexLearn AI chat' : 'Open NexLearn AI chat'}
        className="fixed bottom-5 right-4 sm:right-6 z-[100] flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl transition hover:-translate-y-1 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={25} />}
        {!isOpen && <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400" />}
      </button>
    </>
  );
}
