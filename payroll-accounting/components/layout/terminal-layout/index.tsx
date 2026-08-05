import theme from "@/theme/themeConfig"
import { IUserEmployee } from "@/utility/interfaces"
import { ExclamationCircleOutlined } from "@ant-design/icons"
import type { ProSettings } from "@ant-design/pro-components"
import { ProConfigProvider } from "@ant-design/pro-components"
import { App, ConfigProvider, Drawer, Empty, Modal } from "antd"
import { useRouter } from "next/router"
import { ReactNode, useEffect, useState } from "react"
// import defaultProps from "@/components/sidebar/_defaultProps";
import useLogout from "@/hooks/useLogout"
import enUS from "antd/locale/en_US"
import dayjs from "dayjs"
import "dayjs/locale/en" // Import the English locale
import relativeTime from "dayjs/plugin/relativeTime"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import CircularProgress from "@/components/circularProgress"

interface IProps {
  account: IUserEmployee
  children: ReactNode
}

const AVATAR: any = {
  MALE: "/images/avatar-male.png",
  FEMALE: "/images/avatar-female.png",
}

const BackOfficeTerminalLayout = (props: IProps) => {
  const { children, account } = props
  const router = useRouter()
  const logOut = useLogout()
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const [pathname, setPathname] = useState(router.pathname || "/")

  useEffect(() => {
    if (router.pathname) {
      setPathname(router.pathname)
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    dayjs.locale("en") // Set the locale for dayjs
    dayjs.extend(utc)
    dayjs.extend(timezone)
    dayjs.extend(relativeTime)
    dayjs.tz.setDefault("Asia/Manila")
  }, [])

  const onClose = () => {
    setOpen(false)
  }

  if (typeof document === "undefined") {
    return <CircularProgress />
  }

  return (
    <div
      id="backoffice-layout"
      style={{
        height: "calc(100vh - 19px)",
        overflow: "auto",
      }}
    >
      <ProConfigProvider hashed={false}>
        <ConfigProvider
          locale={enUS}
          theme={theme}
          getTargetContainer={() => {
            return document.getElementById("backoffice-layout") || document.body
          }}
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
        </ConfigProvider>
      </ProConfigProvider>
    </div>
  )
}

export default BackOfficeTerminalLayout
