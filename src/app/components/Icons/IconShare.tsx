import { createIcon } from "@consta/icons/Icon";
import { SVGProps } from "react";

const IconShareD = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.33337 10.0003V16.667C3.33337 17.109 3.50897 17.5329 3.82153 17.8455C4.13409 18.1581 4.55801 18.3337 5.00004 18.3337H15C15.4421 18.3337 15.866 18.1581 16.1786 17.8455C16.4911 17.5329 16.6667 17.109 16.6667 16.667V10.0003M13.3334 5.00033L10 1.66699M10 1.66699L6.66671 5.00033M10 1.66699L10 12.5003"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export const IconShare = createIcon({
  l: IconShareD,
  m: IconShareD,
  s: IconShareD,
  xs: IconShareD,
  name: "IconShare",
});
