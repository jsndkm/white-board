"use client";

import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useEffect, useState } from "react";

interface ConfirmDeleteButtonProps {
  onConfirmAction: () => void;
  className?: string;
  timeout?: number;
}

export function ConfirmDeleteButton({
  onConfirmAction,
  className,
  timeout = 10000,
}: ConfirmDeleteButtonProps) {
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!confirming) return;
    const timer = setTimeout(() => setConfirming(false), timeout);
    return () => clearTimeout(timer);
  }, [confirming, timeout]);

  const handleClick = () => {
    if (confirming) {
      onConfirmAction();
      setConfirming(false);
    } else {
      setConfirming(true);
    }
  };

  return (
    <Button
      variant={confirming ? "destructive" : "outline"}
      onClick={handleClick}
      className={className}
    >
      <Trash className="mr-2 h-4 w-4" />
      {confirming ? "删除" : "删除"}
    </Button>
  );
}
