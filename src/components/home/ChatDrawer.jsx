import { useState, useEffect, useRef } from 'react';
import { readChatHistory, writeChatHistory } from '../../utils/storage.js';
import CompanionAvatarView from '../common/CompanionAvatarView.jsx';

export default function ChatDrawer({ isOpen, onClose, companion, userName }) {
  const [messages, setMessages] = useState(() => readChatHistory(companion.displayName, userName));
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // When drawer opens, load freshest messages
  useEffect(() => {
    if (isOpen) {
      setMessages(readChatHistory(companion.displayName, userName));
    }
  }, [isOpen, companion.displayName, userName]);

  if (!isOpen) return null;

  const handleSend = (textToSend = inputText) => {
    const text = textToSend.trim();
    if (!text) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    writeChatHistory(updated);
    setInputText('');
    setIsTyping(true);

    // Companion empathetic automated replies based on keywords and personality
    setTimeout(() => {
      let replyText = `I hear you, ${userName}. Thank you for sharing that with me. Take a deep breath — I'm right here with you.`;

      const lower = text.toLowerCase();
      if (lower.includes('exam') || lower.includes('nervous') || lower.includes('stress')) {
        replyText = `It is completely natural to feel nervous before a big moment. Remember to take it one step at a time. You've prepared more than your anxiety gives you credit for.`;
      } else if (lower.includes('gist') || lower.includes('laugh') || lower.includes('funny')) {
        replyText = `Haha, you know I'm always ready for a good gist! Tell me everything. What happened today?`;
      } else if (lower.includes('day') || lower.includes('tired') || lower.includes('exhausted')) {
        replyText = `Days like today can really take it out of us. You don't have to carry it all right now. Get comfortable and let your shoulders drop.`;
      } else if (lower.includes('smile') || lower.includes('happy') || lower.includes('good')) {
        replyText = `That brings such warmth to my heart! Hold onto that feeling today. What made that moment so special?`;
      } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
        replyText = `Hello ${userName}! How are you feeling right now at this moment?`;
      }

      const companionMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'companion',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const finalMessages = [...updated, companionMsg];
      setMessages(finalMessages);
      writeChatHistory(finalMessages);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
      />

      {/* Slide-over panel */}
      <div className="relative z-10 w-full sm:w-[460px] h-full bg-[#fbf5ed] dark:bg-[#1a2a26] text-[#263632] dark:text-[#f4eee5] border-l border-[#705142]/15 dark:border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#705142]/10 dark:border-white/10 flex items-center justify-between bg-[#fffaf3] dark:bg-[#152320]">
          <div className="flex items-center gap-3">
            <CompanionAvatarView
              avatar={companion.avatar}
              customPhoto={companion.customPhoto}
              size="sm"
              animate={false}
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-semibold text-[#173a34] dark:text-[#f4eee5]">
                  {companion.displayName}
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-xs text-[#5d6761] dark:text-[#a3b2ab]">
                {companion.personality ? `Here for you · ${companion.personality.slice(0, 30)}...` : 'Always present'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-lg"
            aria-label="Close chat"
          >
            ✕
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          <div className="text-center my-2">
            <span className="text-[11px] uppercase tracking-wider text-[#5d6761] dark:text-[#a3b2ab] px-3 py-1 rounded-full bg-black/5 dark:bg-white/5">
              Today’s Space with {companion.displayName}
            </span>
          </div>

          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[85%] ${
                  isUser ? 'ml-auto' : 'mr-auto'
                } animate-in fade-in slide-in-from-bottom-2 duration-200`}
              >
                <div
                  className={`p-3.5 sm:p-4 rounded-2xl text-sm leading-relaxed ${
                    isUser
                      ? 'bg-[#173a34] text-[#fffaf2] rounded-br-xs shadow-sm'
                      : 'bg-white dark:bg-[#253b36] border border-[#705142]/10 dark:border-white/10 text-[#263632] dark:text-[#f4eee5] rounded-bl-xs shadow-xs'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-[#5d6761] dark:text-[#a3b2ab] mt-1 px-1">
                  {m.timestamp}
                </span>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-white dark:bg-[#253b36] border border-[#705142]/10 dark:border-white/10 w-16 text-[#173a34] dark:text-[#a8b698]">
              <span className="w-2 h-2 rounded-full bg-current animate-bounce" />
              <span
                className="w-2 h-2 rounded-full bg-current animate-bounce"
                style={{ animationDelay: '0.2s' }}
              />
              <span
                className="w-2 h-2 rounded-full bg-current animate-bounce"
                style={{ animationDelay: '0.4s' }}
              />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3.5 sm:p-4 border-t border-[#705142]/10 dark:border-white/10 bg-[#fffaf3] dark:bg-[#152320]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message ${companion.displayName}...`}
              className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-[#1f332e] border border-[#705142]/20 dark:border-white/15 text-sm text-[#263632] dark:text-[#f4eee5] placeholder-[#5d6761]/50 focus:outline-none focus:ring-2 focus:ring-[#173a34]/30"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-5 py-3 rounded-xl bg-[#173a34] text-white font-medium text-sm disabled:opacity-40 hover:bg-[#245248] active:scale-95 transition-all cursor-pointer"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
