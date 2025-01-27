import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IUserData, useAuth } from "../../../../../hooks/authProvider";
import useWebSocket from "../../../../../hooks/useWebSocket";
import Piece, { IPiecePosition } from "../../components/piece";
import { AbsoluteCenter, Box } from "@chakra-ui/react";
import { Board, Line } from "../../style";
import { BOARD_COORDINATES } from "../../constants";
import Cell from "../../components/cell";
import { Toaster, toaster } from "../../../../../components/ui/toaster";
import { GiPlayerTime } from "react-icons/gi";
import { EmptyState } from "../../../../../components/ui/empty-state";
import UserAvatar from "../../../../components/user-avatar";
import GameFinishedDialog from "../../../../components/game-finished-dialog";

interface ISelectedPiece extends IPiecePosition {
  pid: string;
}

const FrikFrakPlayView: React.FC = () => {
  const { user, fetchPlayerUserInfo } = useAuth();

  const [boardState, setBoardState] = useState<Array<Array<string | null>>>([
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]);

  const [selectedPiece, setSelectedPiece] = useState<ISelectedPiece | null>(
    null
  );

  // TODO: store the game id in local storage and try to reconnect
  // to the game in case it hasn't ended yet (create a REST api route for checking this)
  // otherwise remove the game id from storage and wait other players entering the game.
  const gameId = useRef<string>("");

  const [turnPlayerId, setTurnPlayerId] = useState<string>("");
  const [againstPlayerUser, setAgainstPlayerUser] = useState<IUserData | null>(
    null
  );
  const [winnerPlayerId, setWinnerPlayerId] = useState<string | null>(null);
  const [gameWonInfo, setGameWonInfo] = useState<string | null>(null);

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
    if (Math.abs(to.i - from.i) <= 1 && Math.abs(to.j - from.j) <= 1) {
      const starPoses = [
        [0, 1],
        [1, 0],
        [2, 1],
        [1, 2],
      ];

      const idxFrom = starPoses.findIndex(
        (v) => v[0] === from.i && v[1] === from.j
      );

      const idxTo = starPoses.findIndex((v) => v[0] === to.i && v[1] === to.j);

      return !(idxFrom !== -1 && idxTo !== -1);
    }
    return false;
  };

  const handleOnCellDrop = (event: React.DragEvent, i: number, j: number) => {
    const data = event.dataTransfer.getData("application/json");
    const json = JSON.parse(data);

    if (!json && !json.from && !json.from.id) return;

    if (!checkPieceMoveIsValid(json.from, { i, j })) {
      toaster.create({
        type: "error",
        title: "Movimento ilegal!",
        duration: 2000,
      });
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
        toaster.create({
          type: "error",
          title: "Movimento ilegal!",
          duration: 2000,
        });
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

  const gameFinishedNote: string | undefined = useMemo(() => {
    switch (gameWonInfo) {
      case "withdrawal":
        return "O adversário desistiu do jogo.";
      case "line-formed":
        if (user?.player_id == winnerPlayerId)
          return "Conseguiste formar uma linha com as peças!";
        else return "O Adversário conseguiu formar uma linha com as peças!";
      default:
        return undefined;
    }
  }, [gameWonInfo, winnerPlayerId, user]);

  const getAgainstPlayerUser = useCallback(
    async (playerId: string) => {
      const againstPlayerUser = await fetchPlayerUserInfo(playerId);
      setAgainstPlayerUser(againstPlayerUser);
    },
    [fetchPlayerUserInfo]
  );

  useEffect(() => {
    toaster.remove();
    if (lastSocketMessage?.data) {
      const messageType = lastSocketMessage.data["msg_type"];
      const body = lastSocketMessage.data["body"];

      switch (messageType) {
        case "start":
          gameId.current = lastSocketMessage.data.game_id;
          setBoardState(body.board);
          setTurnPlayerId(body.turn_player_id);
          getAgainstPlayerUser(body.against_player_id);
          toaster.create({
            title:
              body.turn_player_id == user?.player_id
                ? "Tu começas!"
                : "Teu adversário começa!",
            type: "info",
            duration: 8000,
            action: { label: "OK", onClick: () => null },
          });
          if (body.turn_player_id == user?.player_id) {
            if (canAddNewPieces)
              toaster.create({
                title: "Clique numa célula vazia para adicionar uma peça.",
                type: "info",
                duration: 20000,
                action: { label: "OK", onClick: () => null },
              });
            else
              toaster.create({
                title: "Movimente uma peça para outra posição.",
                type: "info",
                duration: 20000,
                action: { label: "OK", onClick: () => null },
              });
          }
          break;
        case "update":
          setBoardState(body.board);
          setTurnPlayerId(body.turn_player_id);
          toaster.create({
            title:
              body.turn_player_id == user?.player_id
                ? "Tua vez!"
                : "Vez do adversário!",
            type: "info",
            duration: 8000,
            action: { label: "OK", onClick: () => null },
          });
          if (body.turn_player_id == user?.player_id) {
            if (canAddNewPieces)
              toaster.create({
                title: "Clique numa célula vazia para adicionar uma peça.",
                type: "info",
                duration: 20000,
                action: { label: "OK", onClick: () => null },
              });
            else
              toaster.create({
                title: "Movimente uma peça para outra posição.",
                type: "info",
                duration: 20000,
                action: { label: "OK", onClick: () => null },
              });
          }
          break;
        case "finish":
          setBoardState(body.board);
          setWinnerPlayerId(body.winner_player_id);
          setGameWonInfo(body.won_for);
          toaster.create({
            title: "O Jogo Terminou!",
            type: "info",
            duration: 80000,
            action: { label: "OK", onClick: () => null },
          });
          break;
        default:
          break;
      }
    }
  }, [lastSocketMessage, user, canAddNewPieces, getAgainstPlayerUser]);

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
    <Box paddingTop="200px" height="100vh" onClick={clearPieceSelection}>
      <Toaster />
      {gameId.current ? (
        <>
          <AbsoluteCenter>
            <Board>
              <Line style={{ transform: "rotate(45deg)", width: "150%" }} />
              <Line style={{ transform: "rotate(-45deg)", width: "150%" }} />
              <Line
                style={{ transform: "rotate(-90deg)", translate: "150px 0" }}
              />
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
                        pid !== user?.player_id ||
                        turnPlayerId !== user?.player_id ||
                        canAddNewPieces
                      }
                    />
                  );
                })
              )}
            </Board>
          </AbsoluteCenter>
          {againstPlayerUser && (
            <UserAvatar
              username={againstPlayerUser.username}
              colorPalette="red"
              style={{
                position: "absolute",
                zIndex: 1,
                bottom: "10px",
                right: "10px",
              }}
            />
          )}
          {againstPlayerUser && winnerPlayerId && (
            <GameFinishedDialog
              adversary={againstPlayerUser}
              user_won={user?.player_id == winnerPlayerId}
              note={gameFinishedNote}
            />
          )}
        </>
      ) : (
        <EmptyState
          icon={<GiPlayerTime color="teal" />}
          title="Esperando outros jogadores conectarem..."
          size="lg"
        />
      )}
    </Box>
  );
};

export default FrikFrakPlayView;
