/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { Line, Board } from "./style";
import Cell from "./components/cell";
import Piece, { IPieceCoordinate, IPiecePosition } from "./components/piece";
import background from "../../../assets/background-02.webp";
import BackgroundImageContainer from "../../components/local/background-image-container";
import useWebSocket from "../../../hooks/useWebSocket";

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

  const { lastSocketMessage, sendSocketMessage } = useWebSocket(
    "ws://127.0.0.1:8000/ws/game/play/"
  );

  const updatePieceStateToPos = (pieceId: string, pos: IPiecePosition) => {
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

  const handleOnCellDrop = (event: React.DragEvent, i: number, j: number) => {
    const data = event.dataTransfer.getData("application/json");
    const json = JSON.parse(data);

    if (!json && !json.from && !json.from.id) return;

    if (!checkPieceMoveIsValid(json.from, { i, j })) {
      // TODO: alert use this is not allowed?
      return;
    }

    // NOTE: Update localy first, then wait for message from socket
    // validating the correct position:
    updatePieceStateToPos(json.from.id, {
      i,
      j,
    });

    movePieceToPos({ to: { i, j }, from: { i: json.from.i, j: json.from.j } });
  };

  const handleOnCellClick = (i: number, j: number) => {
    if (selectedPiece) {
      if (!checkPieceMoveIsValid(selectedPiece, { i, j })) {
        // TODO: alert use this is not allowed?
        return;
      }

      // NOTE: Update localy first, then wait for message from socket
      // validating the correct position:
      updatePieceStateToPos(selectedPiece.id, {
        i,
        j,
      });

      movePieceToPos({ to: { i, j }, from: selectedPiece });

      resetPieceSelection();
      return;
    }
  };

  const movePieceToPos = (params: {
    from?: IPiecePosition;
    to: IPiecePosition;
  }) => {
    sendSocketMessage({
      message_type: "move",
      body: {
        gid: "teste", // XXX
        player_id: "001", // XXX
        from: params.from
          ? {
              line: params.from.i,
              col: params.from.j,
            }
          : null,
        to: {
          line: params.to.i,
          col: params.to.j,
        },
      },
    });
  };

  const resetPieceSelection = () => {
    if (selectedPiece) setSelectedPiece(null);
  };

  const updateBoardPieces = useCallback((board: string[][] | null) => {
    if (board) {
      for (let i = 0; i < 3; ++i) {
        for (let j = 0; j < 3; ++j) {
          const piece = board[i][j];

          if (piece != null) updatePieceStateToPos(piece, { i, j });
        }
      }
    }
  }, []);

  useEffect(() => {
    if (lastSocketMessage?.data) {
      const messageType = lastSocketMessage.data["message_type"];
      const body = lastSocketMessage.data["body"];

      if (messageType == "start" || messageType == "update") {
        if (body && body["board"]) updateBoardPieces(body["board"]);
      }
    }
  }, [lastSocketMessage, updateBoardPieces]);

  return (
    <BackgroundImageContainer image={background} onClick={resetPieceSelection}>
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
                onDropItem={(e) => handleOnCellDrop(e, i, j)}
                onClick={() => handleOnCellClick(i, j)}
              />
            ))
          )}
          {Object.entries(piecePositionStates).map(([id, { i, j }]) => {
            const coordinate = CELL_POSITIONS[i][j];
            return (
              <Piece
                id={id}
                x={coordinate.x * 3}
                y={coordinate.y * 3}
                isSelected={selectedPiece?.id === id}
                onClick={() => setSelectedPiece({ id, i, j })}
                onDragStart={resetPieceSelection}
                i={i}
                j={j}
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
