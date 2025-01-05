import { HStack, VStack, Heading, Input } from "@chakra-ui/react";
import { Button } from "../../components/chakra/button";
import { useNavigate } from "react-router-dom";
import BackgroundImageContainer from "../../components/local/background-image-container";
import background from "../../../assets/background-01.webp";
import { useRef } from "react";

const HomePage = () => {
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const handlePlayClick = () => {
    if (inputRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const playerId = (inputRef.current as any).value;
      navigate("/frik-frak/play", { state: { playerId } });
    }
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
        <Input ref={inputRef} placeholder="Player Id" />
      </VStack>
    </BackgroundImageContainer>
  );
};

export default HomePage;
