import asyncComponent from '@/utility/asyncComponent';
import React from 'react'

type Props = {}

const ViewAssetComponent = asyncComponent(
    () => import("@/routes/inventory/assets/asset")
);
  

export default function ViewAsset({}: Props) {
  return (
    <ViewAssetComponent/>
  )
}