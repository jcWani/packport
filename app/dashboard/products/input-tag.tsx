"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction, useState } from "react";
import { useFormContext } from "react-hook-form";
import { AnimatePresence, motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { XIcon } from "lucide-react";

type InputTagProps = React.InputHTMLAttributes<HTMLInputElement> & {
  value: string[];
  onChange: Dispatch<SetStateAction<string[]>>;
};

export const InputTags = ({ onChange, value, ...props }: InputTagProps) => {
  const [pendingDataPoint, setPendingDataPoint] = useState("");
  const [focused, setFocused] = useState(false);

  function addPendingDataPoint() {
    if (pendingDataPoint) {
      const newDataPoints = new Set([...value, pendingDataPoint]);
      onChange(Array.from(newDataPoints));
      setPendingDataPoint("");
    }
  }

  const { setFocus } = useFormContext();

  return (
    <div
      onClick={() => setFocus("tags")}
      className={cn(
        "flex min-h-[20px] w-full rounded-md border border-input bg-background text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        focused
          ? "ring-offset-2 outline-none ring-ring ring-2"
          : "ring-offeset-0 outline-none ring-ring ring-0"
      )}
    >
      <motion.div className="rounded-md min-h-[2.5rem] p-2 flex gap-2 flex-wrap items-center">
        <AnimatePresence>
          {value.map((tag) => (
            <motion.div
              key={tag}
              animate={{ scale: 1 }}
              initial={{ scale: 0 }}
              exit={{ scale: 0 }}
            >
              <Badge variant={"secondary"}>{tag}</Badge>
              <button
                type="button"
                className="w-3 ml-2"
                onClick={() => onChange(value.filter((i) => i !== tag))}
              >
                <XIcon className="w-3" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        <div className="flex">
          <Input
            className="focus-visible:border-transparent border-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Add tags"
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                e.preventDefault();
                addPendingDataPoint();
              }
              if (
                e.key === "Backspace" &&
                !pendingDataPoint &&
                value.length > 0
              ) {
                e.preventDefault();
                const newValue = [...value];
                newValue.pop();
                onChange(newValue);
              }
            }}
            value={pendingDataPoint}
            onFocus={(e) => setFocused(true)}
            onBlurCapture={(e) => setFocused(false)}
            onChange={(e) => setPendingDataPoint(e.target.value)}
            {...props}
          />
        </div>
      </motion.div>
    </div>
  );
};
