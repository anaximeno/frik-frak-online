/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Box } from "@chakra-ui/react";
import { Line, Board } from "./style";
import Cell from "./components/cell";
import Piece, { IPieceCoordinate, IPiecePosition } from "./components/piece";
import background from "../../../assets/background-01.webp";
import BackgroundImageContainer from "../../components/background-image-container";
import useWebSocket from "../../../hooks/useWebSocket";
import { useAuth } from "../../../hooks/authProvider";

const BOARD_COORDINATES: IPieceCoordinate[][] = [
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

interface ISelectedPiece extends IPiecePosition {
  pid: string;
}

const FrikFrakPage = () => {
  const { user } = useAuth();

  const [boardState, setBoardState] = useState<Array<Array<string | null>>>([
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]);

  const [selectedPiece, setSelectedPiece] = useState<ISelectedPiece | null>(
    null
  );

  const gameId = useRef<string>("");

  const [turnPlayerId, setTurnPlayerId] = useState<string>("");

  const { lastSocketMessage, sendSocketMessage, socketConnectionStatus } =
    useWebSocket(`ws://127.0.0.1:8000/ws/game/play/`);

  const updateBoardPieceStatePosition = useCallback(
    (params: { from?: IPiecePosition; to: IPiecePosition; pid: string }) => {
      const { from, to, pid } = params;
      const newBoardState = [...boardState];
      if (from) newBoardState[from.i][from.j] = null;
      newBoardState[to.i][to.j] = pid;
      setBoardState(newBoardState);
    },
    [boardState]
  );

  const canAddNewPieces = useMemo(() => {
    if (!user?.player_id || turnPlayerId !== user.player_id) return false;

    let totalPlayerPieces = 0;

    for (const row of boardState) {
      for (const slot of row) {
        if (slot && slot === user.player_id) {
          totalPlayerPieces++;
        }
      }
    }

    return totalPlayerPieces < 3;
  }, [boardState, turnPlayerId, user]);

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
    updateBoardPieceStatePosition({
      pid: json.from.pid,
      from: json.from,
      to: { i, j },
    });

    sendPiecePositionChangeThruSocket({
      pid: json.from.pid,
      from: json.from,
      to: { i, j },
    });
  };

  const handleOnCellClick = (i: number, j: number) => {
    if (selectedPiece) {
      if (!checkPieceMoveIsValid(selectedPiece, { i, j })) {
        // TODO: alert use this is not allowed?
        return;
      }

      // NOTE: Update localy first, then wait for message from socket
      // validating the correct position:
      updateBoardPieceStatePosition({
        pid: selectedPiece.pid,
        from: selectedPiece,
        to: { i, j },
      });

      sendPiecePositionChangeThruSocket({
        pid: selectedPiece.pid,
        from: selectedPiece,
        to: { i, j },
      });

      clearPieceSelection();
      return;
    } else if (user?.player_id && canAddNewPieces) {
      // NOTE: Update localy first, then wait for message from socket
      // validating the correct position:
      updateBoardPieceStatePosition({
        pid: user.player_id,
        to: { i, j },
      });

      sendPiecePositionChangeThruSocket({
        pid: user.player_id,
        to: { i, j },
      });

      clearPieceSelection();
    }
  };

  const sendPiecePositionChangeThruSocket = (params: {
    pid: string;
    from?: IPiecePosition;
    to: IPiecePosition;
  }) => {
    sendSocketMessage({
      msg_type: "move",
      game_id: gameId.current,
      player_id: params.pid,
      body: {
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

  const clearPieceSelection = () => {
    if (selectedPiece) setSelectedPiece(null);
  };

  useEffect(() => {
    if (lastSocketMessage?.data) {
      const messageType = lastSocketMessage.data["msg_type"];
      const body = lastSocketMessage.data["body"];

      switch (messageType) {
        case "start":
          gameId.current = lastSocketMessage.data.game_id;
          setBoardState(body.board);
          setTurnPlayerId(body.turn_player_id);
          break;
        case "update":
          setBoardState(body.board);
          setTurnPlayerId(body.turn_player_id);
          break;
        default:
          break;
      }
    }
  }, [lastSocketMessage]);

  useEffect(() => {
    if (
      user?.player_id &&
      gameId.current === "" &&
      socketConnectionStatus === "connected"
    ) {
      // Send PLAY message
      sendSocketMessage({
        msg_type: "play",
        player_id: user?.player_id,
        body: {
          vs: "user",
        },
      });
    }
  }, [gameId, sendSocketMessage, socketConnectionStatus, user]);

  return (
    <BackgroundImageContainer image={background} onClick={clearPieceSelection}>
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
          {BOARD_COORDINATES.map((row, i) =>
            row.map((cell, j) => (
              <Cell
                key={`${i}-${j}`}
                x={cell.x}
                y={cell.y}
                onDropItem={(e) => handleOnCellDrop(e, i, j)}
                onClick={() => handleOnCellClick(i, j)}
                disable={turnPlayerId !== user?.player_id}
              />
            ))
          )}
          {boardState.map((row, i) =>
            row.map((pid, j) => {
              if (pid === null) return <></>;
              const coord = BOARD_COORDINATES[i][j];
              return (
                <Piece
                  pid={pid}
                  x={coord.x * 3}
                  y={coord.y * 3}
                  onClick={() => setSelectedPiece({ pid, i, j })}
                  isSelected={
                    selectedPiece?.pid == pid &&
                    selectedPiece?.i == i &&
                    selectedPiece?.j == j
                  }
                  onDragStart={clearPieceSelection}
                  i={i}
                  j={j}
                  color={pid === user?.player_id ? "blue" : "red"}
                  draggable
                  disable={
                    pid !== user?.player_id || turnPlayerId !== user?.player_id
                  }
                />
              );
            })
          )}
        </Board>
      </Box>
    </BackgroundImageContainer>
  );
};

export default FrikFrakPage;
