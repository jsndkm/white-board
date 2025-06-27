import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export default function AppHeader() {
  const { data: session } = useSession();
  const username = session?.user.username;

  return (
    <header className="bg-background sticky top-0 flex items-center gap-2 px-2 py-1.5 md:px-2">
      <span className="pl-2 font-serif text-4xl leading-none font-medium italic">
        White Board
      </span>
      <div className="order-4 hidden h-fit items-center gap-2 px-2 py-1.5 md:ml-auto md:flex md:h-[34px]">
        <h4 className="text-sm leading-none font-medium">{username}</h4>
        <ModeToggle />
        <Button
          variant="outline"
          size="icon"
          className="cursor-pointer"
          onClick={() =>
            signOut({
              redirectTo: "/",
            })
          }
        >
          <LogOut className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all" />
        </Button>
      </div>
    </header>
  );
}
