
import Brands from "./Brands";
import ImageTab from "./ImageTab";
import MenWomenSection from "./MenWomen";
import NewArrivalH from "./NewArrivalH";
import PersonalStyle from "./PersonalStyle";
import PolicySection from "./Policy";
import SaleTimer from "./SaleTimer";
import ScrollBar from "./ScrollBar";
import Slideshow from "./SlidShow";


export default function Home() {
  return (
    <>

      <SaleTimer />
      <ScrollBar />
      <Slideshow />
      <Brands />
      <ImageTab />
      <PersonalStyle />
      <NewArrivalH />
      <MenWomenSection />
      <PolicySection />

    </>
  )
}
