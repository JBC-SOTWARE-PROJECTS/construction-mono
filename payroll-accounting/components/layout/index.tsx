import React, { ReactNode, useEffect, useState } from "react";
import {
  ExclamationCircleOutlined,
  LogoutOutlined,
  SettingFilled,
  AlertOutlined,
} from "@ant-design/icons";
import type { ProSettings } from "@ant-design/pro-components";
import { ProConfigProvider, ProLayout } from "@ant-design/pro-components";
import {
  Badge,
  Button,
  ConfigProvider,
  Drawer,
  Dropdown,
  Empty,
  Modal,
  App,
} from "antd";
import theme from "@/theme/themeConfig";
import { IUserEmployee } from "@/utility/interfaces";
import { useRouter } from "next/router";
import CircularProgress from "../circularProgress";
import useLogout from "@/hooks/useLogout";
import enUS from "antd/locale/en_US";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/en"; // Import the English locale
import { useSidebarMenuSelection } from "@/hooks/common";
import { softwareName, systemTagline } from "@/shared/settings";
import { isCashieringTerminal } from "./moduleSideBar/accounting/cashier";
interface IProps {
  account: IUserEmployee;
  children: ReactNode;
}

const DiverseTradeLayout = (props: IProps) => {
  const { children, account } = props;
  const router = useRouter();
  const logOut = useLogout();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  // const [mobile, setMobile] = useState(false);

  const routerSplit = router.pathname.split("/");
  const modulePath = routerSplit[1];
  const subModulePath = routerSplit[2];

  const { layout, sidebar } = useSidebarMenuSelection(
    modulePath,
    subModulePath
  );
  const settings: Partial<ProSettings> | undefined = {
    fixSiderbar: true,
    layout,
    splitMenus: false,
    navTheme: "light",
    contentWidth: "Fixed",
    colorPrimary: "#399b53",
    fixedHeader: true,
    siderMenuType: "group",
    footerRender: false,
    suppressSiderWhenMenuEmpty: true,
  };

  const [pathname, setPathname] = useState(router.pathname || "/");

  useEffect(() => {
    if (router.pathname) {
      setPathname(router.pathname);
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    dayjs.locale("en"); // Set the locale for dayjs
    dayjs.extend(timezone);
    dayjs.extend(relativeTime);
  }, []);

  if (typeof document === "undefined") {
    return <CircularProgress />;
  }

  const confirm = () => {
    Modal.confirm({
      title: "Are you sure you want to logout?",
      content: "Please click ok to continue",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        return new Promise((resolve, reject) => {
          resolve(logOut());
        }).catch(() => console.log("Oops errors!"));
      },
      onCancel() {},
    });
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const isTerminal = isCashieringTerminal(router.asPath);

  return (
    <div
      id="diversetrade-layout"
      style={{
        height: "100vh",
        overflow: "auto",
      }}
    >
      <ProConfigProvider hashed={false} token={theme.token}>
        <ConfigProvider
          locale={enUS}
          theme={theme}
          getTargetContainer={() => {
            return (
              document.getElementById("diversetrade-layout") || document.body
            );
          }}
        >
          <ProLayout
            menuRender={(props, defaultDom) =>
              !isTerminal ? defaultDom : null
            }
            loading={loading}
            //title={""}
            title={softwareName}
            logo="/images/DTLogo.svg"
            prefixCls="my-prefix"
            {...sidebar}
            bgLayoutImgList={[
              {
                src: "https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png",
                left: 85,
                bottom: 100,
                height: "303px",
              },
              {
                src: "https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png",
                bottom: -68,
                right: -45,
                height: "303px",
              },
              {
                src: "https://img.alicdn.com/imgextra/i3/O1CN018NxReL1shX85Yz6Cx_!!6000000005798-2-tps-884-496.png",
                bottom: 0,
                left: 0,
                width: "331px",
              },
            ]}
            location={{
              pathname,
            }}
            token={{
              header: {
                colorBgMenuItemSelected: "rgba(0,0,0,0.04)",
              },
            }}
            locale="en-US"
            siderMenuType="group"
            menu={{
              collapsedShowGroupTitle: true,
            }}
            avatarProps={{
              src:
                account.gender === "MALE"
                  ? "/images/avatar-male.png"
                  : "/images/avatar-female.png",
              size: "small",
              title: account.user.login ?? "",
              render: (props, dom) => {
                return (
                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: "logout",
                          icon: <LogoutOutlined />,
                          label: "Logout",
                          onClick: confirm,
                        },
                      ],
                    }}
                  >
                    {dom}
                  </Dropdown>
                );
              },
            }}
            actionsRender={(props) => {
              if (props.isMobile) {
                return [
                  <Button
                    key="notification-mobile-badge"
                    size="small"
                    type="link"
                    onClick={showDrawer}
                    className="notification-badge"
                  >
                    <Badge size="small" count={0}>
                      <AlertOutlined key="AlertOutlined" />
                    </Badge>
                  </Button>,
                ];
              }
              if (typeof window === "undefined") {
                return [];
              } else {
                return [
                  <SettingFilled key="GithubFilled" />,
                  <Button
                    key="notification-badge"
                    size="small"
                    type="link"
                    onClick={showDrawer}
                    className="notification-badge"
                  >
                    <Badge size="small" count={0}>
                      <AlertOutlined key="AlertOutlined" />
                    </Badge>
                  </Button>,
                ];
              }
            }}
            headerTitleRender={(logo, title, _) => {
              const defaultDom = (
                <a className="logo-font">
                  {logo}
                  <span className="custom-title">{title}</span>
                </a>
              );
              if (typeof window === "undefined") return defaultDom;
              if (document.body.clientWidth < 1400) {
                return defaultDom;
              }
              if (_.isMobile) return defaultDom;
              return <>{defaultDom}</>;
            }}
            menuFooterRender={(props) => {
              if (props?.collapsed) return undefined;
              return (
                <div
                  style={{
                    textAlign: "center",
                    paddingBlockStart: 12,
                  }}
                >
                  <div>
                    © 2024 {softwareName} <sup>+</sup>
                  </div>
                  {/* <div>{systemTagline}</div> */}
                </div>
              );
            }}
            onMenuHeaderClick={() => router.push("/")}
            menuItemRender={(item, dom) => (
              <div
                onClick={() => {
                  setLoading(true);
                  let path = item.path || "/";
                  router.push(path);
                }}
              >
                {dom}
              </div>
            )}
            {...settings}
          >
            <App>
              {children}
              <Drawer
                title="App Notifications"
                placement="right"
                closable={false}
                onClose={onClose}
                open={open}
                key="right"
              >
                <Empty />
              </Drawer>
            </App>
          </ProLayout>
        </ConfigProvider>
      </ProConfigProvider>
    </div>
  );
};

export default DiverseTradeLayout;
