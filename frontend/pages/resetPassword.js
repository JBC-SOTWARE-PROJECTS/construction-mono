import React, { useState } from "react";
import { message } from "antd";
import IntlMessages from "../util/IntlMessages";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import MyForm from "../util/customForms/myForm";
import FormInput from "../util/customForms/formInput";
import FormBtnSubmit from "../util/customForms/formBtnSubmit";
import { post } from "../shared/global";

const UPSERT_RECORD = gql`
  mutation ChangePassword($username: String, $newPassword: String) {
    resetPassword(username: $username, newPassword: $newPassword) {
      id
    }
  }
`;

const ResetPassword = ({ account }) => {
  const [state, setState] = useState({ loading: false });

  const [resetPassword] = useMutation(UPSERT_RECORD, {
    ignoreResults: false,
    onCompleted: (data) => {
      post("/api/logout")
        .then((response) => {
          window.location = "/";
        })
        .catch((error) => {})
        .finally(() => {});
    },
  });

  const onFinishFailed = (errorInfo) => {
    console.log("auth => ", errorInfo);
    message.error("Authentication Failed");
  };

  const onSubmit = (formData) => {
    setState({ ...state, loading: true });
    if (formData.newPassword !== formData.confirmationPassword) {
      message.error("Password and Confirmation Password did not match");
      return;
    }

    resetPassword({
      variables: {
        username: account.user.login,
        newPassword: formData.newPassword,
      },
    });
  };

  return (
    <div className="gx-login-container" style={{ marginTop: 50 }}>
      <div className="gx-login-content">
        <div className="gx-login-header">
          <img alt="Construction IMS-logo" src={"/images/logo.svg"} />
        </div>
        <div className="gx-mb-4">
          <h2>
            <IntlMessages id="app.userAuth.resetPassword" />
          </h2>
          <p>
            <IntlMessages id="appModule.enterPasswordReset" />
          </p>
        </div>

        <MyForm
          name="forgotPassword"
          error={{}}
          onFinish={onSubmit}
          onFinishFailed={onFinishFailed}
          className="gx-signin-form gx-form-row0"
        >
          <FormInput
            rules={[
              { required: true, message: "Please input new your Password!" },
            ]}
            name="newPassword"
            type="password"
            placeholder="New Password"
          />
          <FormInput
            rules={[
              { required: true, message: "Please confirm your Password!" },
            ]}
            name="confirmationPassword"
            type="password"
            placeholder="Confirm Password"
          />
          <FormBtnSubmit
            type="primary"
            block
            loading={state.loading}
            id="app.userAuth.reset"
          />
        </MyForm>
      </div>
    </div>
  );
};
export default ResetPassword;
