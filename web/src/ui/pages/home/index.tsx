import { HStack, VStack, Heading } from "@chakra-ui/react";
import { Button } from "../../components/chakra/button";
import { useNavigate } from "react-router-dom";
import BackgroundImageContainer from "../../components/local/background-image-container";
import background from "../../../assets/background-01.webp";

const HomePage = () => {
  const navigate = useNavigate();

  const handlePlayClick = () => {
    navigate("/frik-frak/play");
  };

  const handleWatchClick = () => {
    navigate("/frik-frak/watch");
  };

  return (
    <BackgroundImageContainer image={background}>
      <VStack paddingTop={100}>
        <Heading size="7xl">Frik Frak Online</Heading>
        <HStack marginTop={10}>
          <Button size="2xl" onClick={handleWatchClick}>
            Assistir
          </Button>
          <Button size="2xl" onClick={handlePlayClick}>
            Jogar
          </Button>
        </HStack>
      </VStack>
    </BackgroundImageContainer>
  );
};

export default HomePage;
