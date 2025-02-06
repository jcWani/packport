import { db } from "@/server";
import { auth } from "@/server/auth";
import { orders } from "@/server/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import formatPrice from "@/lib/format-price";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDistance, formatDistanceStrict, subMinutes } from "date-fns";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Orders",
};

export default async function Page() {
  const user = await auth();

  if (!user) redirect("/dashboard/settings");

  const userOrders = await db.query.orders.findMany({
    where: eq(orders.userID, user.user.id),
    with: {
      orderProduct: {
        with: {
          product: true,
          productVariants: { with: { variantImages: true } },
          order: true,
        },
      },
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your orders</CardTitle>
        <CardDescription>Check the status of your orders</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>A list of your recent orders.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Order Number</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{formatPrice(order.total)}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      order.status === "succeeded"
                        ? "bg-green-700 hover:bg-green-800"
                        : "bg-yellow-700 hover:bg-yellow-800"
                    }
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs font-medium">
                  {formatDistanceStrict(
                    subMinutes(order.created!, 0),
                    new Date(),
                    {
                      addSuffix: true,
                    }
                  )}
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button variant={"ghost"}>
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="bottom" align="end">
                        <DropdownMenuItem>
                          <DialogTrigger asChild>
                            <Button className="w-full" variant={"ghost"}>
                              View Details
                            </Button>
                          </DialogTrigger>
                        </DropdownMenuItem>
                        {order.receiptURL ? (
                          <DropdownMenuItem>
                            <Button
                              className="w-full"
                              variant={"ghost"}
                              asChild
                            >
                              <Link href={order.receiptURL} target="_blank">
                                Download a receipt
                              </Link>
                            </Button>
                          </DropdownMenuItem>
                        ) : null}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <DialogContent className="rounded-md">
                      <DialogHeader>
                        <DialogTitle>Order Details #{order.id}</DialogTitle>
                        <DialogDescription>
                          Your order total is {formatPrice(order.total)}
                        </DialogDescription>
                        <Card className="overflow-auto p-2 flex flex-col gap-4">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Image</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>Color</TableHead>
                                <TableHead>Quantity</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {order.orderProduct.map(
                                ({ product, productVariants, quantity }) => (
                                  <TableRow key={productVariants.id}>
                                    <TableCell>
                                      <Image
                                        src={
                                          productVariants.variantImages[0].url
                                        }
                                        width={48}
                                        height={48}
                                        alt={product.title}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      {formatPrice(product.price * quantity)}
                                    </TableCell>
                                    <TableCell>
                                      {productVariants.productType}
                                    </TableCell>
                                    <TableCell>
                                      <div
                                        className="w-4 h-4 rounded-full"
                                        style={{
                                          background: productVariants.color,
                                        }}
                                      ></div>
                                    </TableCell>
                                    <TableCell className="text-medium">
                                      {quantity}
                                    </TableCell>
                                  </TableRow>
                                )
                              )}
                            </TableBody>
                          </Table>
                        </Card>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
