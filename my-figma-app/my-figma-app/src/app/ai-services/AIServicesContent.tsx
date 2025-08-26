"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MobileMenuToggle } from "@/components/MobileMenuToggle";
import { useSidebar } from "@/components/SidebarContext";
import { useAuth } from "@/contexts/AuthContext";
import Button from "@/components/ui/Button";

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

interface AIFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
}

export function AIServicesContent() {
  const { isCollapsed, isMobile } = useSidebar();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [showFeatures, setShowFeatures] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Force uncollapsed state on mobile
  const actualIsCollapsed = isMobile ? false : isCollapsed;

  // Get current session
  const currentSession = chatSessions.find(session => session.id === currentSessionId);

  // AI Features showcase
  const aiFeatures: AIFeature[] = [
    {
      id: 'analytics',
      title: 'Business Analytics',
      description: 'Get deep insights into your business performance with AI-powered analytics',
      icon: '📊',
      color: 'from-blue-25 to-blue-50',
      gradient: 'bg-gradient-to-br from-blue-25 to-blue-50'
    },
    {
      id: 'predictions',
      title: 'Predictive Insights',
      description: 'Forecast trends and make data-driven decisions with AI predictions',
      icon: '🔮',
      color: 'from-purple-25 to-purple-50',
      gradient: 'bg-gradient-to-br from-purple-25 to-purple-50'
    },
    {
      id: 'optimization',
      title: 'Performance Optimization',
      description: 'Identify bottlenecks and optimize your business processes',
      icon: '⚡',
      color: 'from-green-25 to-green-50',
      gradient: 'bg-gradient-to-br from-green-25 to-green-50'
    },
    {
      id: 'automation',
      title: 'Smart Automation',
      description: 'Automate repetitive tasks and workflows with AI assistance',
      icon: '🤖',
      color: 'from-pink-25 to-pink-50',
      gradient: 'bg-gradient-to-br from-pink-25 to-pink-50'
    }
  ];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages]);

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
    {
      text: "Why did my sales drop this month?",
      category: "Analytics"
    },
    {
      text: "What's my top-selling product?",
      category: "Performance"
    },
    {
      text: "How much profit did I make this quarter?",
      category: "Finance"
    },
    {
      text: "Which location is underperforming?",
      category: "Operations"
    },
    {
      text: "How many new customers added this month?",
      category: "Growth"
    },
    {
      text: "How is my business performing overall?",
      category: "Overview"
    }
  ];

  const createNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      createdAt: new Date()
    };
    setChatSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(null);
    setMessage('');
    setShowFeatures(true);
  };

  const selectChatSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setMessage('');
    setShowFeatures(false);
  };

  const clearAllConversations = () => {
    if (window.confirm('Are you sure you want to clear all conversations? This action cannot be undone.')) {
      setChatSessions([]);
      setCurrentSessionId(null);
      setMessage('');
      setShowFeatures(true);
    }
  };

  const deleteChatSession = (sessionId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      setChatSessions(prev => prev.filter(session => session.id !== sessionId));
      if (currentSessionId === sessionId) {
        setCurrentSessionId(null);
        setShowFeatures(true);
      }
    }
  };

  const handleQuestionClick = (question: string) => {
    if (!currentSessionId) {
      handleSendMessage(question);
    } else {
      setMessage(question);
      inputRef.current?.focus();
    }
  };

  const simulateAIResponse = async (userMessage: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const lowerMessage = userMessage.toLowerCase();
    if (lowerMessage.includes('sales') && lowerMessage.includes('drop')) {
      return "Based on your data analysis, your sales dropped by 15% this month compared to last month. The main contributing factors are:\n\n• Seasonal fluctuations (expected 8% decline)\n• Reduced marketing spend (impacted 5%)\n• Supply chain delays (affected 2%)\n\nRecommendations:\n• Increase marketing budget by 20%\n• Focus on top-performing products\n• Implement seasonal promotions\n• Optimize inventory management";
    } else     if (lowerMessage.includes('top') && lowerMessage.includes('product')) {
      return "Your top-performing product is the Premium Widget with outstanding metrics:\n\n📊 Sales Performance:\n• 2,450 units sold this quarter\n• $45,200 in revenue generated\n• 92% customer satisfaction rating\n• 15% month-over-month growth\n\n🏆 Why it's successful:\n• High-quality materials\n• Competitive pricing\n• Strong customer reviews\n• Effective marketing campaigns";
    } else if (lowerMessage.includes('profit') || lowerMessage.includes('quarter')) {
      return "Your Q3 financial performance shows strong growth:\n\n💰 Profit Analysis:\n• Total Profit: $127,500\n• Q2 to Q3 Growth: +12%\n• Gross Margin: 34% (improved from 31%)\n• Net Profit Margin: 18.5%\n\n📈 Key Improvements:\n• Better supplier negotiations (saved $15K)\n• Operational efficiency gains\n• Reduced overhead costs\n• Increased average order value";
    } else if (lowerMessage.includes('location') || lowerMessage.includes('underperforming')) {
      return "The Downtown location is currently underperforming:\n\n📍 Performance Metrics:\n• Sales: 23% below average\n• Customer traffic: -18%\n• Conversion rate: 2.1% (vs 3.2% average)\n• Customer satisfaction: 3.8/5\n\n🔍 Root Causes:\n• Limited parking availability\n• Reduced foot traffic due to construction\n• Higher rent costs\n• Staffing challenges\n\n💡 Recommendations:\n• Implement delivery service\n• Partner with nearby businesses\n• Optimize store layout\n• Launch local marketing campaigns";
    } else if (lowerMessage.includes('customers') || lowerMessage.includes('new')) {
      return "Your customer acquisition is showing strong momentum:\n\n👥 New Customer Metrics:\n• 342 new customers this month\n• 18% increase from last month\n• Customer acquisition cost: $45\n• Average lifetime value: $1,200\n\n📊 Growth Drivers:\n• Referral program success\n• Social media campaigns\n• Improved website conversion\n• Seasonal promotions\n\n🎯 Target Performance:\n• CAC is within target range\n• LTV:CAC ratio is healthy at 26:1\n• Retention rate improving";
    } else if (lowerMessage.includes('business') && lowerMessage.includes('performing')) {
      return "Your business is performing exceptionally well! Here's the comprehensive overview:\n\n📈 Overall Performance:\n• Revenue: +15% year-over-year\n• Customer satisfaction: 4.6/5\n• Retention rate: 78%\n• Market share: Growing steadily\n\n🚀 Key Growth Areas:\n• Online sales (+25% YoY)\n• Subscription services (+40% YoY)\n• Mobile app engagement (+60%)\n• Customer referrals (+35%)\n\n💡 Strategic Insights:\n• Strong product-market fit\n• Effective customer service\n• Successful digital transformation\n• Healthy financial position";
    } else {
      return "I understand you're asking about your business. To provide more specific and actionable insights, I'd need access to your actual business data. I can help you analyze:\n\n📊 Business Metrics:\n• Sales performance and trends\n• Customer behavior patterns\n• Financial analysis\n• Operational efficiency\n\n🎯 Strategic Areas:\n• Growth opportunities\n• Risk assessment\n• Competitive analysis\n• Process optimization\n\nWhat specific aspect of your business would you like me to focus on?";
    }
  };

  const handleSendMessage = async (customMessage?: string) => {
    const messageToSend = customMessage || message.trim();
    if (!messageToSend) return;

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
      setShowFeatures(false);
    }

    setIsLoading(true);

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

  const formatMessageContent = (content: string) => {
    // Convert markdown-like formatting to HTML
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('• ')) {
          return `<li class="ml-4 text-sm font-normal">${line.substring(2)}</li>`;
        } else if (line.startsWith('📊') || line.startsWith('💰') || line.startsWith('👥') || line.startsWith('📍') || line.startsWith('🏆') || line.startsWith('📈') || line.startsWith('🔍') || line.startsWith('💡') || line.startsWith('🎯') || line.startsWith('🚀')) {
          return `<div class="font-semibold text-sm mb-2">${line}</div>`;
        } else if (line.trim() === '') {
          return '<br>';
        } else {
          return `<p class="mb-2 text-sm font-normal">${line}</p>`;
        }
      })
      .join('');
  };

  return (
    <main className={`flex-1 transition-all duration-300 ease-in-out ai-services-main ${
      actualIsCollapsed ? 'main-content sidebar-collapsed' : 'main-content'
    }`}>
      {/* Mobile Menu Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <MobileMenuToggle />
      </div>

      {/* Main Content */}
              <div className="w-full max-w-full px-4 py-6 lg:px-8 lg:py-8 overflow-x-hidden h-screen ai-services-content lg:pr-[280px]">
        <div className="pt-12 lg:pt-0 h-full flex flex-col">
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col items-center justify-center max-w-7xl mx-auto w-full">
            {!currentSessionId || (currentSession && currentSession.messages.length === 0) ? (
              <>


                {/* AI Features Showcase */}
                {showFeatures && (
                  <div className="w-full max-w-6xl mb-8 px-4">
                    <h3 className="text-base font-semibold text-[#2a2a2f] mb-4 text-center">What can AI help you with?</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {aiFeatures.map((feature) => (
                        <div
                          key={feature.id}
                          className={`${feature.gradient} p-4 rounded-2xl text-gray-500 transform hover:scale-105 transition-all duration-300 cursor-pointer border border-gray-100`}
                          onClick={() => handleQuestionClick(`Tell me about ${feature.title.toLowerCase()}`)}
                        >
                          <div className="text-2xl mb-2">{feature.icon}</div>
                          <h4 className="font-semibold text-base mb-1">{feature.title}</h4>
                          <p className="text-xs opacity-90 leading-relaxed">{feature.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Separator */}
                <div className="w-full max-w-4xl px-4 mb-8">
                  <div className="h-px bg-gradient-to-r from-transparent via-[#6E4EFF]/20 via-[#8B6AFF]/20 to-transparent"></div>
                </div>

                {/* Enhanced Suggested Questions */}
                <div className="w-full max-w-5xl mb-8 px-4">
                  <h3 className="text-base font-semibold text-[#2a2a2f] mb-4 text-center">Popular questions to get started</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {suggestedQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuestionClick(question.text)}
                        className="group py-3 px-4 text-left bg-white border border-gray-100 rounded hover:border-[#6E4EFF] transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#6E4EFF]/50 focus:border-transparent"
                        aria-label={`Ask: ${question.text}`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex-1">
                            <p className="font-medium text-[#2a2a2f] text-sm leading-relaxed">
                              {question.text}
                            </p>
                          </div>
                          <div className="text-[#6E4EFF] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Modern Input Field */}
                <div className="w-full max-w-5xl px-4">
                  <div className="relative bg-gray-50 border border-gray-200 rounded p-4 transition-all duration-300 focus-within:border-[#6E4EFF]/30">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#6E4EFF] to-[#8B6AFF] rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <input
                          ref={inputRef}
                          type="text"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Ask me anything about your business..."
                          className="w-full bg-transparent text-[#2a2a2f] text-base placeholder-gray-400 focus:outline-none"
                          aria-label="Type your business question"
                        />
                      </div>
                      <div className="flex-shrink-0">
                        <button
                          onClick={() => handleSendMessage()}
                          disabled={!message.trim()}
                          className="w-10 h-10 bg-gradient-to-br from-[#6E4EFF] to-[#8B6AFF] text-white rounded-full flex items-center justify-center hover:from-[#5D3EE8] hover:to-[#7A59FF] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#6E4EFF]/50 transform hover:scale-105"
                          aria-label="Send message"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="rotate-45"
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
                  </div>
                  <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Press Enter to send
                    </span>
                    <span>•</span>
                    <span>AI responses are for demonstration purposes</span>
                  </div>
                </div>
              </>
            ) : (
              /* Enhanced Chat Interface */
              <div className="w-full max-w-6xl h-full flex flex-col px-4">

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto mb-6 space-y-6 px-2">
                  {currentSession?.messages.map((msg, index) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div
                        className={`max-w-[80%] p-4 rounded-lg ${
                          msg.isUser
                            ? 'bg-gray-100 text-gray-900'
                            : 'bg-white border border-[#e9e9e9] text-[#2a2a2f]'
                        }`}
                      >
                        {!msg.isUser && (
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-[#6E4EFF] to-[#8B6AFF] rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                              </svg>
                            </div>
                            <span className="text-xs font-normal text-[#6E4EFF]">AI Assistant</span>
                          </div>
                        )}
                        <div 
                          className={`text-sm leading-relaxed ${
                            !msg.isUser ? 'prose prose-sm max-w-none' : ''
                          }`}
                          dangerouslySetInnerHTML={{ __html: formatMessageContent(msg.content) }}
                        />
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start animate-in fade-in duration-300">
                      <div className="bg-white border border-gray-100 p-4 rounded">
                        <div className="flex items-center space-x-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-[#6E4EFF] rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-[#6E4EFF] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-[#6E4EFF] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-sm text-[#2a2a2f]">AI is analyzing your data...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Modern Input Field */}
                <div className="relative bg-gray-50 border border-gray-200 rounded p-4 transition-all duration-300 focus-within:border-[#6E4EFF]/30">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#6E4EFF] to-[#8B6AFF] rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <input
                        ref={inputRef}
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask a follow-up question..."
                        className="w-full bg-transparent text-[#2a2a2f] text-base placeholder-gray-400 focus:outline-none"
                        disabled={isLoading}
                        aria-label="Type your business question"
                      />
                    </div>
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => handleSendMessage()}
                        disabled={!message.trim() || isLoading}
                        className="w-10 h-10 bg-gradient-to-br from-[#6E4EFF] to-[#8B6AFF] text-white rounded-full flex items-center justify-center hover:from-[#5D3EE8] hover:to-[#7A59FF] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#6E4EFF]/50 transform hover:scale-105"
                        aria-label="Send message"
                      >
                        {isLoading ? (
                          <div className="flex space-x-1">
                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        ) : (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="rotate-45"
                          >
                            <path
                              d="M7 17L17 7M17 7H7M17 7V17"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

            {/* Redesigned Right Sidebar - Chat History */}
      <div className="hidden lg:block fixed right-0 top-0 h-full w-[280px] bg-white border-l border-gray-200 ai-services-sidebar">
        <div className="flex flex-col h-full">
          {/* Header with Search */}
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Chat History</h3>
              <button
                onClick={createNewChat}
                className="p-2 bg-[#6E4EFF] text-white rounded-lg hover:bg-[#5D3EE8] transition-colors duration-200"
                aria-label="New Chat"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search conversations..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6E4EFF]/50 focus:border-[#6E4EFF]"
              />
            </div>
          </div>

          {/* Chat History List */}
          <div className="flex-1 overflow-y-auto">
            {chatSessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#6E4EFF]/10 to-[#8B6AFF]/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-[#6E4EFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h4>
                <p className="text-sm text-gray-500 mb-4">Start your first conversation to see it here</p>
                <button
                  onClick={createNewChat}
                  className="px-4 py-2 bg-[#6E4EFF] text-white rounded-lg hover:bg-[#5D3EE8] transition-colors duration-200 text-sm font-medium"
                >
                  Start New Chat
                </button>
              </div>
            ) : (
              <div className="p-4 space-y-2">
                {chatSessions.map((session) => (
                  <div
                    key={session.id}
                                          className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
                        currentSessionId === session.id
                          ? 'bg-gradient-to-r from-[#6E4EFF]/5 to-[#8B6AFF]/5 border-[#6E4EFF]/20'
                          : 'bg-white border-gray-100 hover:bg-gray-50 hover:border-gray-200'
                      }`}
                    onClick={() => selectChatSession(session.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-2 h-2 rounded-full ${
                            currentSessionId === session.id ? 'bg-[#6E4EFF]' : 'bg-gray-300'
                          }`}></div>
                          <p className={`text-sm font-medium truncate ${
                            currentSessionId === session.id ? 'text-[#6E4EFF]' : 'text-gray-900'
                          }`}>
                            {session.title}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500">
                            {formatTimestamp(session.createdAt)}
                          </p>
                          <span className="text-xs text-gray-400">
                            {session.messages.length} messages
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => deleteChatSession(session.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 rounded-lg transition-all duration-200 ml-2"
                        aria-label={`Delete chat: ${session.title}`}
                      >
                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="border-t border-gray-100 bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <button
                onClick={clearAllConversations}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear All
              </button>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{chatSessions.length} conversations</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
