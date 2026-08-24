import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";

type PageProps = {
  params: Promise<{ issueId: string }>;
};

export default async function ComicIssuesPage({ params }: PageProps) {
  const { issueId } = await params;
  
  return (
    <div className="container mx-auto p-2 font-[family-name:var(--font-geist-sans)]">
      <Navbar />
      <div className="py-5">Comic Issues with issueId {issueId}</div>
      <Footer />
    </div>
  );
}
