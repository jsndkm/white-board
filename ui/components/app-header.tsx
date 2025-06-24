import { AvatarMenu } from "@/components/avatar-menu";
import { ModeToggle } from "@/components/mode-toggle";
import { Skeleton } from "@/components/ui/skeleton";

export default function AppHeader() {
  return (
    <header className="flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2">
      <Skeleton className="h-12 w-12 rounded" />
      <div className="hidden md:flex py-1.5 px-2 h-fit md:h-[34px] order-4 md:ml-auto gap-5 items-center">
        <AvatarMenu />
        <ModeToggle />
      </div>
    </header>
  );
}
