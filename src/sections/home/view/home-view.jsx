import Whydoc from '../about-us';
import OurMission from '../our-mission';
import HomeHero from '../hero/home-hero';
import OurPartners from '../our-partners';
import ExperienceChooser from '../experience-chooser';
// ----------------------------------------------------------------------

export default function HomeView() {
  return (
    <>
      <HomeHero id="home" />
      <ExperienceChooser />
      <OurMission />
      <Whydoc />
      <OurPartners />
    </>
  );
}
