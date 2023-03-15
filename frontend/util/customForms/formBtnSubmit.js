import { Form, Button } from "antd";
import React from "react";
import IntlMessages from "../IntlMessages";

const FormBtnSubmit = ({ type, loading, block, id, style }) => {

    return (
        <Form.Item className="gx-mb-2" style={style}>
            <Button className="gx-mb-0" type={type} htmlType="submit" block={block} loading={loading}>
                {" "}<IntlMessages id={id} />
            </Button>
        </Form.Item>
    )

};

export default FormBtnSubmit;
