import { StyledContainer } from "./style";

interface IContainerProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  gap?: string;
}

export const Container = (props: IContainerProps) => {
  return (
    <StyledContainer style={props.style}>{props.children}</StyledContainer>
  );
};

export const Row = (props: IContainerProps) => {
  return (
    <StyledContainer
      style={{ ...props.style, flexDirection: "row", gap: props.gap }}
    >
      {props.children}
    </StyledContainer>
  );
};

export const Column = (props: IContainerProps) => {
  return (
    <StyledContainer
      style={{ ...props.style, flexDirection: "column", gap: props.gap }}
    >
      {props.children}
    </StyledContainer>
  );
};
