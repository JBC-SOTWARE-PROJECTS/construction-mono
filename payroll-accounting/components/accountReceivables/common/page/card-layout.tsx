import { SearchOutlined, SyncOutlined } from '@ant-design/icons'
import { Button, Card, Divider, Dropdown, Input, Space, Tooltip } from 'antd'
import { ReactNode, useState } from 'react'

interface CardLayoutI {
  onSearch?: (param: string) => void
  extra?: ReactNode
  children: ReactNode
}
export default function CardLayout(props: CardLayoutI) {
  const [state, setState] = useState('')

  const onSearch = (param: string) => {
    props?.onSearch?.(param)
  }

  const onRefresh = () => {
    props?.onSearch?.('')
  }

  const onHideSearch = () => {
    setState('')
  }

  return (
    <Card
      title={
        state == 'SEARCH' ? (
          <Input.Search
            autoFocus
            placeholder='Search invoice #'
            allowClear
            onSearch={onSearch}
            onBlur={onHideSearch}
            style={{ width: '70%' }}
          />
        ) : null
      }
      extra={[
        <Space key='controls' split={<Divider type='vertical' />}>
          <Tooltip title='Click to Reset/Refresh'>
            <Button type='text' icon={<SyncOutlined />} onClick={onRefresh} />
          </Tooltip>

          {state != 'SEARCH' && (
            <Tooltip title='Click to Search'>
              <Button
                type='text'
                icon={<SearchOutlined />}
                onClick={() => setState('SEARCH')}
              />
            </Tooltip>
          )}

          {props?.extra}
        </Space>,
      ]}
    >
      {props?.children}
    </Card>
  )
}
