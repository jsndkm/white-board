import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { API } from "@/lib/endpoint";
import { Bot } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function AISuggestionBox() {
  const [messages, setMessages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [hasNew, setHasNew] = useState(false);
  const [showTip, setShowTip] = useState(false);

  useEffect(() => {
    let tipTimeout: ReturnType<typeof setTimeout> | null = null;

    if (hasNew && !isOpen) {
      tipTimeout = setTimeout(() => {
        setShowTip(true);
      }, 3000); // 3秒后显示气泡提示
    } else {
      setShowTip(false);
    }

    return () => {
      if (tipTimeout) clearTimeout(tipTimeout);
    };
  }, [hasNew, isOpen]);

  useEffect(() => {
    const eventSource = new EventSource(API.ai.advice);

    eventSource.onmessage = (event) => {
      const newMessage = event.data;
      setMessages((prev) => {
        const updated = [...prev, newMessage];
        return updated.slice(-20); // 只保留最后 20 条
      });

      if (!isOpen) {
        setHasNew(true); // 收起状态提示新消息
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE 连接出错:", err);
      eventSource.close();
      setIsLoading(false);
    };

    return () => {
      eventSource.close(); // 组件卸载时清理
    };
  }, [isOpen]);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) setHasNew(false);
  };

  return (
    <div className="relative">
      {/* 控制按钮 */}
      <Button
        variant="outline"
        size="icon"
        onClick={toggleOpen}
        className="relative"
      >
        {/* 气泡提示 */}
        {showTip && (
          <div className="bg-primary text-primary-foreground absolute right-0 bottom-[-40px] z-50 w-max rounded-lg px-3 py-1 text-sm shadow-md">
            有新的 AI 建议
            <div className="bg-primary absolute -top-1 right-4 h-2 w-2 rotate-45" />
          </div>
        )}
        <Bot className="h-5 w-5" />
        {hasNew && (
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
        )}
      </Button>

      {/* 建议框内容 */}
      {isOpen && (
        <div className="absolute right-0 z-50 mt-2">
          <AISuggestionBoxContent messages={messages} isLoading={isLoading} />
        </div>
      )}
    </div>
  );
}

function AISuggestionBoxContent({
  messages,
  isLoading,
}: {
  messages: string[];
  isLoading: boolean;
}) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <Card className="border-muted max-h-[400px] w-80 rounded-2xl bg-white shadow-lg dark:bg-zinc-900">
      <CardHeader>
        <CardTitle className="text-base">AI 建议</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="h-48 pr-2">
          <div className="space-y-2 text-sm">
            {messages.map((msg, idx) => (
              <p key={idx} className="text-muted-foreground">
                {msg}
              </p>
            ))}
            {isLoading && (
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            )}
            <div ref={bottomRef} />
            {/* 自动滚动锚点 */}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
