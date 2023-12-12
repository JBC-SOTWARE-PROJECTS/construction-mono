import { FixedAssetItems } from '@/graphql/gql/graphql'
import ConfirmationPasswordHook from '@/hooks/promptPassword'
import { gql, useMutation } from '@apollo/client'
import type { FormInstance } from 'antd'
import { Button, Checkbox, Space, message } from 'antd'
import styled from 'styled-components'

interface MultiFixedAssetItemFooterI {
  hide: any
  form: FormInstance<any>
  isBegBal: any
  setIsBegBal: any
  dataSource: FixedAssetItems[]
}

const CREATE_FIXED_ASSET_GQL = gql`
  mutation ($fields: [Map_String_ObjectScalar]) {
    fixedAssets: upsertMultiFixedAssetItems(fields: $fields) {
      success
    }
  }
`

export default function MultiFixedAssetItemFooter(
  props: MultiFixedAssetItemFooterI
) {
  const { form, hide, isBegBal, setIsBegBal, dataSource } = props

  const [showPasswordConfirmation] = ConfirmationPasswordHook()

  const [createFixedAsset, { loading }] = useMutation(CREATE_FIXED_ASSET_GQL)

  const onHandleBegBalCheckbox = () => {
    setIsBegBal(!isBegBal)
  }

  const onCreateFixedAsset = () => {
    createFixedAsset({
      variables: {
        fields: dataSource,
      },
      onCompleted: (data) => {
        const fixedAssets = data?.fixedAssets
        if (fixedAssets?.success) message.success('Successfully saved.')
        hide()
      },
    })
  }

  return (
    <ModalStyle>
      <div className='footer'>
        <Button
          type='primary'
          size='large'
          style={{ background: '#db2828', float: 'left' }}
          onClick={() => hide(false)}
        >
          Close
        </Button>
        <Space style={{ marginRight: 80 }}>
          <Checkbox checked={isBegBal} onChange={onHandleBegBalCheckbox}>
            <b style={{ color: 'white' }}>Is Beginning Balance</b>
          </Checkbox>
          <Button size='large' type='primary' onClick={onCreateFixedAsset}>
            Create
          </Button>
        </Space>
      </div>
    </ModalStyle>
  )
}

export const ModalStyle = styled.div`
  .footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    color: #333;
    text-align: right;
    padding: 10px;
    z-index: 99;
    padding-left: 14px;
    padding-right: 18px;
    transition: all 0.3s ease !important;
  }
`
