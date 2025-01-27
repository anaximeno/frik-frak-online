import { Badge, Button, HStack, VStack } from "@chakra-ui/react";
import { DataListItem, DataListRoot } from "../../components/ui/data-list";
import {
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "../../components/ui/dialog";
import { IUserData } from "../../hooks/authProvider";
import UserAvatar from "./user-avatar";
import { useNavigate } from "react-router-dom";
import { LuPlay } from "react-icons/lu";
import { BiHome } from "react-icons/bi";

export interface IGameFinishedDialogProps {
  user_won: boolean;
  adversary: IUserData;
  note?: string;
}

const GameFinishedDialog: React.FC<IGameFinishedDialogProps> = (props) => {
  const navigate = useNavigate();

  return (
    <VStack alignItems="start">
      <DialogRoot modal={true} trapFocus={true} open={true}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {props.user_won ? "Ganhaste! 😃" : "Perdeste! 🙁"}
            </DialogTitle>
          </DialogHeader>
          <DialogBody pb="8">
            <DataListRoot orientation="horizontal">
              <DataListItem
                label="Jogo"
                value={
                  <Badge colorPalette={props.user_won ? "green" : "red"}>
                    {props.user_won ? "Ganho" : "Perdido"}
                  </Badge>
                }
              />
              <DataListItem
                label="Contra"
                value={
                  <HStack>
                    <UserAvatar
                      size="xs"
                      colorPalette="red"
                      username={props.adversary.username}
                    />
                    {props.adversary.username}
                  </HStack>
                }
              />
              {props.note && <DataListItem label="Nota" value={props.note} />}
            </DataListRoot>
            <HStack
              paddingTop={10}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Button
                variant="outline"
                colorPalette={"green"}
                onClick={() => navigate("/")}
              >
                <BiHome />
                Ir Para a Página Principal
              </Button>
              <Button
                variant="outline"
                color={"orange"}
                onClick={() => window.location.reload()}
              >
                <LuPlay />
                Jogar Novamente
              </Button>
            </HStack>
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </VStack>
  );
};

export default GameFinishedDialog;
