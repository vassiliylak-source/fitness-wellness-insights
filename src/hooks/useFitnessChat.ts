import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const useFitnessChat = (fitnessContext: any) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async (userMessage: string) => {
    if (!userMessage.trim()) return;

    // Add user message to chat
    const newUserMessage: Message = { role: 'user', content: userMessage };
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('fitness-chat', {
        body: {
          messages: [...messages, newUserMessage],
          fitnessContext
        }
      });

      if (error) throw error;

      if (data.error) {
        if (data.error.includes("Rate limit")) {
          toast({
            title: "Too many requests",
            description: "Please wait a moment before trying again.",
            variant: "destructive"
          });
        } else if (data.error.includes("credits")) {
          toast({
            title: "Credits exhausted",
            description: "Please add credits to continue using AI chat.",
            variant: "destructive"
          });
        } else {
          throw new Error(data.error);
        }
        return;
      }

      // Add assistant response to chat
      const assistantMessage: Message = { role: 'assistant', content: data.reply };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Chat failed",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat
  };
};
