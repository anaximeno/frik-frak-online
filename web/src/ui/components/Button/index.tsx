import { StyledButton } from "./style";

interface IButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  backgroundColor?: string;
  textColor?: string;
  height?: string;
  width?: string;
  style?: React.CSSProperties;
}

const Button = (props: IButtonProps) => {
  return (
    <StyledButton
      onClick={() => props.onClick?.()}
      style={props.style}
      height={props.height}
      width={props.width}
      backgroundColor={props.backgroundColor}
      textColor={props.textColor}
    >
      {props.children}
    </StyledButton>
  );
};

export default Button;
