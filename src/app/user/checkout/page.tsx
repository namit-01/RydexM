"use client";

import React, { Suspense } from "react";
import CheckOutContent from "@/components/CheckOutContent";

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckOutContent />
    </Suspense>
  );
};

export default Page;
