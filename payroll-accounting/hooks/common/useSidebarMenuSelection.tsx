import React, { ReactNode, useState, useEffect } from "react";
import { MenuOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

interface Route {
  path?: string;
  name?: string;
  icon?: ReactNode; // Type annotation indicating it can be a React node
  parentKeys?: string[];
  hideInMenu?: boolean;
  menuRender?: boolean;
}

interface Location {
  pathname: string;
}

interface SidebarProps {
  route: Route;
  location: Location;
}

interface UseSidebarMenuSelectionReturn {
  layout: "top" | "side" | "mix" | undefined;
  sidebar: SidebarProps;
}

const defaultSidebar = {
  route: {
    path: "/",
    routes: [
      {
        path: "/",
        name: "Main Menu",
        icon: <MenuOutlined />,
      },
    ],
  },
  location: {
    pathname: "/",
  },
};

const WITH_ROUTER_QUERY = ["project-details"];

export default function UseSidebarMenuSelection(
  module: string,
  subModule: string
): UseSidebarMenuSelectionReturn {
  const [sidebar, setSidebar] = useState(null);
  const router = useRouter();
  const { query } = router;

  useEffect(() => {
    import(`@/components/layout/moduleSideBar/${module}/${subModule}`)
      .then((module: any) => {
        if (!WITH_ROUTER_QUERY.includes(subModule)) {
          setSidebar(module.default);
        } else {
          setSidebar(module.default(query?.id));
        }
      })
      .catch((error) => {
        setSidebar(null);
      });
  }, [module, subModule]);

  if (sidebar) return { layout: "mix", sidebar };
  else return { layout: "top", sidebar: defaultSidebar };
}
