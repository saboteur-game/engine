import { Tools } from "../../constants";
import Player from "../player";

export interface IBoardCardParameters {
  position: string;
}

export interface IToolActionCardParameters {
  player: Player;
  appliedTo: Tools;
}

type CardParameters = IToolActionCardParameters | IBoardCardParameters;

export default CardParameters;
