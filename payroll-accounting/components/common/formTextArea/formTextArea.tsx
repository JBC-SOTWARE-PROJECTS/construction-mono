import React, { forwardRef } from "react";
import { Form, Input, FormItemProps } from "antd";
import { TextAreaProps } from "antd/es/input";
import _ from "lodash";

interface ExtendedTextAreaProps extends FormItemProps {
  propstextarea?: TextAreaProps;
}

const { TextArea } = Input;

const FormTextArea = ({ ...props }: ExtendedTextAreaProps, ref: any) => {
  const { propstextarea } = props;
  return (
    <Form.Item {...props} style={{ marginBottom: "6px" }}>
      <TextArea
        autoSize={propstextarea?.autoSize ?? { minRows: 4, maxRows: 6 }}
        {...propstextarea}
        ref={ref}
      />
    </Form.Item>
  );
};

export default forwardRef(FormTextArea);
