import { Form, Checkbox } from "antd";
import React, { forwardRef } from "react";
import _ from "lodash"

const FormCheckbox = ({ field, description, onChange, defaultChecked, disabled, horizontal, ...props }, ref) => {
    let style = { marginBottom: 5 }
    if (horizontal) {
        style = { marginTop: 15, marginLeft: 10, marginBottom: 5 }
    }


    return (
        <>
            <Form.Item {...props} style={style}>
                <Checkbox
                    ref={ref}
                    id={field}
                    onChange={onChange}
                    disabled={disabled}>
                    {description}
                </Checkbox>
            </Form.Item>
        </>
    )

};

export default forwardRef(FormCheckbox);
