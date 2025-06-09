
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Plus, MessageSquare, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

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

interface SidebarProps {
  isOpen: boolean;
  conversations: Conversation[];
  activeConversationId: string;
  onConversationSelect: (id: string) => void;
  onClose: () => void;
}

const Sidebar = ({ 
  isOpen, 
  conversations, 
  activeConversationId, 
  onConversationSelect,
  onClose 
}: SidebarProps) => {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed lg:relative inset-y-0 left-0 z-50 w-80 bg-card border-r transition-all duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full lg:-translate-x-full"
      )}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Conversations</h3>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm">
                <Plus className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Conversations List */}
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-2">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => onConversationSelect(conversation.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    activeConversationId === conversation.id 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-background"
                  )}
                >
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">
                        {conversation.title}
                      </h4>
                      <p className="text-xs opacity-70 truncate mt-1">
                        {conversation.summary}
                      </p>
                      <div className="flex items-center gap-1 mt-2 text-xs opacity-60">
                        <Clock className="w-3 h-3" />
                        {conversation.lastUpdated.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t">
            <div className="text-xs text-muted-foreground text-center">
              AI Chat Assistant
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
