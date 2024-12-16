import React, { useState } from "react";
import { Line, Board } from "./style";
import Cell from "./components/cell";
import Piece, { IPieceCoordinate } from "./components/piece";
import background from "../../../assets/background-01.webp";
import { Box } from "@chakra-ui/react";
import BackgroundImage from "../../components/local/background-image";

const CELL_POSITIONS: IPieceCoordinate[][] = [
  [
    { x: 0, y: 0 },
    { x: 50, y: 0 },
    { x: 100, y: 0 },
  ],
  [
    { x: 0, y: 50 },
    { x: 50, y: 50 },
    { x: 100, y: 50 },
  ],
  [
    { x: 0, y: 100 },
    { x: 50, y: 100 },
    { x: 100, y: 100 },
  ],
];

interface IPieceCoodineteStates {
  [key: string]: IPieceCoordinate;
}

const FrikFrakPage = () => {
  const [pieceCoordinateStates, setPieceCoodinateStates] =
    useState<IPieceCoodineteStates>({});

  const updatePieceAtCoordinate = (pieceId: string, pos: IPieceCoordinate) => {
    setPieceCoodinateStates((prevItems) => ({
      ...prevItems,
      [pieceId]: { ...pos },
    }));
  };

  const handleOnCellDrop = (i: number, j: number, event: React.DragEvent) => {
    const data = event.dataTransfer.getData("application/json");
    const json = JSON.parse(data);

    if (!json && !json.from && !json.from.id) return;

    const target = CELL_POSITIONS[i][j];

    updatePieceAtCoordinate(json.from.id, {
      x: target.x * 3,
      y: target.y * 3,
    });
  };

  const handleOnCellClick = (i: number, j: number, event: React.MouseEvent) => {
    const target = CELL_POSITIONS[i][j];
    for (const id of ["u_Piece_0", "u_Piece_1", "u_Piece_2"]) {
      if (!(id in pieceCoordinateStates)) {
        updatePieceAtCoordinate(id, {
          x: target.x * 3,
          y: target.y * 3,
        });
        break;
      }
    }
  };

  return (
    <BackgroundImage image={background}>
      <Box paddingTop="200px">
        <Board>
          <Line style={{ transform: "rotate(45deg)", width: "150%" }} />
          <Line style={{ transform: "rotate(-45deg)", width: "150%" }} />
          <Line style={{ transform: "rotate(-90deg)", translate: "150px 0" }} />
          <Line style={{ transform: "rotate(-90deg)" }} />
          <Line
            style={{ transform: "rotate(-90deg)", translate: "-150px 0" }}
          />
          <Line style={{ translate: "0px -150px" }} />
          <Line />
          <Line style={{ translate: "0px 150px" }} />
          {CELL_POSITIONS.map((items, i) =>
            items.map((cell, j) => (
              <Cell
                key={`${i}-${j}`}
                x={cell.x}
                y={cell.y}
                onDropItem={(e) => handleOnCellDrop(i, j, e)}
                onClick={(e) => handleOnCellClick(i, j, e)}
              />
            ))
          )}
          {Object.entries(pieceCoordinateStates).map(
            ([pieceStateId, pieceStateValue]) => (
              <Piece
                id={pieceStateId}
                x={pieceStateValue.x}
                y={pieceStateValue.y}
                color="blue"
                draggable
              />
            )
          )}
        </Board>
      </Box>
    </BackgroundImage>
  );
};

export default FrikFrakPage;
