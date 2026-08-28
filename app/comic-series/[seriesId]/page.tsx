import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { ComicIssuesInfoTableWrapper } from "@/app/components/ComicIssuesInfoTableWrapper";
import { ComicSeriesDetails } from "@/app/components/ComicSeriesDetails";

type PageProps = {
  params: Promise<{ seriesId: string }>;
};

export default async function ComicSeriesToIssuesPage({ params }: PageProps) {
  const { seriesId } = await params;

  return (
    <div className="container mx-auto p-2 font-(family-name:--font-geist-sans)">
      <Navbar />
      <ComicSeriesDetails seriesId={seriesId} />
      <ComicIssuesInfoTableWrapper seriesId={seriesId} />
      <Footer />
    </div>
  );
}
