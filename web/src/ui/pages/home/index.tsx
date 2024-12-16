import { HStack, VStack, Heading } from "@chakra-ui/react";
import { Button } from "../../components/chakra/button";
import { useNavigate } from "react-router-dom";
import BackgroundImage from "../../components/local/background-image";
import background from "../../../assets/background-02.webp";

const HomePage = () => {
  const navigate = useNavigate();

  const handlePlayClick = () => {
    navigate("/frik-frak");
  };

  return (
    <BackgroundImage image={background}>
      <VStack paddingTop={100}>
        <Heading size="7xl">Frik Frak Online</Heading>
        <HStack marginTop={10}>
          <Button size="2xl" onClick={(_) => handlePlayClick()}>
            Jogar
          </Button>
        </HStack>
      </VStack>
    </BackgroundImage>
  );
};

export default HomePage;
