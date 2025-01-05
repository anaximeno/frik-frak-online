import background from "../../../assets/background-01.webp";
import BackgroundImageContainer from "../../components/background-image-container";
import FrikFrakPlayView from "./views/play";
import FrikFrakWatchView from "./views/watch";

interface IFrikFrakPageProps {
  view: "play" | "watch";
}

const FrikFrakPage: React.FC<IFrikFrakPageProps> = ({ view }) => {
  return (
    <BackgroundImageContainer image={background}>
      {view === "play" ? <FrikFrakPlayView /> : <FrikFrakWatchView />}
    </BackgroundImageContainer>
  );
};

export default FrikFrakPage;
