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
  const logout = useUserStore((state) => state.logout);

  return (
    <HoverCard openDelay={0} closeDelay={0}>
      <HoverCardTrigger asChild>
        <div className="flex flex-row items-center gap-2 border p-1 rounded-2xl cursor-pointer">
          <Skeleton className="h-10 w-10 rounded-full" />
          <span>{username}</span>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-full p-0 m-0">
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
