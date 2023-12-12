import React, { useState, useEffect, ReactNode, ReactElement } from 'react'
import { TerminalProvider, TerminalConsumer } from './TerminalContext'
import axios from 'axios'
import { Alert, Result, Spin } from 'antd'

interface TerminalManagerI {
  children: ReactNode
}
export default function TerminalManager(props: TerminalManagerI) {
  const [macAddress, setMacAddress] = useState<any>('44-AF-28-8F-AC-4B')

  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  // useEffect(() => {
  //   setLoading(true)
  //   axios
  //     .get('https://hisd3.lvh.me:4567/macaddress')
  //     .then((response) => {
  //       setLoading(false)
  //       setMacAddress(response.data)
  //     })
  //     .catch((error) => {
  //       setLoading(false)
  //       setError(true)
  //     })
  // }, [])

  if (loading)
    return (
      <Spin tip='Loading...'>
        <Alert
          message='Please wait..'
          description="Please don't reload or close this browser."
          type='info'
        />
      </Spin>
    )

  if (error) {
    return (
      <Result
        status='500'
        title='500'
        subTitle='There were some error connecting to HISD3 App Service'
        extra={
          <ul style={{ listStyleType: 'none' }}>
            <li>
              Make sure you run the HISD3 App. Download at
              http://cm.hisd3.com/services/hisd3Service.jar
            </li>
            <li>
              Confirm that you have imported Root Cert to your browser. Download
              at http://cm.hisd3.com/services/minica.crt
            </li>
          </ul>
        }
      />
    )
  }

  if (!macAddress) return <div />

  return (
    <TerminalProvider value={macAddress}>
      <TerminalConsumer>
        {(value) => {
          const childrenWithProps = React.Children.map(
            props.children,
            (child) => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child as ReactElement, {
                  ...(child.props as Record<string, any>),
                  macAddress: value,
                })
              }
            }
          )
          return <>{childrenWithProps}</>
        }}
      </TerminalConsumer>
    </TerminalProvider>
  )
}
