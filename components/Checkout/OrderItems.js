import Link from "next/link";
import Image from "next/image";

export default function OrderItems({ children, cartItems, cartTotal }) {
  return (
    <div className="card overflow-x-auto p-5">
      <h2 className="mb-2 text-lg font-medium">Order Items</h2>
      <table className="min-w-full mb-1">
        <thead className="border-b">
          <tr>
            <th className="px-5 text-left">Item</th>
            <th className="p-5 text-right">Quantity</th>
            <th className="p-5 text-right">Price</th>
            <th className="p-5 text-right">Subtitle</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => {
            const { _id, slug, image, name, quantity, price } = item;
            return (
              <tr key={_id} className="border-b">
                <td>
                  <Link href={`/product/${slug}`} className="flex items-center">
                    <Image src={image} width={50} height={50} alt={name} />
                    &nbsp; {name}
                  </Link>
                </td>
                <td className="p-5 text-right">{quantity}</td>
                <td className="p-5 text-right">{price}</td>
                <td className="p-5 text-right">${price * quantity}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-b">
            <th className="p-5 font-bold text-left" colSpan="2">
              Total
            </th>
            <td colSpan="2" className=" font-medium text-right p-5">
              ${cartTotal}
            </td>
          </tr>
        </tfoot>
      </table>
      {children}
    </div>
  );
}
