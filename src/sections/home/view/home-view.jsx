import Test from '../testpage';
import Whydoc from '../aboutUs';
import OurMission from '../ourMission';
import HomeHero from '../hero/home-hero';
import OurPartners from '../our-partners';
// ----------------------------------------------------------------------

export default function HomeView() {
  return (
    <>
      <HomeHero id="home" />
      <OurMission />
      <Test />
      <Whydoc />
      <OurPartners />
    </>
  );
}
