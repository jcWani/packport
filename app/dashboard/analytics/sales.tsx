"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TotalOrders } from "@/lib/infer-type";
import Image from "next/image";
import placeholderUser from "@/public/default-user.jpg";
import formatPrice from "@/lib/format-price";

export default function Sales({ totalOrders }: { totalOrders: TotalOrders[] }) {
  // console.log(totalOrders);

  return (
    <Card className="flex-1 overflow-y-auto">
      <CardHeader>
        <CardTitle>New Sales</CardTitle>
        <CardDescription>Check your sales and orders</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Image</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {totalOrders.map(({ id, user, orderProduct }) =>
              orderProduct.map(
                ({ product, quantity, productVariants }, index) => (
                  <TableRow key={`${id}-${index}`} className="font-medium">
                    <TableCell>
                      {user.image && user.name ? (
                        <div className="flex items-center gap-2 w-32">
                          <Image
                            src={user.image}
                            width={25}
                            height={25}
                            alt={user.name}
                            className="rounded-full object-cover aspect-square"
                          />
                          <p className="text-xs font-medium">{user.name}</p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Image
                            src={placeholderUser}
                            width={25}
                            height={25}
                            alt="user not found"
                            className="rounded-full"
                          />
                          <p className="text-xs font-medium">User not found</p>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{product.title}</TableCell>
                    <TableCell>{formatPrice(product.price)}</TableCell>
                    <TableCell>{quantity}</TableCell>
                    <TableCell>
                      {productVariants?.variantImages?.[0]?.url ? (
                        <Image
                          className="rounded-sm aspect-square object-cover"
                          src={productVariants.variantImages[0].url}
                          width={48}
                          height={48}
                          alt={product.title}
                        />
                      ) : (
                        <p className="text-xs text-gray-500">No Image</p>
                      )}
                    </TableCell>
                  </TableRow>
                )
              )
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
