import theme from "@/theme/themeConfig";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import {
  LoginFormPage,
  ProConfigProvider,
  ProFormText,
} from "@ant-design/pro-components";
import { ConfigProvider, Divider, Space, Tabs, TabsProps, message } from "antd";
import { useCallback, useState } from "react";
import enUS from "antd/locale/en_US";
import { devpassword, devusername } from "@/shared/devsettings";
import { ICredentials } from "@/utility/interfaces";
import { post } from "@/utility/graphql-client";
import qs from "qs";
import { useRouter } from "next/router";
import { softwareName, systemTagline } from "@/shared/settings";

import type { Container, Engine } from "tsparticles-engine";
import Particles from "react-tsparticles";
//import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
import { loadSlim } from "tsparticles-slim"; // if you are going to use `loadSlim`, install the "tsparticles-slim" package too.


type LoginType = "account";

const items: TabsProps["items"] = [
  {
    key: "account",
    label: "SyncPro Login",
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
    
  };

  const particlesInit = useCallback(async (engine: Engine) => {
    console.log(engine);
    await loadSlim(engine);
}, []);

const particlesLoaded = useCallback(async (container: Container | undefined) => {
    await console.log(container);
}, []);

const TitleCont = ({  title }: {title: string}) => {
  return (
    <div style={{
      color: "#ffffff"
    }}>
      <span>{title}</span>
      </div>
  );
};

  return (
    <ProConfigProvider hashed={false}>
      <ConfigProvider theme={theme} locale={enUS}>
        <div
          style={{
            backgroundColor: "white",
            height: "100vh",
            color: "white"
          }}>
          <LoginFormPage
          //  backgroundImageUrl="https://mdn.alipayobjects.com/huamei_gcee1x/afts/img/A*y0ZTS6WLwvgAAAAAAAAAAAAADml6AQ/fmt.webp"
          //  backgroundVideoUrl="/video/pexels-rodnae-productions.mp4"
            backgroundVideoUrl="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
            backgroundImageUrl="/images/bgImage-old.svg"
            logo={"/images/syncpro-logoword-white.png"}
            title={""}
            subTitle={<TitleCont title={systemTagline}/>}
            onFinish={onLogin}
            containerStyle={{
              backgroundColor: 'rgba(0, 0, 0,0.65)',
              backdropFilter: 'blur(4px)',
            }}
            onFinishFailed={onFinishFailed}
            initialValues={{
              username: devusername,
              password: devpassword,
            }}
            submitter={{
              searchConfig: {
                submitText: "Sign In",
              },
              submitButtonProps: {
                loading: loading,
                block: true,
                style: { backgroundColor: "#dc6601" },
              },
            }}
            actions={
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}>
                <Divider plain>
                  <span
                    style={{
                      color: "#CCC",
                      fontWeight: "normal",
                      fontSize: 14,
                    }}>
                    SyncPro Solutions
                  </span>
                </Divider>
                <Space align="center" size={24}>
                  <p
                    style={{
                      color: "#CCC",
                      fontWeight: "normal",
                      fontSize: 14,
                    }}>
                    By Signing In, you can access all information and documents.
                    Please be advised that you should carry this information
                    with outmost confidentiality.
                  </p>
                </Space>
              </div>
            }>
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
