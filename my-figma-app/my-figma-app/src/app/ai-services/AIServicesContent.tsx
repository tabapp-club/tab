"use client";

import React, { useState, useEffect } from 'react';
import { MobileMenuToggle } from "@/components/MobileMenuToggle";
import { useSidebar } from "@/components/SidebarContext";
import { useAuth } from "@/contexts/AuthContext";

interface ChatMessage {
  id: string;
  content: string;
  timestamp: Date;
  isUser: boolean;
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
}

export function AIServicesContent() {
  const { isCollapsed, isMobile } = useSidebar();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Force uncollapsed state on mobile
  const actualIsCollapsed = isMobile ? false : isCollapsed;

  // Get current session
  const currentSession = chatSessions.find(session => session.id === currentSessionId);

  // Load chat sessions from localStorage on component mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('ai-chat-sessions');
    if (savedSessions) {
      try {
        const parsed = JSON.parse(savedSessions);
        setChatSessions(parsed.map((session: any) => ({
          ...session,
          createdAt: new Date(session.createdAt),
          messages: session.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        })));
      } catch (error) {
        console.error('Error loading chat sessions:', error);
        // If there's an error parsing, clear the corrupted data
        localStorage.removeItem('ai-chat-sessions');
      }
    }
  }, []);

  // Save chat sessions to localStorage whenever they change
  useEffect(() => {
    if (chatSessions.length > 0) {
      localStorage.setItem('ai-chat-sessions', JSON.stringify(chatSessions));
    } else {
      localStorage.removeItem('ai-chat-sessions');
    }
  }, [chatSessions]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const suggestedQuestions = [
    "Why did my sales drop this month?",
    "What's my top-selling product?",
    "How much profit did I make this quarter?",
    "Which location is underperforming?",
    "How many new customers added this month?",
    "how is my business performing?"
  ];

  const createNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      createdAt: new Date()
    };
    setChatSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(null); // Don't automatically select the new chat
    setMessage('');
  };

  const selectChatSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setMessage('');
  };

  const clearAllConversations = () => {
    if (window.confirm('Are you sure you want to clear all conversations? This action cannot be undone.')) {
      setChatSessions([]);
      setCurrentSessionId(null);
      setMessage('');
    }
  };

  const deleteChatSession = (sessionId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      setChatSessions(prev => prev.filter(session => session.id !== sessionId));
      if (currentSessionId === sessionId) {
        setCurrentSessionId(null);
      }
    }
  };

  const handleQuestionClick = (question: string) => {
    if (!currentSessionId) {
      // Create new chat and send message directly
      handleSendMessage(question);
    } else {
      setMessage(question);
    }
  };

  const simulateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Simple response simulation based on keywords
    const lowerMessage = userMessage.toLowerCase();
    if (lowerMessage.includes('sales') && lowerMessage.includes('drop')) {
      return "Based on your data, your sales dropped by 15% this month. The main factors appear to be seasonal fluctuations and reduced marketing spend. I recommend increasing your marketing budget and focusing on your top-performing products.";
    } else if (lowerMessage.includes('top') && lowerMessage.includes('product')) {
      return "Your top-selling product is the Premium Widget with 2,450 units sold this quarter, generating $45,200 in revenue. It has a 92% customer satisfaction rating.";
    } else if (lowerMessage.includes('profit') || lowerMessage.includes('quarter')) {
      return "Your Q3 profit was $127,500, which is a 12% increase from Q2. Your gross margin improved to 34% due to better supplier negotiations.";
    } else if (lowerMessage.includes('location') || lowerMessage.includes('underperforming')) {
      return "The Downtown location is underperforming with 23% lower sales than average. The main issues are limited parking and reduced foot traffic. Consider implementing a delivery service.";
    } else if (lowerMessage.includes('customers') || lowerMessage.includes('new')) {
      return "You added 342 new customers this month, a 18% increase from last month. Your customer acquisition cost is $45, which is within your target range.";
    } else if (lowerMessage.includes('business') && lowerMessage.includes('performing')) {
      return "Your business is performing well overall! Revenue is up 15% year-over-year, customer satisfaction is at 4.6/5, and your retention rate is 78%. Key growth areas are online sales and subscription services.";
    } else {
      return "I understand you're asking about your business. To provide more specific insights, I'd need access to your actual business data. Would you like me to analyze a particular aspect of your business?";
    }
  };

  const handleSendMessage = async (customMessage?: string) => {
    const messageToSend = customMessage || message.trim();
    if (!messageToSend) return;

    // If no current session, create one first
    let sessionId = currentSessionId;
    if (!sessionId) {
      const newSession: ChatSession = {
        id: Date.now().toString(),
        title: "New Chat",
        messages: [],
        createdAt: new Date()
      };
      setChatSessions(prev => [newSession, ...prev]);
      sessionId = newSession.id;
      setCurrentSessionId(sessionId);
    }

    setIsLoading(true);

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: messageToSend,
      timestamp: new Date(),
      isUser: true
    };

    setChatSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        const updatedMessages = [...session.messages, userMessage];
        return {
          ...session,
          title: session.messages.length === 0 ? messageToSend.slice(0, 50) + (messageToSend.length > 50 ? '...' : '') : session.title,
          messages: updatedMessages
        };
      }
      return session;
    }));

    setMessage('');

    try {
      // Simulate AI response
      const aiResponse = await simulateAIResponse(messageToSend);

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        timestamp: new Date(),
        isUser: false
      };

      setChatSessions(prev => prev.map(session => {
        if (session.id === sessionId) {
          return {
            ...session,
            messages: [...session.messages, aiMessage]
          };
        }
        return session;
      }));
    } catch (error) {
      console.error('Error getting AI response:', error);
      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error while processing your request. Please try again.",
        timestamp: new Date(),
        isUser: false
      };

      setChatSessions(prev => prev.map(session => {
        if (session.id === sessionId) {
          return {
            ...session,
            messages: [...session.messages, errorMessage]
          };
        }
        return session;
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <main className={`flex-1 transition-sidebar ai-services-main ${
      actualIsCollapsed ? 'main-content sidebar-collapsed' : 'main-content'
    }`}>
      {/* Mobile Menu Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <MobileMenuToggle />
      </div>

      {/* Main Content */}
      <div className="w-full max-w-full px-3 py-4 sm:px-4 sm:py-5 lg:px-8 lg:py-8 overflow-x-hidden h-screen ai-services-content lg:pr-[282px]">
        <div className="pt-12 lg:pt-0 h-full flex flex-col">
          {/* Greeting */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-light text-[#2a2a2f] leading-[1.4]">
              {getGreeting()}
            </h1>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full">
            {!currentSessionId || (currentSession && currentSession.messages.length === 0) ? (
              <>
                {/* Header Section */}
                <div className="text-center mb-8 sm:mb-12 max-w-2xl px-4">
                  <h2 className="text-xl sm:text-2xl lg:text-[32px] font-bold text-[#2a2a2f] leading-[1.4] mb-2">
                    Ask anything about your business
                  </h2>
                  <p className="text-sm sm:text-base text-[#2a2a2f] leading-[1.4]">
                    Get your personalised AI services for your business
                  </p>
                </div>

                {/* Suggested Questions Grid */}
                <div className="w-full max-w-4xl mb-6 px-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 suggested-questions-grid">
                    {suggestedQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuestionClick(question)}
                        className="p-3 sm:p-4 text-left border border-[#e9e9e9] rounded-lg hover:bg-gray-50 transition-colors duration-200 suggested-question focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        aria-label={`Ask: ${question}`}
                      >
                        <p className="font-semibold text-[#2a2a2f] text-xs sm:text-sm leading-[20px]">
                          {question}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Field */}
                <div className="w-full max-w-4xl px-4">
                  <div className="bg-[#f6f6f6] border border-[#e9e9e9] rounded-lg p-3 sm:p-5 flex items-center gap-3 sm:gap-4 ai-input-container">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type message"
                        className="w-full bg-transparent text-[#2a2a2f] text-sm placeholder-[#a1a1a1] focus:outline-none "
                        aria-label="Type your business question"
                      />
                    </div>
                    <button
                      onClick={() => handleSendMessage()}
                      disabled={!message.trim()}
                      className="bg-[#2a2a2f] text-white p-2 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-[#1a1a1f] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label="Send message"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="rotate-45 sm:w-5 sm:h-5"
                        aria-hidden="true"
                      >
                        <path
                          d="M7 17L17 7M17 7H7M17 7V17"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Chat Interface */
              <div className="w-full max-w-4xl h-full flex flex-col px-4">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                  {currentSession?.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          msg.isUser
                            ? 'bg-[#2a2a2f] text-white'
                            : 'bg-[#f6f6f6] text-[#2a2a2f]'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                        <p className={`text-xs mt-1 ${
                          msg.isUser ? 'text-gray-300' : 'text-gray-500'
                        }`}>
                          {formatTimestamp(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-[#f6f6f6] text-[#2a2a2f] p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#2a2a2f]"></div>
                          <span className="text-sm">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Field */}
                <div className="bg-[#f6f6f6] border border-[#e9e9e9] rounded-lg p-3 sm:p-5 flex items-center gap-3 sm:gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type message"
                      className="w-full bg-transparent text-[#2a2a2f] text-sm placeholder-[#a1a1a1] focus:outline-none"
                      disabled={isLoading}
                      aria-label="Type your business question"
                    />
                  </div>
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!message.trim() || isLoading}
                    className="bg-[#2a2a2f] text-white p-2 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-[#1a1a1f] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Send message"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="rotate-45 sm:w-5 sm:h-5"
                      aria-hidden="true"
                    >
                      <path
                        d="M7 17L17 7M17 7H7M17 7V17"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Chat History */}
      <div className="hidden lg:block fixed right-0 top-0 h-full w-[282px] bg-[#f6f6f6] border-l border-[#e9e9e9] ai-services-sidebar">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-[#e9e9e9]">
            <button
              onClick={createNewChat}
              className="w-full bg-white border border-[#e9e9e9] rounded-lg p-3 flex items-center gap-3 hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Start new chat"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M12 5v14M5 12h14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="font-semibold text-[#2a2a2f] text-base">New chat</span>
            </button>
          </div>

          {/* Chat History */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="flex items-center gap-2 mb-6">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  stroke="#a1a1a1"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="font-semibold text-[#a1a1a1] text-base">Chat history</span>
            </div>

            {chatSessions.length === 0 ? (
              <p className="text-[#a1a1a1] text-sm">No conversations yet. Start a new chat to begin!</p>
            ) : (
              <div className="space-y-2">
                {chatSessions.map((session) => (
                  <div
                    key={session.id}
                    className={`group relative p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                      currentSessionId === session.id
                        ? 'bg-white border border-[#e9e9e9]'
                        : 'hover:bg-white'
                    }`}
                    onClick={() => selectChatSession(session.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${
                          currentSessionId === session.id ? 'text-[#2a2a2f]' : 'text-[#a1a1a1]'
                        }`}>
                          {session.title}
                        </p>
                        <p className="text-xs text-[#a1a1a1] mt-1">
                          {formatTimestamp(session.createdAt)}
                        </p>
                      </div>
                      <button
                        onClick={(e) => deleteChatSession(session.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all duration-200"
                        aria-label={`Delete chat: ${session.title}`}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-red-500"
                        >
                          <path
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[#e9e9e9]">
            <button
              onClick={clearAllConversations}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Clear all conversations"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  stroke="#a1a1a1"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[#a1a1a1] text-sm">Clear Conversations</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
