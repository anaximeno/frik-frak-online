"use client";

import { Button } from "@chakra-ui/react";
import {
  DrawerActionTrigger,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from "../../components/ui/drawer";
import { DataListRoot, DataListItem } from "../../components/ui/data-list";
import { useEffect, useState } from "react";
import { useAuth, IPlayerStats } from "../../hooks/authProvider";
import { TbLogout2 } from "react-icons/tb";
import UserAvatar from "./user-avatar";

const AppDrawer: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { logout, user, token, fetchPlayerStats } = useAuth();
  const [playerStats, setPlayerStats] = useState<IPlayerStats | null>(null);

  useEffect(() => {
    if (user?.player_id)
      fetchPlayerStats(user.player_id).then((value) => setPlayerStats(value));
  }, [user, fetchPlayerStats]);

  return (
    <DrawerRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
      <DrawerBackdrop />
      {user && token && (
        <DrawerTrigger
          asChild
          style={{
            position: "absolute",
            zIndex: 1,
            right: "10px",
            top: "10px",
            cursor: "pointer",
          }}
        >
          <UserAvatar
            username={user.username}
            onClick={() => setOpen(true)}
            colorPalette="blue"
          />
        </DrawerTrigger>
      )}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{user?.username}</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          {playerStats && (
            <DataListRoot>
              <DataListItem
                key={0}
                label="Partidas Jogadas"
                value={playerStats.games_played}
              />
              <DataListItem
                key={1}
                label="Partidas Vencidas"
                value={playerStats.games_won}
              />
              <DataListItem
                key={2}
                label="Partidas Perdidas"
                value={playerStats.games_lost}
              />
            </DataListRoot>
          )}
        </DrawerBody>
        <DrawerFooter>
          <DrawerActionTrigger asChild>
            <Button colorPalette="teal" variant="outline" onClick={logout}>
              <TbLogout2 /> Log Out
            </Button>
          </DrawerActionTrigger>
        </DrawerFooter>
        <DrawerCloseTrigger />
      </DrawerContent>
    </DrawerRoot>
  );
};

export default AppDrawer;
