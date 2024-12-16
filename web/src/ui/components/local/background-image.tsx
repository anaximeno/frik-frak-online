import { Box } from "@chakra-ui/react";

interface IBackgroundImageProps {
  image: string;
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent) => void;
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
      onClick={props.onClick}
    >
      {props.children}
    </Box>
  );
};

export default BackgroundImage;
