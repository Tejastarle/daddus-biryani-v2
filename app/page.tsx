import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/home/Hero';
import TasteFirst from '@/components/home/TasteFirst';
import CityJourney from '@/components/home/CityJourney';
import BiryaniComparison from '@/components/home/BiryaniComparison';
import Biryanieering from '@/components/home/Biryanieering';
import EveryGrain from '@/components/home/EveryGrain';
import MenuHighlights from '@/components/home/MenuHighlights';
import Portions from '@/components/home/Portions';
import SalanCustomisation from '@/components/home/SalanCustomisation';
import PartyEstimator from '@/components/home/PartyEstimator';
import DiscoveryChallenge from '@/components/home/DiscoveryChallenge';
import FounderTeaser from '@/components/home/FounderTeaser';
import KitchenStrip from '@/components/home/KitchenStrip';
import StoriesTeaser from '@/components/home/StoriesTeaser';
import VisitUs from '@/components/home/VisitUs';
import FinalCta from '@/components/home/FinalCta';

/**
 * Homepage order follows the owner's approved flow:
 * curiosity -> the four traditions -> why they taste that way -> menu ->
 * what you get -> bulk -> the tasting -> who we are -> proof -> visit.
 *
 * The five senses sit inside TasteFirst, so the argument runs
 * "four senses set it up, your taste decides" -> taste before you choose.
 *
 * Customer reviews are deliberately absent until genuine ones are supplied
 * (see NEEDS_OWNER_INPUT in lib/brand.ts).
 */
export default function Home() {
  return (
    <main className="site min-h-screen">
      <Header transparent />
      <Hero />
      <TasteFirst />
      <CityJourney />
      <BiryaniComparison />
      <Biryanieering />
      <EveryGrain />
      <MenuHighlights />
      <Portions />
      <SalanCustomisation />
      <PartyEstimator />
      <DiscoveryChallenge />
      <FounderTeaser />
      <KitchenStrip />
      <StoriesTeaser />
      <VisitUs />
      <FinalCta />
      <Footer />
    </main>
  );
}
