import React, { useMemo, useState, forwardRef } from "react";
import debounce from "lodash/debounce";
import { Select, Spin, Form, FormItemProps, Empty } from "antd";
import type { SelectProps } from "antd/es/select";
import _ from "lodash";
import { OptionsValue } from "@/utility/interfaces";
import { DocumentNode } from "graphql";
import { useLazyQuery } from "@apollo/client";

interface DebounceSelectProps<ValueType = any>
  extends Omit<SelectProps<ValueType | ValueType[]>, "options" | "children"> {
  fetchOptions: DocumentNode;
  debounceTimeout?: number;
}

interface ExtendedSelectProps extends FormItemProps {
  propsselect: DebounceSelectProps;
}

function FormDebounceSelect(
  { propsselect, ...props }: ExtendedSelectProps,
  ref: any
) {
  const { fetchOptions, debounceTimeout = 500, ...others } = propsselect;
  const [options, setOptions] = useState<OptionsValue[]>([]);
  const [fetching, setFecthing] = useState(false);
  const [fetch, { loading }] = useLazyQuery(fetchOptions);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {
      setFecthing(true);
      fetch({
        variables: { filter: value, size: 10, page: 0 },
        onCompleted: (data) => {
          const list: OptionsValue[] = data?.list?.content;
          setOptions(list);
          setFecthing(false);
        },
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);

  const getFirstData = (filter: string) => {
    fetch({
      variables: { filter: filter, size: 10, page: 0 },
      onCompleted: (data) => {
        const list: OptionsValue[] = data?.list?.content;
        setOptions(list);
      },
    });
  };

  return (
    <Form.Item style={{ marginBottom: "6px" }} {...props}>
      <Select
        className="w-full"
        labelInValue
        filterOption={false}
        showSearch
        loading={loading}
        onSearch={debounceFetcher}
        onClear={() => getFirstData("")}
        onDropdownVisibleChange={(open) => {
          if (open && _.isEmpty(options)) {
            getFirstData("");
          }
        }}
        notFoundContent={
          loading ? (
            <div className="select-option-loading">
              <Spin />
              <small>{fetching ? "Searching..." : "Loading..."}</small>
            </div>
          ) : (
            <Empty description="No Data Found" />
          )
        }
        options={options}
        {...others}
        ref={ref}
      />
    </Form.Item>
  );
}

export default forwardRef(FormDebounceSelect);
