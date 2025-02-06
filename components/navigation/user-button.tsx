"use client";

import { Session } from "next-auth";
import { signOut } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Moon, Settings, Sun, TruckIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Switch } from "../ui/switch";
import { useRouter } from "next/navigation";

export const UserButton = ({ user }: Session) => {
  const { setTheme, theme } = useTheme();
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  function setSwitchState() {
    if (theme === "light") return setChecked(false);
    else if (theme === "dark") return setChecked(true);
    else if (theme === "system") return setChecked(false);
  }

  useEffect(() => {
    setSwitchState();
  }, []);

  if (!user) return null;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <Avatar>
          {user.image && (
            <AvatarImage
              src={user.image}
              alt={user.name!}
              className="object-cover aspect-square"
            />
          )}

          {!user.image && (
            <AvatarFallback className="bg-primary/10">
              <div className="font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            </AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64 p-6" align="end">
        <div className="mb-4 p-4 flex flex-col items-center rounded-lg bg-primary/10 gap-1">
          <Avatar>
            {user.image ? (
              <AvatarImage
                src={user.image}
                alt={user.name!}
                className="aspect-square object-cover"
              />
            ) : (
              <AvatarImage src={"/default-user.jpg"} alt={user.name!} />
            )}
          </Avatar>
          <p className="font-bold text-xs mt-1">{user.name}</p>
          <span className="text-xs font-medium text-secondary-foreground">
            {user.email}
          </span>
        </div>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => router.push("/dashboard/orders")}
          className="group py-2 font-medium cursor-pointer"
        >
          <TruckIcon className="group-hover:translate-x-[0.175rem] transition-all duration-300 ease-in-out" />
          My orders
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push("/dashboard/settings")}
          className="group py-2 font-medium cursor-pointer"
        >
          <Settings className="group-hover:rotate-180 transition-all duration-300 ease-in-out" />
          Settings
        </DropdownMenuItem>
        {theme && (
          <DropdownMenuItem className="py-2 font-medium">
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center group"
            >
              <div className="relative flex mr-2">
                <Sun className="group-hover:text-yellow-600 group-hover:rotate-180 transition-all duration-500 ease-in-out dark:scale-0 scale-100 absolute" />

                <Moon className="group-hover:text-blue-400 group-hover:rotate-180 transition-all duration-500 ease-in-out  dark:scale-100 scale-0" />
              </div>

              <p className="dark:text-blue-400 text-secondary-foreground/75  text-yellow-600">
                {theme[0].toUpperCase() + theme.slice(1)} mode
              </p>
              <Switch
                className="scale-75 ml-2"
                checked={checked}
                onCheckedChange={(e) => {
                  setChecked((prev) => !prev);

                  if (e) setTheme("dark");
                  if (!e) setTheme("light");
                }}
              />
            </div>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          className="group py-2 focus:bg-destructive/25 font-medium cursor-pointer"
          onClick={() => signOut()}
        >
          <LogOut className="group-hover:scale-90 transition-all duration-300 ease-in-out" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
