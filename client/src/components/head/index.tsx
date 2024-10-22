"use client";

import React from "react";

import { mediaStyles } from "@/media";

function RootHead() {
  return (
    // eslint-disable-next-line @next/next/no-head-element
    <head>
      <style key="fresnel-css" dangerouslySetInnerHTML={{ __html: mediaStyles }} type="text/css" />
    </head>
  );
}

export default RootHead;
