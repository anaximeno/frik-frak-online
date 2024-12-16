import { HStack, VStack, Heading } from "@chakra-ui/react";
import { Button } from "../../components/chakra/button";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handlePlayClick = () => {
    navigate("/frik-frak");
  };

  return (
    <VStack marginTop={100}>
      <Heading size="7xl">Frik Frak Online</Heading>
      <HStack marginTop={10}>
        <Button size="lg" onClick={(_) => handlePlayClick()}>
          Jogar
        </Button>
      </HStack>
    </VStack>
  );
};

export default HomePage;
