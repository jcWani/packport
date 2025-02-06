"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import { ReviewSchema } from "@/types/review-schema";
import { Textarea } from "../ui/textarea";
import { motion } from "motion/react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAction } from "next-safe-action/hooks";
import { addReview } from "@/server/actions/add-review";
import { toast } from "sonner";

export default function ReviewForm() {
  const params = useSearchParams();
  const productID = Number(params.get("productID"));

  const form = useForm<z.infer<typeof ReviewSchema>>({
    resolver: zodResolver(ReviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
      productID,
    },
  });

  const { execute, status } = useAction(addReview, {
    onSuccess(data) {
      if (data.data?.error) toast.error(data.data?.error);
      if (data?.data?.success) {
        toast.success("Review added");
        form.reset();
      }
    },
  });

  function onSubmit(values: z.infer<typeof ReviewSchema>) {
    execute({
      comment: values.comment,
      rating: values.rating,
      productID,
    });
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="w-full">
          <Button className="font-medium w-full" variant={"secondary"}>
            Leave a review
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave your Review</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="How would you describe this product"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave your Rating</FormLabel>
                  <FormControl>
                    <Input type="hidden" placeholder="Star Rating" {...field} />
                  </FormControl>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((value) => {
                      return (
                        <motion.div
                          key={value}
                          className="relative cursor-pointer"
                          whileTap={{ scale: 0.8 }}
                          whileHover={{ scale: 1.2 }}
                        >
                          <Star
                            key={value}
                            className={cn(
                              "text-primary bg-transparent transition-all duration-300 ease-in-out",
                              form.getValues("rating") >= value
                                ? "fill-primary"
                                : "fill-muted"
                            )}
                            onClick={() => {
                              form.setValue("rating", value);
                            }}
                          />
                        </motion.div>
                      );
                    })}
                  </div>
                </FormItem>
              )}
            />
            <Button
              className="w-full"
              type="submit"
              disabled={status === "executing"}
            >
              {status === "executing" ? "Adding Review..." : "Add Review"}
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
