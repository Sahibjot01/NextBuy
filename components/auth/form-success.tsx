import { CheckCircle2 } from "lucide-react";

export const FormSuccess = ({ message }: { message?: string }) => {
  if (!message) return null;
  return (
    <div className="bg-teal-400/27 flex items-center text-sm font-medium gap-2 justify-center text-secondary-foreground p-3 my-2 rounded-md">
      <CheckCircle2 className="w-4 h-4" />
      <p>{message}</p>
    </div>
  );
};
