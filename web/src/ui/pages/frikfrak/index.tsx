/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { Line, Board } from "./style";
import Cell from "./components/cell";
import Piece, { IPieceCoordinate, IPiecePosition } from "./components/piece";
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

interface IPiecePositionStates {
  [key: string]: IPiecePosition;
}

const FrikFrakPage = () => {
  const [piecePositionStates, setPiecePositionStates] =
    useState<IPiecePositionStates>({});

  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);

  const updatePieceToPosition = (pieceId: string, pos: IPiecePosition) => {
    setPiecePositionStates((prevItems) => ({
      ...prevItems,
      [pieceId]: { ...pos },
    }));
  };

  const handleOnCellDrop = (i: number, j: number, event: React.DragEvent) => {
    const data = event.dataTransfer.getData("application/json");
    const json = JSON.parse(data);

    if (!json && !json.from && !json.from.id) return;

    updatePieceToPosition(json.from.id, {
      i,
      j,
    });
  };

  const handleOnCellClick = (i: number, j: number) => {
    if (selectedPieceId) {
      // TODO: check if this cell is a valid space for putting the selected piece
      updatePieceToPosition(selectedPieceId, {
        i,
        j,
      });
      resetPieceSelection();
      return;
    }

    for (const id of ["u_Piece_0", "u_Piece_1", "u_Piece_2"]) {
      if (!(id in piecePositionStates)) {
        updatePieceToPosition(id, {
          i,
          j,
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
          {Object.entries(piecePositionStates).map(
            ([pieceStateId, pieceStateValue]) => {
              const coordinate =
                CELL_POSITIONS[pieceStateValue.i][pieceStateValue.j];
              return (
                <Piece
                  id={pieceStateId}
                  x={coordinate.x * 3}
                  y={coordinate.y * 3}
                  isSelected={selectedPieceId === pieceStateId}
                  onClick={() => setSelectedPieceId(pieceStateId)}
                  onDragStart={(_) => resetPieceSelection()}
                  color="blue"
                  draggable
                />
              );
            }
          )}
        </Board>
      </Box>
    </BackgroundImageContainer>
  );
};

export default FrikFrakPage;
