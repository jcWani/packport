import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="grid min-h-50vh items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}
