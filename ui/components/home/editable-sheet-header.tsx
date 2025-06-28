import { Input } from "@/components/ui/input";
import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useUpdateProjectMutation } from "@/hooks/api/use-update-project";
import { useState } from "react";

export function EditableSheetHeader({
  id,
  name,
  description,
}: {
  id: number | undefined;
  name: string;
  description: string;
}) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);

  const [title, setTitle] = useState(name);
  const [desc, setDesc] = useState(description);

  const update = useUpdateProjectMutation();

  const handleSave = () => {
    setIsEditingTitle(false);
    setIsEditingDesc(false);
    if (!id) return;
    update.mutate({ id, name: title, description: desc });
  };

  return (
    <SheetHeader className="group">
      <div
        className="group/title hover:bg-muted/30 relative h-[40px] cursor-pointer rounded px-2 py-1"
        onClick={() => setIsEditingTitle(true)}
      >
        {isEditingTitle ? (
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            autoFocus
            className="text-lg font-semibold"
          />
        ) : (
          <SheetTitle className="text-lg font-semibold">
            {title || "未命名项目"}
          </SheetTitle>
        )}
      </div>

      <div
        className="group/desc hover:bg-muted/30 relative h-[40px] cursor-pointer rounded px-2 py-1"
        onClick={() => setIsEditingDesc(true)}
      >
        {isEditingDesc ? (
          <Input
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            autoFocus
            className="text-muted-foreground text-sm"
          />
        ) : (
          <SheetDescription className="text-muted-foreground text-sm">
            {desc || "无描述"}
          </SheetDescription>
        )}
      </div>
    </SheetHeader>
  );
}
