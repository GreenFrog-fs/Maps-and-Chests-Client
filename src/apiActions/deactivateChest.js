import axios from "axios";
import { url } from "../constants";

export function deactivateChest(id, chest_id) {
  return axios
    .patch(`${url}/chest/deactivate`, {
      id: id,
      chest_id: chest_id,
    })
    .then((res) => res.data);
}
