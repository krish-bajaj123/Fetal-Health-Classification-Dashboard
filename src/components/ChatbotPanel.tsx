import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { Bot, User, AlertCircle, ShieldAlert, CheckCircle, Info, Sparkles } from 'lucide-react';

interface ChatbotPanelProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onClearHistory?: () => void;
}

export const ChatbotPanel: React.FC<ChatbotPanelProps> = ({
  messages,
  isLoading,
  onClearHistory,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
      {/* Chatbot Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
              Fetal Health Assistant
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h3>
            <p className="text-xs text-slate-500">
              Automated model prediction reporter
            </p>
          </div>
        </div>

        {messages.length > 1 && onClearHistory && (
          <button
            type="button"
            onClick={onClearHistory}
            className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 rounded hover:bg-slate-100 transition cursor-pointer"
          >
            Clear chat
          </button>
        )}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[calc(100vh-320px)] min-h-[420px]">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isBot = msg.sender === 'bot';

          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-semibold ${
                  isUser
                    ? 'bg-blue-100 text-blue-700'
                    : msg.isError
                    ? 'bg-red-100 text-red-700'
                    : 'bg-blue-600 text-white'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-xs ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : msg.isError
                    ? 'bg-red-50 border border-red-200 text-red-900 rounded-tl-none'
                    : 'bg-slate-50 border border-slate-200 text-slate-900 rounded-tl-none'
                }`}
              >
                {/* Content */}
                <div className="whitespace-pre-line leading-relaxed font-normal">
                  {msg.content}
                </div>

                {/* Classification Highlight Box if prediction present */}
                {isBot && msg.metadata?.prediction && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200/80 text-xs">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-100 text-blue-800 font-medium">
                      <span>Value:</span>
                      <span className="font-mono font-bold">
                        {msg.metadata.prediction}
                      </span>
                    </div>
                  </div>
                )}

                {/* Disclaimer Note attached to bot prediction responses */}
                {isBot && !msg.isError && msg.metadata?.prediction && (
                  <p className="mt-2 text-[11px] text-slate-500 italic">
                    For demonstration only. This prediction is not a medical diagnosis.
                  </p>
                )}

                {/* Timestamp */}
                <div
                  className={`text-[10px] mt-1.5 flex items-center gap-1 ${
                    isUser ? 'text-blue-200 justify-end' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 text-sm text-slate-600 flex items-center gap-2">
              <div className="flex space-x-1.5 items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
              </div>
              <span className="text-xs text-slate-500">Querying prediction API...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Footer / Required Disclaimer */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
        <p className="text-xs text-slate-500 font-medium flex items-center justify-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span>For demonstration only. This prediction is not a medical diagnosis.</span>
        </p>
      </div>
    </div>
  );
};
