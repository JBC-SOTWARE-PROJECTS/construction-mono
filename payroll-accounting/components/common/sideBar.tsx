import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { useRouter } from "next/router";

const { Sider, Content } = Layout;

interface SidebarMenuItem {
  path: string;
  icon: React.ReactNode;
  label: string;
  content: React.ReactNode;
}

interface SidebarProps {
  menuItems?: SidebarMenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ menuItems = [] }) => {
  const { asPath, push } = useRouter();
  const [selectedContent, setSelectedContent] =
    useState<React.ReactNode | null>(null);

  const onClick = (e: any) => {
    const selectedMenuItem = menuItems.find((item) => item.path === e.key);
    if (selectedMenuItem) {
      setSelectedContent(selectedMenuItem.content);
    }
  };

  return (
    <Layout>
      <Sider
        style={{
          marginTop: "56px",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
        breakpoint="lg"
        collapsedWidth="0"
      >
        <Menu
          mode="inline"
          onClick={onClick}
          defaultSelectedKeys={[asPath]}
          defaultOpenKeys={["sub1"]}
          style={{ height: "100%", borderRight: 0 }}
        >
          {menuItems.map((item) => (
            <Menu.Item key={item.path} icon={item.icon}>
              {item.label}
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout className="site-layout" style={{ marginLeft: 200 }}>
        <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
          {selectedContent}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Sidebar;
