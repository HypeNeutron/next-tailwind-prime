import { forwardRef } from "react";
import Link from "next/link";

function DropdownLink({ href, children, ...rest }, ref) {
  return (
    <Link href={href}>
      <a {...rest} ref={ref}>
        {children}
      </a>
    </Link>
  );
}

export default forwardRef(DropdownLink);
