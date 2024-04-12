import { Button, ButtonProps, Skeleton } from "antd"
import { SkeletonButtonProps } from "antd/es/skeleton/Button"
import React from "react"

interface Props extends ButtonProps {
  skeleton?: boolean
  loadingProps?: SkeletonButtonProps
}

const SkeletonButton = ({ loadingProps, skeleton, ...props }: Props) => {
  if (props.loading && skeleton)
    return <Skeleton.Button {...{ block: true, ...loadingProps }} />
  return <Button {...props} />
}

export default SkeletonButton
