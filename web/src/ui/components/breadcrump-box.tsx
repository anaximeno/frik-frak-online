import { Box } from "@chakra-ui/react";
import React from "react";

export interface IBreadcrumbBox {
  children: React.ReactNode;
}

const BreadcrumbBox: React.FC<IBreadcrumbBox> = (props) => {
  return (
    <Box
      position="absolute"
      bottom="10px"
      left="25px"
      background="Background"
      padding={1}
      borderRadius={4}
      shadow="xs"
    >
      {props.children}
    </Box>
  );
};

export default BreadcrumbBox;
