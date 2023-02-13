import { forwardRef } from "react";
import Link from "next/link";

function DropdownLink({ href, children, ...rest }, ref) {
  return (
    <Link href={href} {...rest} ref={ref}>
      {children}
    </Link>
  );
}

export default forwardRef(DropdownLink);
