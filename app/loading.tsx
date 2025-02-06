import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  // You can add any UI insinde Loading, including Skeleton
  return (
    <div className="grid min-h-50vh items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}
