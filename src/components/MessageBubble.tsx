
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const [rating, setRating] = useState<'like' | 'dislike' | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleRating = (type: 'like' | 'dislike') => {
    setRating(type);
    toast({
      title: type === 'like' ? "Thanks for the feedback!" : "Feedback received",
      description: type === 'like' 
        ? "We're glad you found this response helpful." 
        : "We'll use this to improve our responses.",
    });
    console.log(`Message ${message.id} rated as ${type}`);
  };

  useEffect(() => {
    if (!message.isUser && contentRef.current) {
      // Dynamically import and render KaTeX for AI messages
      import('katex').then((katex) => {
        const content = contentRef.current;
        if (!content) return;

        let html = message.content;
        
        // Replace display math ($$...$$)
        html = html.replace(/\$\$([\s\S]*?)\$\$/g, (match, math) => {
          try {
            return katex.default.renderToString(math, { displayMode: true });
          } catch (e) {
            console.error('KaTeX display math error:', e);
            return match;
          }
        });
        
        // Replace inline math ($...$)
        html = html.replace(/\$([^$\n]+?)\$/g, (match, math) => {
          try {
            return katex.default.renderToString(math, { displayMode: false });
          } catch (e) {
            console.error('KaTeX inline math error:', e);
            return match;
          }
        });
        
        // Convert newlines to <br> tags
        html = html.replace(/\n/g, '<br>');
        
        content.innerHTML = html;
      });
    }
  }, [message.content, message.isUser]);

  return (
    <div className={cn(
      "flex gap-3",
      message.isUser ? "justify-end" : "justify-start"
    )}>
      {!message.isUser && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-primary-foreground" />
        </div>
      )}
      
      <div className={cn(
        "max-w-[80%] space-y-2",
        message.isUser ? "order-1" : "order-2"
      )}>
        <div className={cn(
          "rounded-lg p-4",
          message.isUser 
            ? "bg-primary text-primary-foreground ml-auto" 
            : "bg-card border"
        )}>
          {message.isUser ? (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          ) : (
            <div 
              ref={contentRef}
              className="text-sm leading-relaxed prose prose-sm max-w-none prose-p:mb-2 prose-headings:mb-2 prose-headings:mt-4"
            >
              {message.content}
            </div>
          )}
          
          <div className="text-xs opacity-70 mt-2">
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>

        {/* Rating buttons for AI messages */}
        {!message.isUser && (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRating('like')}
              className={cn(
                "h-8 w-8 p-0",
                rating === 'like' && "bg-green-100 text-green-600 hover:bg-green-100"
              )}
            >
              <ThumbsUp className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRating('dislike')}
              className={cn(
                "h-8 w-8 p-0",
                rating === 'dislike' && "bg-red-100 text-red-600 hover:bg-red-100"
              )}
            >
              <ThumbsDown className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>

      {message.isUser && (
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-secondary-foreground" />
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
