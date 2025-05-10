import { AlertCircle } from "lucide-react";

export const FormError = ({ message }: { message?: string }) => {
  if (!message) return null;
  return (
    <div className="bg-destructive/30 text-secondary-foreground flex items-center font-medium gap-2 justify-center p-3 my-2 rounded-md">
      <AlertCircle className="w-4 h-4" />
      <p>{message}</p>
    </div>
  );
};
