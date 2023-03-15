import { Form, Select } from "antd";
import React, { forwardRef } from "react";
import _ from "lodash";

const FormSelect = (
  {
    placeholder,
    field,
    description,
    list,
    mode,
    loading,
    onChange,
    disabled,
    allowClear,
    ...props
  },
  ref
) => {
  let choices = _.map(list, (data, i) => {
    return (
      <Select.Option key={i} value={data.value}>
        {data.label}
      </Select.Option>
    );
  });

  return (
    <>
      {description && (
        <>
          <label htmlFor={field} style={{ marginLeft: -10 }}>
            {description}
          </label>
          {!_.isEmpty(props?.rules) && props?.rules[0]?.required && (
            <span className="required-color"> *</span>
          )}
        </>
      )}
      <Form.Item {...props} style={{ marginBottom: 5 }}>
        <Select
          allowClear={allowClear}
          className="gx-w-100"
          loading={loading}
          ref={ref}
          id={field}
          mode={mode}
          placeholder={placeholder}
          showSearch
          optionFilterProp="children"
          onChange={onChange}
          disabled={disabled}
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
        >
          {choices}
        </Select>
      </Form.Item>
    </>
  );
};

export default forwardRef(FormSelect);
