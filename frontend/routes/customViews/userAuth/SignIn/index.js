import React, { useState } from "react";
import { Form, message } from "antd";
import IntlMessages from "../../../../util/IntlMessages";
// import CircularProgress from "../../../../app/components/CircularProgress";
import qs from "qs";
import { devusername, devpassword } from "../../../../shared/devsettings";
import MyForm from "../../../../util/customForms/myForm";
import FormInput from "../../../../util/customForms/formInput";
import FormBtnSubmit from "../../../../util/customForms/formBtnSubmit";
import { useRouter } from "next/router";
import { post } from "../../../../shared/global";
import parseUrl from "parse-url";

const SignIn = () => {
  const router = useRouter();
  const [formError, setFormError] = useState({});
  const [loading, setLoading] = useState(false);
  {
    /* error = { errorTitle: "", errorMsg: ""}*/
  }

  const onFinishFailed = (errorInfo) => {
    console.log("auth => ", errorInfo);
    message.error("Authentication Failed");
  };

  const onFinish = (data) => {
    // const { email, password } = values;

    setLoading(true);
    post("/api/authenticate", qs.stringify(data), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((res) => {
        console.log(res);
        const parts = parseUrl(window.location.href);
        const search = parts.search || "";

        if (search) {
          const searchObj = qs.parse(search);
          router.push(decodeURIComponent(searchObj.redirectUrl) || "/");
        } else {
          router.push("/main/shop/");
        }
      })
      .catch((error) => {
        setLoading(false);
        setFormError({
          errorTitle: "Sign In Error",
          errorMsg: "Wrong Username or Password",
        });
      });
  };

  return (
    <div className="gx-app-login-wrap">
      <div className="gx-app-login-container">
        <div className="gx-app-login-main-content">
          <div className="gx-app-logo-content">
            <div className="gx-app-logo-content-bg">
              <img
                src="/images/login-overlay.png"
                alt="Construction Inventory Management and Billing System"
              />
            </div>
            <div className="gx-app-logo-wid">
              <h1>
                <IntlMessages id="app.userAuth.signIn" />
              </h1>
              <p>
                <IntlMessages id="app.userAuth.bySigning" />
              </p>
            </div>
            <div className="gx-app-logo">
              <img alt="example" src={"/images/logo.png"} />
            </div>
          </div>
          <div className="gx-app-login-content">
            <MyForm
              name="signIn"
              error={formError}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              className="gx-signin-form gx-form-row0"
            >
              <Form.Item>
                <div>
                  <img alt="example" src={"/images/logo.svg"} />
                </div>
              </Form.Item>
              <FormInput
                initialValue={devusername} //demo@example.com
                rules={[
                  { required: true, message: "The input is not required" },
                ]}
                name="username"
                placeholder="Username"
              />
              <FormInput
                initialValue={devpassword}
                rules={[
                  { required: true, message: "Please input your Password!" },
                ]}
                name="password"
                type="password"
                placeholder="Password"
              />
              <FormBtnSubmit
                type="primary"
                block
                loading={loading}
                id="app.userAuth.signIn"
              />
            </MyForm>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
