import theme from "@/theme/themeConfig";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import {
  LoginFormPage,
  ProConfigProvider,
  ProFormText,
} from "@ant-design/pro-components";
import { ConfigProvider, Divider, Space, Tabs, TabsProps, message } from "antd";
import { useState } from "react";
import enUS from "antd/locale/en_US";
import { password, username } from "@/defaultaccount";
import { ICredentials } from "@/utility/interfaces";
import { post } from "@/utility/graphql-client";
import qs from "qs";
import { useRouter } from "next/router";

type LoginType = "account";

const items: TabsProps["items"] = [
  {
    key: "account",
    label: "DiverseTrade Suite Login",
  },
];

export default function SingIn() {
  const router = useRouter();
  const [loginType, setLoginType] = useState<LoginType>("account");
  const [loading, setLoading] = useState<boolean>(false);

  const onFinishFailed = () => {
    message.error("Authentication Failed. Please try again");
  };

  const onLogin = async (record: Record<string, any>) => {
    let data = record as ICredentials;
    setLoading(true);
    post("/api/authenticate", qs.stringify(data), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((res) => {
        if (res) {
          router.push("/");
        }
      })
      .catch((error) => {
        console.log("error login: ", error);
        setLoading(false);
      });
    console.log("record => ", record);
  };

  return (
    <ProConfigProvider hashed={false}>
      <ConfigProvider theme={theme} locale={enUS}>
        <div
          style={{
            backgroundColor: "white",
            height: "100vh",
          }}
        >
          <LoginFormPage
            backgroundImageUrl="/images/banner.svg"
            logo="/images/DTLogo.svg"
            title="DiverseTrade Suite"
            subTitle="Inventory | Accounting | Payroll"
            onFinish={onLogin}
            onFinishFailed={onFinishFailed}
            initialValues={{
              username: username,
              password: password,
            }}
            submitter={{
              searchConfig: {
                submitText: "Sign In",
              },
              submitButtonProps: {
                loading: loading,
                block: true,
                style: { backgroundColor: "#399B53" },
              },
            }}
            actions={
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <Divider plain>
                  <span
                    style={{
                      color: "#CCC",
                      fontWeight: "normal",
                      fontSize: 14,
                    }}
                  >
                    DiverseTrade Suite
                  </span>
                </Divider>
                <Space align="center" size={24}>
                  <p
                    style={{
                      color: "#CCC",
                      fontWeight: "normal",
                      fontSize: 14,
                    }}
                  >
                    By Signing In, you can access all information and documents.
                    Please be advice that you should carry this information with
                    outmost confidentiality.
                  </p>
                </Space>
              </div>
            }
          >
            <Tabs
              centered
              activeKey={loginType}
              onChange={(activeKey) => setLoginType(activeKey as LoginType)}
              items={items}
            />
            {loginType === "account" && (
              <>
                <ProFormText
                  name="username"
                  fieldProps={{
                    size: "large",
                    prefix: <UserOutlined className={"prefixIcon"} />,
                  }}
                  placeholder="Username"
                  rules={[
                    {
                      required: true,
                      message: "Enter Username",
                    },
                  ]}
                />
                <ProFormText.Password
                  name="password"
                  fieldProps={{
                    size: "large",
                    prefix: <LockOutlined className={"prefixIcon"} />,
                  }}
                  placeholder="Password"
                  rules={[
                    {
                      required: true,
                      message: "Password is Required",
                    },
                  ]}
                />
              </>
            )}
          </LoginFormPage>
        </div>
      </ConfigProvider>
    </ProConfigProvider>
  );
}
