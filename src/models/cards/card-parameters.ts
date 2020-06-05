import { Tools } from "../../constants";
import Position from "../position";
import Player from "../player";

export interface IBoardCardParameters {
  position: Position;
}

export interface IToolActionCardParameters {
  player: Player;
  appliedTo: Tools;
}

type CardParameters = IToolActionCardParameters | IBoardCardParameters;

export default CardParameters;
