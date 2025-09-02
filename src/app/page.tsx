import AboutUsSection from "@/components/AboutUsSection";
import FeaturedProperty from "@/components/FeaturedProperty";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import LuxuryDesignSection from "@/components/LuxuryDesignSection";
import PropertiesSection from "@/components/PropertiesSection";
import PropertyGrid from "@/components/PropertyGrid";
import TestimonialCard from "@/components/TestimonialCard";

export default function Home() {
  return (
    <div>
      <Hero />

      <PropertiesSection />
      <PropertyGrid />
      <TestimonialCard />
      <AboutUsSection />
      <LuxuryDesignSection />
      <FeaturedProperty />
      <Footer />
    </div>
  );
}
