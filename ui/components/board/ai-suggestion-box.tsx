import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

export function AISuggestionBox() {
  const [messages, setMessages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const chunks = [
      "正在分析画布内容...",
      "建议使用更清晰的图标。",
      "也许可以添加一些箭头或说明文字。",
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < chunks.length) {
        setMessages((prev) => [...prev, chunks[i++]]);
      } else {
        clearInterval(interval);
        setIsLoading(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
