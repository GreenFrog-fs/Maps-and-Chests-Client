import axios from "axios";
import { url } from "./url";

export function deactivateChest(id, chest_id) {
  return axios
    .patch(`${url}/chest/${id}/${chest_id}/deactivate`)
    .then((res) => res.data);
}
