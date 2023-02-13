import Link from "next/link";
import { FaShoppingCart } from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";
import { useSession } from "next-auth/react";
import { useGlobalContext } from "../../context/context";
import DropdownMenu from "./DropdownMenu/DropdownMenu";

export default function Nav() {
  const { status, data: session } = useSession();

  const {
    cart: { cartAmount },
  } = useGlobalContext();

  return (
    <header className="fixed top-0 w-full z-50">
      <nav className="flex bg-gradient-to-r from-[hsl(217,27%,24%)] to-[hsl(217,29%,18%)] h-[3.2rem] px-[1rem] items-center justify-between shadow-md">
        <Link href={`/`} className="text-[1.4rem] font-bold text-white ">
          Prime
        </Link>

        <div className="text-white flex">
          <Link
            href={`${session?.user ? "/cart" : "/login"}`}
            className="p-2 font-medium flex items-center w-[4.6rem] justify-between  hover:text-amber-400 relative mr-2 "
          >
            <FaShoppingCart size="1.4em" /> Cart
            {cartAmount > 0 && (
              <span className="absolute top-[-1px] right-[-10px] rounded-full bg-red-600 px-[.4rem] py-[.1rem] text-xs font-bold text-white">
                {cartAmount}
              </span>
            )}
          </Link>
          {status === "loading" ? (
            <p className="p-2 font-medium flex items-center w-[5.15rem] justify-between">
              Loading
            </p>
          ) : session?.user ? (
            <DropdownMenu />
          ) : (
            <Link
              href="/login"
              className="p-2 font-medium flex items-center w-[5.15rem] justify-between hover:text-amber-400 "
            >
              <FiLogIn size="1.4em" className="mt-[0.2rem]" />
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
