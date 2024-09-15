import axios from "axios";
import { url } from "./url";

export function getChests() {
  return axios.get(`${url}/chest/all`).then((res) => res.data);
}
