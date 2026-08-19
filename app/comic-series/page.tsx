import React from "react";
import { ComicSeriesInfoTableWrapper } from "@/app/components/ComicSeriesInfoTableWrapper";
import { Footer } from "@/app/components/Footer";

export default function ComicSeriesPage() {
  return (
    <div className="container mx-auto p-2 font-[family-name:var(--font-geist-sans)]">
      <ComicSeriesInfoTableWrapper />
      <Footer />
    </div>
  );
}
