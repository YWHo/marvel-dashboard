import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { ComicIssueItemDetailsWrapper } from "@/app/components/ComicIssueItemDetailsWrapper";

type PageProps = {
  params: Promise<{ issueId: string }>;
};

export default async function ComicIssuesPage({ params }: PageProps) {
  const { issueId } = await params;
  
  return (
    <div className="container mx-auto p-2 font-(family-name:--font-geist-sans)">
      <Navbar />
      <ComicIssueItemDetailsWrapper issueId={issueId} />
      <Footer />
    </div>
  );
}
