import { ModeToggle } from "@/components/common/mode-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AppHeader() {
  const { data: session } = useSession();
  const username = session?.user.username;
  const token = session?.accessToken;

  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  };

  const handleSignOut = async () => {
    await signOut({
      redirectTo: "/",
    });
  };

  return (
    <header className="bg-background sticky top-0 flex items-center gap-2 px-2 py-1.5 md:px-2">
      {/*<span className="pl-2 font-sans text-4xl leading-none font-medium italic">*/}
      {/*  White Board*/}
      {/*</span>*/}
      <Image
        src="/logo.png"
        alt="logo"
        width={200}
        height={200}
        className="object-cover"
      />
      <div className="order-4 hidden h-fit items-center gap-2 px-2 py-1.5 md:ml-auto md:flex md:h-[34px]">
        {token ? (
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarFallback>
                {username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h4 className="text-sm font-medium">{username}</h4>
          </div>
        ) : (
          <Button
            variant="secondary"
            className="cursor-pointer"
            onClick={handleLogin}
          >
            登录
          </Button>
        )}
        <ModeToggle />
        {token && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="cursor-pointer"
              onClick={handleSignOut}
            >
              <LogOut className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all" />
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
