import { useState } from "react";

const initialState = {
  pageSize: 10,
  page: 0,
};
const usePaginationState = (properties: any, page = 0, size = 25) => {
  const [state, setState] = useState({
    ...initialState,
    ...properties,
    page,
    size,
  });

  const onNextPage = (page: any, pageSize: any) => {
    setState({ ...state, page: page - 1, pageSize });
  };

  const onQueryChange = (property: string, value: any) => {
    setState({ ...state, [property]: value });
  };

  return [state, { setState, onNextPage, onQueryChange }];
};

export default usePaginationState;
