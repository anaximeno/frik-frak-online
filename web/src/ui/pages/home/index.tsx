import { HStack, VStack, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import BackgroundImageContainer from "../../components/background-image-container";
import background from "../../../assets/background-02.webp";
import { Button } from "../../../components/ui/button";
import { RiGalleryView2 } from "react-icons/ri";
import { LuPlay } from "react-icons/lu";

const HomePage = () => {
  const navigate = useNavigate();

  const handlePlayClick = () => {
    navigate("/frik-frak/play");
  };

  const handleGalleryClick = () => {
    navigate("/frik-frak/gallery");
  };

  return (
    <BackgroundImageContainer image={background}>
      <VStack paddingTop={100}>
        <Heading size="7xl">Frik Frak Online</Heading>
        <HStack marginTop={10}>
          <Button size="2xl" onClick={handleGalleryClick}>
            <RiGalleryView2 />
            Galeria
          </Button>
          <Button size="2xl" onClick={handlePlayClick}>
            <LuPlay />
            Jogar
          </Button>
        </HStack>
      </VStack>
    </BackgroundImageContainer>
  );
};

export default HomePage;
