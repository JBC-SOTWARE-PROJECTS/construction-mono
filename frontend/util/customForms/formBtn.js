import { Form, Button } from "antd";
import React from "react";
import IntlMessages from "../IntlMessages";

const FormBtn = ({ type, loading, block, id, onClick }) => {

    return (
        <Form.Item className="gx-mb-2">
            <Button className="gx-mb-0" type={type} block={block} loading={loading} onClick={onClick}>
                {" "}<IntlMessages id={id} />
            </Button>
        </Form.Item>
    )

};

export default FormBtn;
