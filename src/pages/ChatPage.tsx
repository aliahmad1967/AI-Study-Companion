import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const newUserMessage: Message = { id: messages.length + 1, text: input, sender: 'user' };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput('');
    setLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        text: `أهلاً بك! لقد تلقيت رسالتك: "${input}". كيف يمكنني مساعدتك اليوم؟ (هذه رسالة تجريبية من الذكاء الاصطناعي)`,
        sender: 'ai',
      };
      setMessages((prev) => [...prev, aiResponse]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-3xl font-bold mb-6">مساعد الدردشة بالذكاء الاصطناعي</h1>
      <Card className="max-w-2xl mx-auto h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle>تحدث مع رفيقك الدراسي</CardTitle>
          <CardDescription>
            اطرح أسئلة حول موادك الدراسية واحصل على إجابات فورية.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden p-0">
          <ScrollArea className="h-full p-4">
            <div className="space-y-4">
              {messages.length === 0 && (
                <p className="text-muted-foreground text-center">ابدأ محادثة مع مساعدك الدراسي!</p>
              )}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="max-w-[70%] p-3 rounded-lg bg-muted text-muted-foreground animate-pulse">
                    جاري الكتابة...
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="p-4 border-t">
          <div className="flex w-full space-x-2">
            <Input
              placeholder="اكتب رسالتك..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={loading}
            />
            <Button onClick={handleSendMessage} disabled={loading}>
              <Send className="h-4 w-4" />
              <span className="sr-only">إرسال</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ChatPage;