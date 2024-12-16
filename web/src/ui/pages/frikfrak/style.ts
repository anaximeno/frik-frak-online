import styled from "styled-components";

interface ICoordinatableComponentProps {
  x: number;
  y: number;
}

export const Board = styled.div`
  position: relative;
  width: 300px;
  height: 300px;
  margin: 20px auto;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 50px;
`;

export const Line = styled.div`
  position: absolute;
  width: 100%;
  height: 4px;
  background-color: #373531;
  transform-origin: center;
`;

export const StyledCell = styled.div<
  ICoordinatableComponentProps & { isOver: boolean }
>`
  position: absolute;
  left: ${(props) => props.x}%;
  top: ${(props) => props.y}%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  background-color: #FFFFFF;
  user-select: none;
  transform: translate(-50%, -50%);
`;

export const DraggablePiece = styled.div<
  ICoordinatableComponentProps & { isDragging: boolean }
>`
  position: absolute;
  left: ${(props) => props.x}px;
  top: ${(props) => props.y}px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${(props) => props.color ?? "red"};
  cursor: grab;
  user-select: none;
  transform: translate(-50%, -50%);
`;
