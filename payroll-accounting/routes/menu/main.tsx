/* eslint-disable @next/next/no-img-element */
import { IPageProps } from '@/utility/interfaces'
import { Alert, Button, Divider } from 'antd'
import React from 'react'
import logo from '@/public/images/DTLogo.png'
import MenuCard from '@/components/menuCard'
import administrativeMenu from '@/components/sidebar/admininstrative'
import payroll from '@/components/sidebar/payroll'

import _ from 'lodash'
import { useDialog } from '@/hooks'
import ChangeCompanyModal from '@/components/companyChanger/companyChanger'
import { useRouter } from 'next/router'
import { accountingMenu } from '@/components/sidebar'

export default function MainMenu({ account }: IPageProps) {
  const roles = account.user.roles
  const router = useRouter()
  // ================= Modals =======================
  const modal = useDialog(ChangeCompanyModal)
  // ================= functions ====================
  const onChangeCompany = () => {
    modal({ account: account }, (e: any) => {
      if (e) {
        router.reload()
      }
    })
  }
  console.log('account =>>>', account)
  // ================= end fuctions =================
  return (
    <div className='w-full'>
      <Alert
        message={`Welcome back ${account.fullName}! 🎉`}
        description={
          <p>
            {`We're delighted to see you again and have the opportunity to
            continue supporting you. Your engagement is what drives us, and
            we're committed to making your experience here at DiverseTrade Suite
            truly exceptional. As you navigate through this session, remember
            that you're current company is`}
            <span className='font-bold'>
              {account.currentCompany?.companyName || 'N/A'}
            </span>
            {_.includes(roles, 'ROLE_ADMIN') && (
              <Button type='link' size='small' onClick={onChangeCompany}>
                Change Company
              </Button>
            )}
          </p>
        }
        type='success'
        showIcon
        // eslint-disable-next-line jsx-a11y/alt-text
        icon={<img src={logo.src} className='diverse-trade' />}
      />
      <Divider orientation='left'>Inventory Module</Divider>
      <div className='w-full'>
        <MenuCard menus={[]} />
      </div>
      <Divider orientation='left'>Accounting Module</Divider>
      <div className='w-full'>
        <MenuCard menus={accountingMenu} />
      </div>
      <Divider orientation='left'>Payroll Module</Divider>
      <div className='w-full'>
        <MenuCard menus={payroll} />
      </div>
      <Divider orientation='left'>Administrative Module</Divider>
      <div className='w-full'>
        <MenuCard menus={administrativeMenu} />
      </div>
    </div>
  )
}
