import { useState } from "react";

const usePaginationState = (properties: any, page = 0, size = 25) => {
  const [state, setState] = useState({
    ...properties,
    page,
    size,
  });

  const onNextPage = (page: any, size: any) => {
    setState({ ...state, page: page - 1, size });
  };

  const onQueryChange = (property: string, value: any) => {
    setState({ ...state, [property]: value });
  };

  return [state, { setState, onNextPage, onQueryChange }];
};

export default usePaginationState;
