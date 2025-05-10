"use client";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { LogOut, Moon, Settings, Sun, TruckIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Switch } from "../ui/switch";
import { useRouter } from "next/navigation";

export default function UserButton({ user }: Session) {
  const { theme, setTheme } = useTheme();
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  function setSwitchState() {
    switch (theme) {
      case "dark":
        return setChecked(true);

      case "light":
        return setChecked(false);
      case "system":
        return setChecked(false);
    }
  }
  useEffect(() => {
    setSwitchState();
  }, []);
  if (!user) return null;
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <Avatar className="w-7 h-7">
          {user.image ? (
            <Image src={user.image} alt={user.name!} fill={true} />
          ) : (
            <AvatarFallback className="bg-primary/25">
              <div className="font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            </AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-6">
        <div className="flex flex-col items-center bg-primary/10 p-4 rounded-lg mb-4">
          {user.image && (
            <Image
              src={user.image}
              className="rounded-full"
              alt={user.name!}
              width={36}
              height={36}
            />
          )}
          <p className="font-bold text-xs">{user.name}</p>
          <span className="text-xs font-medium text-secondary-foreground">
            {user.email}
          </span>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push("/dashboard/orders")}
          className="group py-2 font-medium cursor-pointer "
        >
          <TruckIcon
            size={14}
            className="mr-3 group-hover:translate-x-1 transition-all duration-300 ease-in-out"
          />
          My Order
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push("/dashboard/settings")}
          className="group py-2 font-medium cursor-pointer "
        >
          <Settings
            size={14}
            className="mr-3 group-hover:rotate-180 transition-all duration-300 ease-in-out"
          />
          Settings
        </DropdownMenuItem>
        {theme && (
          <DropdownMenuItem className="py-2 font-medium cursor-pointer ">
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center group"
            >
              <div className="mr-5 relative flex">
                <Sun
                  size={14}
                  className=" group-hover:text-yellow-600 absolute dark:scale-0 dark:rotate-90 group-hover:rotate-180 transition-all duration-500 ease-in-out"
                />
                <Moon
                  size={14}
                  className=" group-hover:text-blue-400 scale-0 dark:scale-100 transition-all duration-500 ease-in-out"
                />
              </div>
              <p className="dark:text-blue-400 mr-1  text-yellow-600">
                {theme[0].toUpperCase() + theme?.slice(1)} Mode
              </p>
              <Switch
                className="scale-75 ml-2"
                checked={checked}
                onCheckedChange={(e) => {
                  setChecked((prev) => !prev);
                  if (e) setTheme("dark");
                  else setTheme("light");
                }}
              />
            </div>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={() => signOut()}
          className="group py-2 focus:bg-destructive/20 dark:focus:bg-destructive/50 font-medium cursor-pointer"
        >
          <LogOut
            size={14}
            className="mr-3 group-hover:scale-75 transition-all duration-300 ease-in-out"
          />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
