import { getSession } from "next-auth/react";
import dbConnect from "../../../../utils/dbConnect";
import Product from "./../../../../models/Product";

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session || !session.user.isAdmin)
    return res.status(401).send("admin signIn required");

  await dbConnect();

  if (req.method === "POST") {
    await Product.create(req.body);
    res.send({ message: "product created" });
    return;
  }

  const products = await Product.find({});
  res.send(products);
}
