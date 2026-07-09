"use client";
import CheckOutContent from "@/components/CheckOutContent";
import React, { Suspense } from "react";

const page = () => {
  <Suspense fallback={<div>Loading...</div>}>
    <CheckOutContent />
  </Suspense>;
};

export default page;
