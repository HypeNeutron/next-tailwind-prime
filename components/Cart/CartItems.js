import { useGlobalContext } from "../../context/context";
import Link from "next/link";
import Image from "next/image";
import { IoIosCloseCircleOutline } from "react-icons/io";

export default function CartItems({ cartItems }) {
  const { removeCartItem, updateCart } = useGlobalContext();

  return (
    <div className="overflow-x-auto md:col-span-3">
      <table className="min-w-full">
        <thead className="border-b">
          <tr>
            <th className="px-5 text-left ">Item</th>
            <th className="p-5  text-center">Quantity</th>
            <th className="p-5 text-right">Price</th>
            <th className="p-5">Action</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => {
            const { slug, image, name, price, quantity, stock } = item;

            return (
              <tr key={slug} className="border-b">
                <td>
                  <Link
                    href={`/product/${slug}`}
                    className="flex items-center "
                  >
                    <Image src={image} alt={name} width={50} height={50} />
                    &nbsp;
                    {name}
                  </Link>
                </td>
                <td className="p-5 px-1 text-center">
                  <select
                    value={quantity}
                    onChange={(e) =>
                      updateCart({ item, qty: Number(e.target.value) })
                    }
                  >
                    {[...Array(stock).keys()].map((n) => {
                      const num = n + 1;
                      return (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      );
                    })}
                  </select>
                </td>
                <td className="p-5 text-right">{price}</td>
                <td className="p-7 flex justify-center">
                  <button onClick={() => removeCartItem(slug)}>
                    <IoIosCloseCircleOutline size="1.4em"></IoIosCloseCircleOutline>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
