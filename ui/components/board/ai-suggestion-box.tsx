import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { API } from "@/lib/endpoint";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import { Bot } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function AISuggestionBox({
  excalidrawAPI,
}: {
  excalidrawAPI: ExcalidrawImperativeAPI | null;
}) {
  const [messages, setMessages] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hasNew, setHasNew] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const controllerRef = useRef<AbortController | null>(null);

  const sendRequest = async () => {
    if (!excalidrawAPI) return;

    const elements = excalidrawAPI.getSceneElementsIncludingDeleted();
    const payload = JSON.stringify({ elements });

    setIsLoading(true);
    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const res = await fetch(API.ai.advice, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: payload,
        signal: controller.signal,
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (reader) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");

        for (const line of lines) {
          if (line.startsWith("data:")) {
            const text = line.replace(/^data:\s*/, "");
            setMessages((prev) => [...prev, text].slice(-20));
            if (!isOpen) setHasNew(true);
          }
        }

        // 留下未完整解析的一行
        buffer = lines[lines.length - 1] ?? "";
      }
    } catch (err) {
      console.error("AI stream error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // 每 30 秒请求一次
  useEffect(() => {
    if (!excalidrawAPI) return;

    const interval = setInterval(sendRequest, 30000);
    return () => clearInterval(interval);
  }, [excalidrawAPI]);

  // 打开时触发一次
  useEffect(() => {
    if (isOpen) {
      sendRequest();
    }
  }, [isOpen]);

  // 气泡提示逻辑
  useEffect(() => {
    let tipTimeout: ReturnType<typeof setTimeout> | null = null;

    if (hasNew && !isOpen) {
      tipTimeout = setTimeout(() => setShowTip(true), 3000);
    } else {
      setShowTip(false);
    }

    return () => {
      if (tipTimeout) clearTimeout(tipTimeout);
    };
  }, [hasNew, isOpen]);

  const toggleOpen = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) setHasNew(false);
      return next;
    });
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        onClick={toggleOpen}
        className="relative"
      >
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
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
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
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
