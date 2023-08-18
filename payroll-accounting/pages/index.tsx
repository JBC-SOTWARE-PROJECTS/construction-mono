import React from 'react'
import { IPageProps } from '@/utility/interfaces'

export default function index({ account }: IPageProps) {
  return <h1>Welcome {account.fullName}</h1>
}
