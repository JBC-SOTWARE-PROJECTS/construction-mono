import { Form, Checkbox } from "antd";
import React, { forwardRef } from "react";
import _ from "lodash"

const FormCheckbox = ({ field, description, onChange, defaultChecked, ...props }, ref) => {



    return (
        <>
            <Form.Item {...props} style={{ marginBottom: 5 }}>
                <Checkbox
                    ref={ref}
                    id={field}
                    onChange={onChange}>
                    {description}
                </Checkbox>
            </Form.Item>
        </>
    )

};

export default forwardRef(FormCheckbox);
