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

interface ISelectedPiece extends IPiecePosition {
  id: string;
}

const FrikFrakPage = () => {
  const [piecePositionStates, setPiecePositionStates] =
    useState<IPiecePositionStates>({});

  const [selectedPiece, setSelectedPiece] = useState<ISelectedPiece | null>(
    null
  );

  const updatePieceToPosition = (pieceId: string, pos: IPiecePosition) => {
    setPiecePositionStates((prevItems) => ({
      ...prevItems,
      [pieceId]: { ...pos },
    }));
  };

  const checkPieceMoveIsValid = (
    from: IPiecePosition,
    to: IPiecePosition
  ): boolean => {
    if (Math.abs(to.i - from.i) <= 1 && Math.abs(to.j - from.j) <= 1)
      return true;
    return false;
  };

  const handleOnCellDrop = (i: number, j: number, event: React.DragEvent) => {
    const data = event.dataTransfer.getData("application/json");
    const json = JSON.parse(data);

    if (!json && !json.from && !json.from.id) return;

    if (!checkPieceMoveIsValid(json.from, { i, j })) {
      // TODO: alert use this is not allowed?
      return;
    }

    updatePieceToPosition(json.from.id, {
      i,
      j,
    });
  };

  const handleOnCellClick = (i: number, j: number) => {
    if (selectedPiece) {
      if (!checkPieceMoveIsValid(selectedPiece, { i, j })) {
        // TODO: alert use this is not allowed?
        return;
      }

      updatePieceToPosition(selectedPiece.id, {
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
    if (selectedPiece) setSelectedPiece(null);
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
          {Object.entries(piecePositionStates).map(([id, value]) => {
            const coordinate = CELL_POSITIONS[value.i][value.j];
            return (
              <Piece
                id={id}
                x={coordinate.x * 3}
                y={coordinate.y * 3}
                isSelected={selectedPiece?.id === id}
                onClick={() => setSelectedPiece({ id, i: value.i, j: value.j })}
                onDragStart={(_) => resetPieceSelection()}
                i={value.i}
                j={value.j}
                color="blue"
                draggable
              />
            );
          })}
        </Board>
      </Box>
    </BackgroundImageContainer>
  );
};

export default FrikFrakPage;
