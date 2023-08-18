import { Form, Input, FormItemProps, InputProps, InputNumber, InputNumberProps } from "antd";
import React, { forwardRef } from "react";
import _ from "lodash";

interface ExtendedInputProps extends FormItemProps {
    propsinputNumber: InputNumberProps;
}

const FormInputNumber = ({ ...props }: ExtendedInputProps, ref: any) => {
    const { propsinputNumber } = props;
    return (
        <Form.Item {...props} style={{ marginBottom: "6px" }}>
            <InputNumber {...propsinputNumber} ref={ref} />
        </Form.Item>
    );
};

export default forwardRef(FormInputNumber);
