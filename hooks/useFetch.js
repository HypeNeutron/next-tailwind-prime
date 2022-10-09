import axios from "axios";
import { useState, useEffect } from "react";
import { getError } from "./../utils/error";

const useFetch = (url) => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(url);
        setIsLoading(false);
        setData(data);
      } catch (err) {
        setIsLoading(false);
        setError(getError(err));
      }
    };

    fetchData();
  }, [url]);

  return [data, error, isLoading];
};

export default useFetch;
