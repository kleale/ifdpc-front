import { createIcon } from "@consta/icons/Icon";
import { SVGProps } from "react";

const IconArchiveD = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_2032_1727)">
      <path
        d="M17.5 6.66667V17.5H2.50004V6.66667M8.33337 10H11.6667M0.833374 2.5H19.1667V6.66667H0.833374V2.5Z"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_2032_1727">
        <rect
          width="20"
          height="20"
          fill="white" 
        />
      </clipPath>
    </defs>
  </svg>
);

export const IconArchive = createIcon({
  l: IconArchiveD,
  m: IconArchiveD,
  s: IconArchiveD,
  xs: IconArchiveD,
  name: "IconArchive",
});
