import { AlertCircleIcon } from "lucide-react";

export const FormError = ({ message }: { message?: string }) => {
  if (!message) return null;

  return (
    <div className="bg-destructive/25 text-secondary-foreground p-3 rounded-md flex text-xs font-medium my-4 gap-2">
      <AlertCircleIcon className="w-4 h-4" />
      <p>{message}</p>
    </div>
  );
};
