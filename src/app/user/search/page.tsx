"use client";
import SearchContent from "@/components/SearchContent";
import React, { Suspense } from "react";

function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}

export default page;
