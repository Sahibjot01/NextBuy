"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction, useState } from "react";
import { useFormContext } from "react-hook-form";
import { AnimatePresence, motion } from "motion/react";
import { XIcon } from "lucide-react";

type InputProps = React.RefAttributes<HTMLInputElement>;
type InputTagsProps = InputProps & {
  value: string[];
  onChange: Dispatch<SetStateAction<string[]>>;
};
export const InputTags = ({ onChange, value, ...props }: InputTagsProps) => {
  const [pendingDataPoint, setPendingDataPoint] = useState("");
  const [focused, setFocused] = useState(false);

  function addPendingDataPoint() {
    if (pendingDataPoint) {
      const newDataPoint = new Set([...value, pendingDataPoint]);
      onChange(Array.from(newDataPoint));
      setPendingDataPoint("");
    }
  }
  //to make focus on tags input field inside form
  const { setFocus } = useFormContext();

  return (
    <div
      onClick={() => setFocus("tags")}
      className={cn(
        " w-full rounded-lg border border-input bg-background  text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        focused
          ? "ring-offset-2 outline-none ring-ring ring-2"
          : "ring-offset-0 outline-none ring-ring ring-0"
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
              className="flex gap-2 items-center bg-primary text-secondary rounded-md px-2 py-1"
            >
              {tag}
              <button
                onClick={() => onChange(value.filter((value) => value !== tag))}
              >
                <XIcon className="w-3" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        <div className="flex">
          <Input
            placeholder="Add tags"
            className="h-7 font-sm border-transparent focus-visible:border-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addPendingDataPoint();
              }
              if (
                e.key === "Backspace" &&
                pendingDataPoint === "" &&
                value.length > 0
              ) {
                e.preventDefault();
                const newValue = [...value];
                newValue.pop();
                onChange(newValue);
              }
            }}
            value={pendingDataPoint}
            onFocus={() => setFocused(true)}
            onBlurCapture={() => setFocused(false)}
            onChange={(e) => setPendingDataPoint(e.target.value)}
            {...props}
          />
        </div>
      </motion.div>
    </div>
  );
};
