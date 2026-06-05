"use client";

import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Bot,
  User,
  Send,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { useFinance } from "@/lib/finance-context";
import { cn } from "@/lib/utils";

export function AIAssistant() {
  const { state, sendMessage } = useFinance();
  const { messages } = state;

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userInput = input;

    setInput("");
    setIsTyping(true);

    try {
      await sendMessage(userInput);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = [
    "📊 How am I spending this month?",
    "🎯 Am I on track with my goals?",
    "💰 Tips to save more money?",
    "📈 What's my biggest expense?",
  ];

  return (
    <div className="h-[calc(100vh-6rem)] animate-in fade-in duration-500">
      <Card className="h-full border-0 shadow-xl bg-background/80 backdrop-blur overflow-hidden flex flex-col">
        {/* Header */}
        <CardHeader className="border-b bg-gradient-to-r from-primary/10 to-primary/5">
          <CardTitle className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-primary flex items-center justify-center shadow-md">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>

            <div>
              <h2 className="text-xl font-bold">
                AI Finance Assistant
              </h2>

              <p className="text-sm text-muted-foreground font-normal">
                Get personalized financial advice instantly
              </p>
            </div>
          </CardTitle>
        </CardHeader>

        {/* Chat Area */}
        <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
      <ScrollArea className="flex-1 h-0">
  <div className="px-4 py-6">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300",
                    message.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  )}
                  style={{
                    animationDelay: `${index * 40}ms`,
                  }}
                >
                  {/* Assistant Avatar */}
                  {message.role === "assistant" && (
                    <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center shadow-md flex-shrink-0">
                      <Bot className="h-5 w-5 text-primary-foreground" />
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={cn(
                      "max-w-[82%] rounded-3xl px-5 py-4 text-sm leading-7 whitespace-pre-wrap shadow-sm",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted/70 border border-border rounded-bl-md"
                    )}
                  >
                    {message.content}
                  </div>

                  {/* User Avatar */}
                  {message.role === "user" && (
                    <div className="h-10 w-10 rounded-2xl bg-secondary flex items-center justify-center shadow-sm flex-shrink-0">
                      <User className="h-5 w-5 text-secondary-foreground" />
                    </div>
                  )}
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex gap-3 animate-in fade-in">
                  <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center shadow-md">
                    <Bot className="h-5 w-5 text-primary-foreground" />
                  </div>

                  <div className="bg-muted border border-border rounded-3xl rounded-bl-md px-5 py-4 shadow-sm">
                    <div className="flex gap-1 items-center">
                      <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" />
                      <span
                        className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <span
                        className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </div>
                </div>
              )}

           <div ref={scrollRef} />
  </div>
</ScrollArea>

          {/* Suggested Questions */}
          {messages.length <= 1 && (
            <div className="px-4 pb-3">
              <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                Suggested questions
              </div>

              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition-all"
                    onClick={() => {
                      setInput(question);
                      inputRef.current?.focus();
                    }}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t bg-background/80 backdrop-blur p-4">
            <div className="flex items-center gap-3">
              <Input
                ref={inputRef}
                placeholder="Ask about spending, savings, goals..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isTyping}
                className="h-12 rounded-2xl border-muted-foreground/20 focus-visible:ring-1 focus-visible:ring-primary"
              />

              <Button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                size="icon"
                className="h-12 w-12 rounded-2xl shadow-md"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}