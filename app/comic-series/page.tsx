import { Navbar } from "@/app/components/Navbar";
import { ComicSeriesInfoTableWrapper } from "@/app/components/ComicSeriesInfoTableWrapper";
import { Footer } from "@/app/components/Footer";

export default function ComicSeriesPage() {
  return (
    <div className="container mx-auto p-2 font-(family-name:--font-geist-sans)">
      <Navbar />
      <ComicSeriesInfoTableWrapper />
      <Footer />
    </div>
  );
}
