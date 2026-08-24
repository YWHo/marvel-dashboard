import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { ComicIssuesInfoTableWrapper } from "@/app/components/ComicIssuesInfoTableWrapper";

export default function ComicIssuePage() {
  return (
    <div className="container mx-auto p-2 font-[family-name:var(--font-geist-sans)]">
            <Navbar />
            <ComicIssuesInfoTableWrapper />
            <div>Comic Issues </div>
            <Footer />
      <Footer />
    </div>
  );
}
