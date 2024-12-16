/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { Line, Board } from "./style";
import Cell from "./components/cell";
import Piece, { IPieceCoordinate } from "./components/piece";
import background from "../../../assets/background-02.webp";
import { Box } from "@chakra-ui/react";
import BackgroundImageContainer from "../../components/local/background-image-container";

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

  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);

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

  const handleOnCellClick = (i: number, j: number) => {
    const target = CELL_POSITIONS[i][j];

    if (selectedPieceId) {
      // TODO: check if this cell is a valid space for putting the selected piece
      updatePieceAtCoordinate(selectedPieceId, {
        x: target.x * 3,
        y: target.y * 3,
      });
      resetPieceSelection();
      return;
    }

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

  const resetPieceSelection = () => {
    if (selectedPieceId) setSelectedPieceId(null);
  };

  return (
    <BackgroundImageContainer
      image={background}
      onClick={(_) => resetPieceSelection()}
    >
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
                onClick={() => handleOnCellClick(i, j)}
              />
            ))
          )}
          {Object.entries(pieceCoordinateStates).map(
            ([pieceStateId, pieceStateValue]) => (
              <Piece
                id={pieceStateId}
                x={pieceStateValue.x}
                y={pieceStateValue.y}
                isSelected={selectedPieceId === pieceStateId}
                onClick={() => setSelectedPieceId(pieceStateId)}
                onDragStart={(_) => resetPieceSelection()}
                color="blue"
                draggable
              />
            )
          )}
        </Board>
      </Box>
    </BackgroundImageContainer>
  );
};

export default FrikFrakPage;
