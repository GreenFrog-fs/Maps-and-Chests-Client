import axios from "axios";
import { url } from "./url";

export function findUser(id) {
  return axios.get(`${url}/user/${id}`).then((res) => res.data);
}
