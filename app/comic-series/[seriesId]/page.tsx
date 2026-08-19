import React from "react";

import { InfoTable } from "@/app/components/InfoTable";
import { Navbar } from "@/app/components/Navbar";
import { RowDisplayType } from "@/app/lib/type-definitions";
import { Footer } from "@/app/components/Footer";
import { HeroPotrait } from "@/app/components/HeroPotrait";
import { ComicIssuesInfoTableWrapper } from "@/app/components/ComicIssuesInfoTableWrapper";

type PageProps = {
  params: { seriesId: number; }
};

type Props = {
  params: { characterId: string };
};

export default function ComicIssuesPage({ params }: PageProps) {
  const { seriesId } = params;
  
  return (
    <div className="container mx-auto p-2 font-[family-name:var(--font-geist-sans)]">
      <Navbar />
      <ComicIssuesInfoTableWrapper seriesId={seriesId} />
      <Footer />
    </div>
  );
}
