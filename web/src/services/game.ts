import { IPaginatedResponse, IPaginatedParams } from "../helpers/types";
import api from "./api";

export interface IGamePlayerData {
  id?: string;
  username?: string;
  user_id?: string;
  profile_picture?: string;
}

export interface IGameData {
  id?: string;
  state?: string;
  board?: Array<Array<string | null>>;
  created_at?: string;
  updated_at?: string;
  winner?: IGamePlayerData;
  players?: IGamePlayerData[];
}

export const getGames = async <T>(
  params: IPaginatedParams & { link?: string }
) => api.get<IPaginatedResponse<T>>(params.link ?? `game/?page=${params.page}`);

export const getGameById = async (gameId: string) => api.get(`game/${gameId}`);
