import { PaymentMethod } from "@prisma/client";
import { prisma } from "../db";

export const createOrderByEmail = async ({
  emailId,
  items,
  TotalCost,
  paymentMethod,
}: {
  emailId: string;
  items: any;
  TotalCost: number;
  paymentMethod: PaymentMethod;
}) => {
  const order = await prisma.order.create({
    data: {
      ownerEmail: emailId,
      items: {
        create: items.map((item: any) => ({
          product: { connect: { id: item.product.id } },
          quantity: item.quantity,
        })),
      },
      totalPrice: TotalCost,
      deliveryStatus: "PENDING",
      paymentMethod,
    },
  });
  return order;
};

export const getAllOrdersByEmail = async (email: string) => {
  const orders = await prisma.order.findMany({
    where: {
      ownerEmail: email,
    },
    select: {
      items: {
        include: {
          product: true,
        },
      },
      id: true,
      totalPrice: true,
      deliveryStatus: true,
      paymentMethod: true,
      createdAt: true,
    },
  });
  return orders;
};
