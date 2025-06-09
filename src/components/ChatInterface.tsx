
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
    
    // Simulate AI response with comprehensive LaTeX examples
    setTimeout(() => {
      const aiResponse: Message = {
        id: "2",
        content: "Here's a step-by-step example of finding the derivative of a power function:\n\nLet's say we have \\(y = (3x + 2)^4\\). Here, \\(a = 3\\), \\(b = 2\\), and \\(m = 4\\). To find the first derivative, \\(y'\\), we use the formula \\(y' = m \\cdot a \\cdot (ax + b)^{m-1}\\).\n\n1. Substitute the values: \\(y' = 4 \\cdot 3 \\cdot (3x + 2)^{4-1}\\).\n2. Simplify: \\(y' = 12(3x + 2)^3\\).\n\nSo, the first derivative of \\(y = (3x + 2)^4\\) is:\n```latex\n\\boxed{y' = 12(3x + 2)^3}\n```\n\nHere are more examples with different notation styles:\n- Inline math: $E = mc^2$\n- Display math: $$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$\n- Parentheses notation: \\(\\frac{d}{dx}[x^n] = nx^{n-1}\\)",
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
        content: "Thank you for your follow-up question. Here's a detailed response with mathematical notation:\n\nFor the general power rule: \\(\\frac{d}{dx}[x^n] = nx^{n-1}\\)\n\nExample with chain rule:\n```latex\n\\frac{d}{dx}[(2x+1)^3] = 3(2x+1)^2 \\cdot 2 = 6(2x+1)^2\n```\n\nThis demonstrates the combination of power rule and chain rule in calculus.",
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
