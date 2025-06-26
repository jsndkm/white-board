import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserStore } from "@/stores/user";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function AvatarMenu() {
  const router = useRouter();
  const username = useUserStore((state) => state.username);
  const logout = useUserStore((state) => state.logoutAction);

  return (
    <HoverCard openDelay={0} closeDelay={0}>
      <HoverCardTrigger asChild>
        <div className="flex cursor-pointer flex-row items-center gap-2 rounded-2xl border p-1">
          <Skeleton className="h-10 w-10 rounded-full" />
          <span>{username}</span>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="m-0 w-full p-0">
        <Button
          variant="outline"
          className="cursor-pointer"
          onClick={async () => {
            await logout();
            router.replace("/login");
          }}
        >
          <LogOut />
          退出登录
        </Button>
      </HoverCardContent>
    </HoverCard>
  );
}
