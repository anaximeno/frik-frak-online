"use client";

import { Button, defineStyle } from "@chakra-ui/react";
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
import { Avatar } from "../../components/ui/avatar";
import { TbLogout2 } from "react-icons/tb";

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
          <Avatar
            name={user.username}
            colorPalette="blue"
            onClick={() => setOpen(true)}
            css={ringCss}
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

const ringCss = defineStyle({
  outlineWidth: "2px",
  outlineColor: "colorPalette.500",
  outlineOffset: "2px",
  outlineStyle: "solid",
});

export default AppDrawer;
