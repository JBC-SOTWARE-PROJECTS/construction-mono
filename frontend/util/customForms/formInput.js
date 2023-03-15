import { Form, Input, DatePicker, InputNumber, AutoComplete } from "antd";
import React, { forwardRef } from "react";
import _ from "lodash";

const { TextArea } = Input;

const FormInput = (
  {
    type,
    placeholder,
    description,
    onChange,
    disabled,
    readOnly,
    formatter,
    onSelect = () => {},
    parser,
    options = [],
    ...props
  },
  ref
) => {
  const display = () => {
    if (type === "datepicker") {
      return (
        <DatePicker
          className="gx-w-100"
          placeholder={placeholder}
          onChange={onChange}
          ref={ref}
          readOnly={readOnly}
          disabled={disabled}
        />
      );
    } else if (type === "textarea") {
      return (
        <TextArea
          placeholder={placeholder}
          ref={ref}
          disabled={disabled}
          readOnly={readOnly}
          rows={4}
        />
      );
    } else if (type === "number") {
      return (
        <InputNumber
          placeholder={placeholder}
          ref={ref}
          disabled={disabled}
          onChange={onChange}
          formatter={formatter}
          readOnly={readOnly}
          parser={parser}
          style={{ width: "100%" }}
        />
      );
    } else if (type === "autocomplete") {
      return (
        <AutoComplete
          className="gx-w-100"
          ref={ref}
          options={options}
          onSelect={onSelect}
          placeholder={placeholder}
          filterOption={(inputValue, option) =>
            (option || "").value
              .toUpperCase()
              .indexOf(inputValue.toUpperCase()) !== -1
          }
        />
      );
    } else {
      return (
        <Input
          type={type}
          placeholder={placeholder}
          ref={ref}
          readOnly={readOnly}
          disabled={disabled}
          onChange={onChange}
        />
      );
    }
  };
  return (
    <>
      {description && (
        <>
          <label htmlFor={props?.name} style={{ marginLeft: -10 }}>
            {description}
          </label>
          {!_.isEmpty(props?.rules) && props?.rules[0]?.required && (
            <span className="required-color"> *</span>
          )}
        </>
      )}
      <Form.Item {...props} style={{ marginBottom: 5 }}>
        {display()}
      </Form.Item>
    </>
  );
};

export default forwardRef(FormInput);
