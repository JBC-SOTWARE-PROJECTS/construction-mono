import React from "react";
import { Form, Alert } from "antd";
import _ from "lodash";
import IntlMessages from "../IntlMessages";

const MyForm = ({ error, name, ...props }) => {
    {/* error = { errorTitle: "", errorMsg: ""}*/ }

    return (
        <Form {...props}>
            {props.children}
            {!_.isEmpty(error) && (
                <Alert
                    className="gx-mb-0"
                    message={error?.errorTitle || "Form Requirements"}
                    description={error?.errorMsg || "Please specify form requirements."}
                    type="error"
                    showIcon
                />
            )}
            {name === "signIn" && (
                <span
                    className="gx-text-light gx-fs-sm">
                    <IntlMessages id="app.userAuth.footer" />
                </span>
            )}
        </Form>
    )
};

export default MyForm;
MyForm.defaultProps = {
    error: {}
};