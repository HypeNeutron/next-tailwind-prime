import { Menu, Transition } from "@headlessui/react";
import { useSession } from "next-auth/react";
import { useGlobalContext } from "../../../context/context";
import toastPop from "../../../utils/toastPop";
import DropdownLink from "./DropdownLink";

export default function DropdownMenu() {
  const { logoutSubmit } = useGlobalContext();
  const { data: session } = useSession();

  return (
    <Menu as="div" className="relative inline-block z-10 ">
      <Menu.Button className=" text-white font-medium hover:text-amber-400 border border-transparent p-2  ml-2 hover:border-white rounded">
        {session.user.name}
      </Menu.Button>
      <Transition
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-[0.4rem] w-56 origin-top-right  bg-[hsl(217,27%,22%)] shadow-lg rounded ">
          <Menu.Item>
            <DropdownLink className="dropdown-link" href="/profile">
              Profile
            </DropdownLink>
          </Menu.Item>
          <Menu.Item>
            <DropdownLink className="dropdown-link" href="/order-history">
              Order History
            </DropdownLink>
          </Menu.Item>
          <Menu.Item>
            <DropdownLink
              className="dropdown-link"
              href="#"
              onClick={() => {
                toastPop(
                  "promise",
                  "Logout",
                  logoutSubmit,
                  "top-right",
                  null,
                  null
                );
              }}
            >
              Logout
            </DropdownLink>
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
