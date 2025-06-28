import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDeleteMemberMutation } from "@/hooks/use-delete-member";
import { Trash2 } from "lucide-react";

type Member = {
  username: string;
  avatarUrl?: string;
  admin: boolean;
};

interface MemberListProps {
  members: Member[];
  currentUser: string;
  isProjectOwner: boolean;
  projectId: number;
}

export function MemberList({
  members,
  currentUser,
  isProjectOwner,
  projectId,
}: MemberListProps) {
  const deleteMember = useDeleteMemberMutation();

  return (
    <div>
      成员列表
      <ScrollArea className="max-h-[300px]">
        <div className="mt-2 flex flex-col gap-3">
          {members.slice(0, 6).map((member, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-md border px-4 py-2"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={member.avatarUrl} />
                  <AvatarFallback>
                    {member.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="truncate text-sm font-medium">
                  {member.username}
                </div>
                <Badge variant="outline">
                  {member.admin ? "所有者" : "成员"}
                </Badge>
              </div>

              {isProjectOwner && member.username !== currentUser ? (
                <Button
                  size="icon"
                  variant="ghost"
                  className="cursor-pointer rounded-full text-sm font-medium"
                  onClick={() =>
                    deleteMember.mutate({
                      projectId,
                      username: member.username,
                    })
                  }
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              ) : (
                <div className="w-8" />
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
