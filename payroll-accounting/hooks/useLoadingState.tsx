import { useEffect, useState } from "react";

const useLoadingState = (boolean: boolean) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(boolean);
  }, [boolean]);

  return loading;
};

export default useLoadingState;
