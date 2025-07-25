import Heropage from "@/components/Heropage";
import Products from "@/components/Products";
import Footer from "@/components/Footer";
import { Faq } from "@/components/Faq";

export default function Home() {
  return (
    <section>
      <Heropage />
      <Products />
      <Faq />
      <Footer />
    </section>
  );
}
