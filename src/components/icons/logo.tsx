import { SVGProps } from "react";
const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    width={14}
    height={14}
    stroke="#000"
    viewBox="0 0 14 14"
    {...props}
  >
    <path
      strokeWidth={0.88}
      d="M6.56 12.346V8.489M6.56 4.631V.774M.774 8.489h11.572M.774 4.631h11.572M2.06.774h9s1.286 0 1.286 1.286v9s0 1.286-1.286 1.286h-9s-1.286 0-1.286-1.286v-9S.774.774 2.06.774"
    />
  </svg>
);
export default Logo;
