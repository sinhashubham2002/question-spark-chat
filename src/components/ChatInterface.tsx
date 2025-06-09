
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Menu, MessageSquare, ChevronLeft } from "lucide-react";
import Sidebar from "./Sidebar";
import MessageBubble from "./MessageBubble";
import { useIsMobile } from "@/hooks/use-mobile";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  summary: string;
  messages: Message[];
  lastUpdated: Date;
}

interface ChatInterfaceProps {
  initialQuestion: string;
}

const ChatInterface = ({ initialQuestion }: ChatInterfaceProps) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string>("1");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const currentConversation = conversations.find(c => c.id === activeConversationId);

  useEffect(() => {
    // Initialize with the first conversation containing the initial question
    const initialConversation: Conversation = {
      id: "1",
      title: initialQuestion.slice(0, 50) + (initialQuestion.length > 50 ? "..." : ""),
      summary: "New conversation about: " + initialQuestion.slice(0, 30) + "...",
      messages: [
        {
          id: "1",
          content: initialQuestion,
          isUser: true,
          timestamp: new Date()
        }
      ],
      lastUpdated: new Date()
    };

    setConversations([initialConversation]);
    
    // Simulate AI response with LaTeX
    setTimeout(() => {
      const aiResponse: Message = {
        id: "2",
        content: "I understand your question about: \"" + initialQuestion + "\". Let me help you with that.\n\nFor example, if you're asking about mathematics, here's the quadratic formula:\n\n$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$\n\nAnd here's an inline formula: $E = mc^2$\n\nThis is a comprehensive response that addresses your concerns and provides detailed information to help solve your doubt.",
        isUser: false,
        timestamp: new Date()
      };
      
      setConversations(prev => prev.map(conv => 
        conv.id === "1" 
          ? { ...conv, messages: [...conv.messages, aiResponse], lastUpdated: new Date() }
          : conv
      ));
    }, 1500);
  }, [initialQuestion]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentConversation?.messages]);

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    setIsLoading(true);
    
    const newMessage: Message = {
      id: Date.now().toString(),
      content: currentMessage,
      isUser: true,
      timestamp: new Date()
    };

    setConversations(prev => prev.map(conv => 
      conv.id === activeConversationId 
        ? { ...conv, messages: [...conv.messages, newMessage], lastUpdated: new Date() }
        : conv
    ));

    setCurrentMessage("");

    // Simulate AI response with LaTeX
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "Thank you for your follow-up question. Here's a detailed response that addresses your query with helpful information and guidance.\n\nHere's some mathematical notation: $$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$\n\nAnd some inline math: The value of $\\pi$ is approximately 3.14159.",
        isUser: false,
        timestamp: new Date()
      };
      
      setConversations(prev => prev.map(conv => 
        conv.id === activeConversationId 
          ? { ...conv, messages: [...conv.messages, aiResponse], lastUpdated: new Date() }
          : conv
      ));
      
      setIsLoading(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        isOpen={sidebarOpen}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onConversationSelect={setActiveConversationId}
        onClose={() => setSidebarOpen(false)}
      />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen && !isMobile ? 'ml-0' : ''}`}>
        {/* Header */}
        <header className="bg-card border-b px-4 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hover:bg-accent"
          >
            {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <div>
              <h2 className="font-semibold text-foreground">
                {currentConversation?.title || "New Conversation"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {currentConversation?.summary || "AI Assistant"}
              </p>
            </div>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {currentConversation?.messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-card border rounded-lg p-4 max-w-[80%]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t bg-card p-4">
          <div className="flex gap-2">
            <Input
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!currentMessage.trim() || isLoading}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
