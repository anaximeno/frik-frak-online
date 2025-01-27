import { Box } from "@chakra-ui/react";
import React from "react";

interface IBackgroundImageContainerProps {
  image: string;
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

const BackgroundImageContainer = (props: IBackgroundImageContainerProps) => {
  return (
    <Box
      bgImage={`url('${props.image}')`}
      style={{
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        ...props.style,
      }}
      height="100vh"
      onClick={props.onClick}
    >
      {props.children}
    </Box>
  );
};

export default BackgroundImageContainer;
