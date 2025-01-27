import background from "../../../assets/background-01.webp";
import BackgroundImageContainer from "../../components/background-image-container";
import FrikFrakPlayView from "./views/play";
import FrikFrakGalleryView from "./views/gallery";
import BreadcrumbBox from "../../components/breadcrump-box";
import {
  BreadcrumbCurrentLink,
  BreadcrumbLink,
  BreadcrumbRoot,
} from "../../../components/ui/breadcrumb";

interface IFrikFrakPageProps {
  view: "play" | "gallery";
}

const FrikFrakPage: React.FC<IFrikFrakPageProps> = ({ view }) => {
  return (
    <BackgroundImageContainer image={background}>
      {view === "play" ? <FrikFrakPlayView /> : <FrikFrakGalleryView />}
      <BreadcrumbBox>
        <BreadcrumbRoot>
          <BreadcrumbLink href="/#">Página Principal</BreadcrumbLink>
          <BreadcrumbLink>Frik Frak</BreadcrumbLink>
          <BreadcrumbCurrentLink>
            {view === "play" ? "Jogar" : "Galeria"}
          </BreadcrumbCurrentLink>
        </BreadcrumbRoot>
      </BreadcrumbBox>
    </BackgroundImageContainer>
  );
};

export default FrikFrakPage;
