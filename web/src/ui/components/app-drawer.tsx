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
import { useState } from "react";
import { useAuth } from "../../hooks/authProvider";
import { TbLogout2 } from "react-icons/tb";
import UserAvatar from "./user-avatar";

const AppDrawer: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { logout, user, token } = useAuth();

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
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
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
