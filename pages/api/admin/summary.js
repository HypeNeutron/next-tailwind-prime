import { getSession } from "next-auth/react";
import Order from "../../../models/Order";
import dbConnect from "../../../utils/dbConnect";
import Product from "./../../../models/Product";
import User from "./../../../models/User";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session || (session && !session.user.isAdmin))
    return res.status(401).send("signIn required");

  await dbConnect();
  const ordersCount = await Order.estimatedDocumentCount();
  const productsCount = await Product.estimatedDocumentCount();
  const usersCount = await User.estimatedDocumentCount();

  const orderPriceGroup = await Order.aggregate([
    {
      $group: { _id: null, sales: { $sum: "$totalPrice" } },
    },
  ]);

  const salesData = await Order.aggregate([
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m", date: "$createdAt" },
        },
        totalSales: { $sum: "$totalPrice" },
      },
    },
  ]);

  const ordersPrice = orderPriceGroup.length > 0 ? orderPriceGroup[0].sales : 0;

  res.send({ ordersPrice, ordersCount, productsCount, usersCount, salesData });
}
