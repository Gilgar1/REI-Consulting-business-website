import { Page } from "../App";
import { HeroSlider } from "../components/home/HeroSlider";
import { WhoWeAre } from "../components/home/WhoWeAre";
import { ServicesOverview } from "../components/home/ServicesOverview";
import { WhyChooseUs } from "../components/home/WhyChooseUs";
import { FeaturedProperties } from "../components/home/FeaturedProperties";
import { MarketInsights } from "../components/home/MarketInsights";
import { FinalCTA } from "../components/home/FinalCTA";

interface HomePageProps {
  setCurrentPage: (page: Page) => void;
}

export function HomePage({ setCurrentPage }: HomePageProps) {
  return (
    <>
      <HeroSlider setCurrentPage={setCurrentPage} />
      <WhoWeAre />
      <ServicesOverview setCurrentPage={setCurrentPage} />
      <WhyChooseUs />
      <FeaturedProperties setCurrentPage={setCurrentPage} />
      <MarketInsights setCurrentPage={setCurrentPage} />
      <FinalCTA setCurrentPage={setCurrentPage} />
    </>
  );
}
