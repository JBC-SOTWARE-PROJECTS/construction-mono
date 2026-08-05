import { Button, ButtonProps } from "antd"
import { CSSProperties } from "react"

type btnStatus = "CSV-DOWNLOAD" | "POSTING"

interface StatusButtonProps extends ButtonProps {
  status?: btnStatus
}

function getStatusColor(status?: btnStatus): CSSProperties {
  const styleColor: CSSProperties = {}

  switch (status) {
    case "CSV-DOWNLOAD":
      styleColor.background = "#84cc16"
      break
    case "POSTING":
      styleColor.background = "#f97316"
      break
    default:
      break
  }

  return styleColor
}

const StatusButton = (props: StatusButtonProps) => {
  const { status, ...restProps } = props

  return <Button style={getStatusColor(status)} {...restProps} />
}

export default StatusButton
