import axios from "axios";
import { url } from "./url";

export function saveUser(id) {
  return axios.post(`${url}/user/${id}`).then((res) => res.data);
}
