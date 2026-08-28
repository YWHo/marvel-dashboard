import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { ComicIssuesInfoTableWrapper } from "@/app/components/ComicIssuesInfoTableWrapper";
import { ComicCreatorDetails } from "@/app/components/ComicCreatorDetails";

type PageProps = {
  params: Promise<{ creatorId: string }>;
};

export default async function ComicCreatorsToIssuPage({ params }: PageProps) {
  const { creatorId } = await params;

  return (
    <div className="container mx-auto p-2 font-(family-name:--font-geist-sans)">
      <Navbar />
      <ComicCreatorDetails creatorId={creatorId} />
      <ComicIssuesInfoTableWrapper creatorId={creatorId} />
      <Footer />
    </div>
  );
}
