import styled from "styled-components";

interface IStyledButtonProps {
  width?: string;
  height?: string;
  textColor?: string;
  backgroundColor?: string;
}

export const StyledButton = styled.button<IStyledButtonProps>`
  background-color: ${(props) => props.backgroundColor};
  color: ${(props) => props.textColor};
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  border-radius: 8px;
  border-color: grey;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    border-color: transparent;
    opacity: 0.85;
  }
`;
