import { Navbar } from "@/app/components/Navbar";
import { ComicCreatorsInfoTableWrapper } from "@/app/components/ComicCreatorsInfoTableWrapper";
import { Footer } from "@/app/components/Footer";

export default function ComicCreatorsPage() {
  return (
    <div className="container mx-auto p-2 font-(family-name:--font-geist-sans)">
      <Navbar />
      <ComicCreatorsInfoTableWrapper />
      <Footer />
    </div>
  );
}
