import asyncComponent from '@/utility/asyncComponent'
import React, { ReactNode, useState, useEffect } from 'react'
import { MenuOutlined } from '@ant-design/icons'

interface Route {
  path?: string
  name?: string
  icon?: ReactNode // Type annotation indicating it can be a React node
}

interface Location {
  pathname: string
}

interface SidebarProps {
  route: Route
  location: Location
}

interface UseSidebarMenuSelectionReturn {
  layout: 'top' | 'side' | 'mix' | undefined
  sidebar: SidebarProps
}

const defaultSidebar = {
  route: {
    path: '/',
    routes: [
      {
        path: '/',
        name: 'Main Menu',
        icon: <MenuOutlined />,
      },
    ],
  },
  location: {
    pathname: '/',
  },
}

export default function UseSidebarMenuSelection(
  module: string,
  subModule: string
): UseSidebarMenuSelectionReturn {
  const [sidebar, setSidebar] = useState(null)

  useEffect(() => {
    import(`@/components/layout/moduleSideBar/${module}/${subModule}`)
      .then((module) => {
        setSidebar(module.default)
      })
      .catch((error) => {
        setSidebar(null)
      })
  }, [module, subModule])

  if (sidebar) return { layout: 'side', sidebar }
  else return { layout: 'top', sidebar: defaultSidebar }
}
