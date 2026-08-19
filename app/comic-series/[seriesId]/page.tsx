import React from "react";

import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { ComicIssuesInfoTableWrapper } from "@/app/components/ComicIssuesInfoTableWrapper";

type PageProps = {
  params: Promise<{ seriesId: string }>;
};

export default async function ComicIssuesPage({ params }: PageProps) {
  const { seriesId } = await params;
  
  return (
    <div className="container mx-auto p-2 font-[family-name:var(--font-geist-sans)]">
      <Navbar />
      <ComicIssuesInfoTableWrapper seriesId={seriesId} />
      <Footer />
    </div>
  );
}
