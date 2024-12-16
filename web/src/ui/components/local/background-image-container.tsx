import { Box } from "@chakra-ui/react";

interface IBackgroundImageContainerProps {
  image: string;
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent) => void;
}

const BackgroundImageContainer = (props: IBackgroundImageContainerProps) => {
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

export default BackgroundImageContainer;
