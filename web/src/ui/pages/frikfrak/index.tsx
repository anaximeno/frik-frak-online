import background from "../../../assets/background-01.webp";
import BackgroundImageContainer from "../../components/background-image-container";
import FrikFrakPlayView from "./views/play";
import FrikFrakGalleryView from "./views/gallery";

interface IFrikFrakPageProps {
  view: "play" | "gallery";
}

const FrikFrakPage: React.FC<IFrikFrakPageProps> = ({ view }) => {
  return (
    <BackgroundImageContainer image={background}>
      {view === "play" ? <FrikFrakPlayView /> : <FrikFrakGalleryView />}
    </BackgroundImageContainer>
  );
};

export default FrikFrakPage;
