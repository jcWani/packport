"use client";

import { VariantsWithImagesTags } from "@/lib/infer-type";
import React, { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { VariantSchema } from "@/types/VariantSchema";

import { Button, buttonVariants } from "@/components/ui/button";
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
import { InputTags } from "./input-tag";
import VariantImages from "./variant-images";
import { useAction } from "next-safe-action/hooks";
import { createVariant } from "@/server/actions/create-variant";
import { toast } from "sonner";
import { deleteVariant } from "@/server/actions/delete-variant";
import { Trash2 } from "lucide-react";

export default function ProductVariant({
  editMode,
  productID,
  variant,
  children,
}: {
  children: React.ReactNode;
  editMode: boolean;
  productID?: number;
  variant?: VariantsWithImagesTags;
}) {
  const form = useForm<z.infer<typeof VariantSchema>>({
    resolver: zodResolver(VariantSchema),
    defaultValues: {
      tags: [],
      variantImages: [],
      color: "#000000",
      editMode,
      id: undefined,
      productID,
      productType: "Black bag",
    },
  });

  const [open, setOpen] = useState(false);

  const setEdit = () => {
    if (!editMode) {
      form.reset({
        tags: [],
        variantImages: [],
        color: "#000000",
        editMode: false,
        productID,
        productType: "",
      });
      return;
    }
    if (editMode && variant) {
      form.setValue("editMode", true);
      form.setValue("id", variant.id);
      form.setValue("productID", variant.productID);
      form.setValue("productType", variant.productType);
      form.setValue("color", variant.color);
      form.setValue(
        "tags",
        variant.variantTags.map((tag) => tag.tag)
      );
      form.setValue(
        "variantImages",
        variant.variantImages.map((img) => ({
          name: img.name,
          size: img.size,
          url: img.url,
        }))
      );
    }
  };

  useEffect(() => {
    if (open) {
      setEdit();
    }
  }, [open]);

  const { execute, status } = useAction(createVariant, {
    onExecute: () => {
      toast.loading(
        `${editMode ? "Updating" : "Creating"} product variant...`,
        {
          id: "update-product",
        }
      );
    },
    onSuccess(data) {
      if (data.data) {
        toast.dismiss("update-product");
        if (data.data.success) {
          toast.success(data.data.success);
          setOpen(false);
        } else if (data.data.error) toast.error(data.data.error);
      }
    },
  });

  const variantAction = useAction(deleteVariant, {
    onExecute: () => {
      toast.loading("Deleting product variant...", { id: "delete-variant" });
    },
    onSuccess(data) {
      if (data.data) {
        toast.dismiss("delete-variant");
        if (data.data.success) toast.success(data.data.success);
        else if (data.data.error) toast.error(data.data.error);
      }
    },
  });

  function onSubmit(values: z.infer<typeof VariantSchema>) {
    execute(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="lg:max-w-screen-lg overflow-y-scroll max-h-[860px] rounded-md">
        <DialogHeader>
          <DialogTitle>{editMode ? "Edit" : "Create"} your variant</DialogTitle>
          <DialogDescription>
            Manage your product variant here. You can add tags, images and more
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="productType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Pick a title for your variant"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant Color</FormLabel>
                  <FormControl>
                    <Input type="color" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant Tags</FormLabel>
                  <FormControl>
                    <InputTags {...field} onChange={(e) => field.onChange(e)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <VariantImages />
            <div className="flex gap-4 items-center justify-center">
              {editMode && variant && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      disabled={variantAction.status === "executing"}
                    >
                      <Trash2 />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this variant?</AlertDialogTitle>
                    </AlertDialogHeader>
                    <p>Do you really want to delete this variant?</p>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className={buttonVariants({ variant: "destructive" })}
                        onClick={(e) => {
                          e.preventDefault();
                          variantAction.execute({ id: variant.id });
                        }}
                      >
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              <Button
                disabled={
                  status === "executing" ||
                  !form.formState.isValid ||
                  !form.formState.isDirty
                }
                type="submit"
              >
                {editMode ? "Update Variant" : "Create Variant"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
