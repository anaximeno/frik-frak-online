import styled from "styled-components";

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

export const Cell = styled.div<{ x: number; y: number }>`
  position: absolute;
  left: ${(props) => props.x}%;
  top: ${(props) => props.y}%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  border-radius: 50%;
  cursor: grab;
  background-color: red;
  user-select: none;
  transition: background-color 0.2s;
    transform: translate(-50%, -50%);

    &:hover {
        background-color: #f0f0f0;
    }

    &:active{
        background-color: #e0e0e0;
    }

`;
