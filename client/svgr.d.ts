declare module "*.svg" {
  import React from "react";
  import { SVGProps } from "react";
  const content: React.ForwardRefExoticComponent<SVGProps<SVGSVGElement>>;
  export default content;
}

declare module "*.svg?url" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content: any;
  export default content;
}
