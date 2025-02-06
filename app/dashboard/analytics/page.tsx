import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/server";
import { orders } from "@/server/schema";
import { desc } from "drizzle-orm";
import Sales from "./sales";
import Earnings from "./earnings";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics",
};

export const revalidate = 0;

export default async function Analytics() {
  const totalOrders = await db.query.orders.findMany({
    orderBy: [desc(orders.id)],
    with: {
      user: true,
      orderProduct: {
        limit: 10,
        with: {
          product: true,
          productVariants: {
            with: { variantImages: true },
          },
        },
      },
    },
  });

  console.log(totalOrders);

  if (totalOrders.length === 0)
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Orders</CardTitle>
        </CardHeader>
      </Card>
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Analytics</CardTitle>
        <CardDescription>
          Check your sales, new customers and more
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col lg:flex-row gap-8">
        <Sales totalOrders={totalOrders} />
        <Earnings totalOrders={totalOrders} />
      </CardContent>
    </Card>
  );
}
