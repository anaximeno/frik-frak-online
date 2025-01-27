import { HStack, Heading, Table, Card, AbsoluteCenter } from "@chakra-ui/react";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "../../../../../components/ui/pagination";
import { useCallback, useEffect, useState } from "react";
import { getGames, IGameData } from "../../../../../services/game";
import { IPaginatedResponse } from "../../../../../helpers/types";
import {
  ProgressBar,
  ProgressRoot,
} from "../../../../../components/ui/progress";

interface PageChangeDetails {
  page: number;
  pageSize: number;
}

const FrikFrakGalleryView: React.FC = () => {
  const [games, setGames] = useState<IPaginatedResponse<IGameData>>();
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const getAllGames = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getGames({ page });
      setGames(response.data as IPaginatedResponse<IGameData>);
    } catch (e) {
      console.log("Error Trying to Get Game Data:", e);
    } finally {
      setLoading(false);
    }
  }, [page]);

  const handlePageChange = async (details: PageChangeDetails) => {
    setPage(details.page);
  };

  useEffect(() => {
    getAllGames();
  }, [getAllGames]);

  return (
    <AbsoluteCenter axis="both">
      <Card.Root>
        <Card.Header>
          <Heading size="xl">Jogos</Heading>
          {loading && (
            <ProgressRoot maxW="100%" value={100} striped animated>
              <ProgressBar />
            </ProgressRoot>
          )}
        </Card.Header>
        <Card.Body>
          <Table.ScrollArea maxH="60vh" maxW="85vw">
            <Table.Root size="lg" variant="outline" striped>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>VS</Table.ColumnHeader>
                  <Table.ColumnHeader>Estado</Table.ColumnHeader>
                  <Table.ColumnHeader>Vencedor</Table.ColumnHeader>
                  <Table.ColumnHeader>Início do Jogo</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="end">
                    Última Atualização
                  </Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {games?.results?.map((item) => (
                  <Table.Row key={item.id}>
                    <Table.Cell>
                      {item.players?.map((v) => v.username).join(" vs ")}
                    </Table.Cell>
                    <Table.Cell>
                      {item.state == "ongoing" ? "Em Jogo" : "Terminou"}
                    </Table.Cell>
                    <Table.Cell>{item?.winner?.username ?? "-"}</Table.Cell>
                    <Table.Cell textAlign="end">
                      {item?.created_at
                        ? new Date(item.created_at).toLocaleString()
                        : "-"}
                    </Table.Cell>
                    <Table.Cell textAlign="end">
                      {item?.updated_at
                        ? new Date(item.updated_at).toLocaleString()
                        : "-"}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Table.ScrollArea>
          {games?.count && (
            <Card.Footer paddingTop={5}>
              <PaginationRoot
                count={games!.count!}
                pageSize={10}
                page={page}
                onPageChange={handlePageChange}
              >
                <HStack wrap="wrap">
                  <PaginationPrevTrigger />
                  <PaginationItems />
                  <PaginationNextTrigger />
                </HStack>
              </PaginationRoot>
            </Card.Footer>
          )}
        </Card.Body>
      </Card.Root>
    </AbsoluteCenter>
  );
};

export default FrikFrakGalleryView;
