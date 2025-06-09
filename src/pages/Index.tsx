
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import ChatInterface from "@/components/ChatInterface";

const Index = () => {
  const [question, setQuestion] = useState("");
  const [showChat, setShowChat] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      console.log("Question submitted:", question);
      setShowChat(true);
    }
  };

  if (showChat) {
    return <ChatInterface initialQuestion={question} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Question Spark Chat
          </h1>
          <p className="text-lg text-muted-foreground">
            Ask your question and get instant help from our AI assistant
          </p>
        </div>
        
        <div className="bg-card rounded-2xl shadow-xl border p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="question" className="block text-sm font-medium text-foreground mb-2">
                What would you like to know?
              </label>
              <Textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Type your question here..."
                className="min-h-[120px] resize-none text-base"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              size="lg" 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={!question.trim()}
            >
              <Send className="w-5 h-5 mr-2" />
              Start Conversation
            </Button>
          </form>
        </div>
        
        <div className="text-center mt-6 text-sm text-muted-foreground">
          Powered by AI • Get instant answers to your questions
        </div>
      </div>
    </div>
  );
};

export default Index;
