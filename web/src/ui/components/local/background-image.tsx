import { Box } from "@chakra-ui/react";

interface IBackgroundImageProps {
  children?: React.ReactNode;
  image: string;
}

const BackgroundImage = (props: IBackgroundImageProps) => {
  return (
    <Box
      bgImage={`url('${props.image}')`}
      style={{
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      height="100vh"
    >
      {props.children}
    </Box>
  );
};

export default BackgroundImage;
