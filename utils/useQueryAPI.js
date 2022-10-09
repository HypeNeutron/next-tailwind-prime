import axios from "axios";
import { useQuery } from "react-query";

export default function useQueryAPI(key, url) {
  return useQuery(key, async () => {
    const res = await axios.get(url);
    return res.data;
  });
}
