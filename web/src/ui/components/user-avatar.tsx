import { defineStyle } from "@chakra-ui/react";
import { Avatar } from "../../components/ui/avatar";
import React from "react";

export interface IUserAvatarProps {
  username: string;
  colorPalette:
    | "transparent"
    | "current"
    | "black"
    | "white"
    | "whiteAlpha"
    | "blackAlpha"
    | "gray"
    | "red"
    | "orange"
    | "yellow"
    | "green"
    | "teal"
    | "blue"
    | "cyan"
    | "purple"
    | "pink"
    | "bg"
    | "fg"
    | "border";
  onClick?: (event: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

const UserAvatar: React.FC<IUserAvatarProps> = (props: IUserAvatarProps) => {
  return (
    <Avatar
      style={props.style}
      name={props.username}
      colorPalette={props.colorPalette}
      onClick={props.onClick}
      css={ringCss}
    />
  );
};

const ringCss = defineStyle({
  outlineWidth: "2px",
  outlineColor: "colorPalette.500",
  outlineOffset: "2px",
  outlineStyle: "solid",
});

export default UserAvatar;
