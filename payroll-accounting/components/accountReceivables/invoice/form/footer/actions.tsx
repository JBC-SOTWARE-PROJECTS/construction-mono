import {
  CaretDownOutlined,
  DeleteOutlined,
  DislikeOutlined,
  EyeFilled,
  LikeOutlined,
} from '@ant-design/icons'
import { Button, Dropdown, Popconfirm, Space, message } from 'antd'
import styled from 'styled-components'
import type { FormInstance, MenuProps } from 'antd'
import {
  ApproveItems,
  SaveForApprovalItems,
  SaveItems,
} from '@/components/accountReceivables/helper/invoice-form'
import { StateI } from '..'
import { ArInvoice } from '@/graphql/gql/graphql'
import { apiUrlPrefix } from '@/shared/settings'
import { InvoiceStatusEnum } from '@/constant/accountReceivables'
import { useMutation } from '@apollo/client'
import {
  CREATE_INVOICE,
  SUBMIT_INVOICE,
  VOID_INVOICE,
} from '@/graphql/accountReceivables/invoices'
import ConfirmationPasswordHook from '@/hooks/promptPassword'

interface InvoiceFooterActionsI {
  state: StateI
  hide: any
  form: FormInstance<any>
}

export default function InvoiceFooterActions(props: InvoiceFooterActionsI) {
  const { state, form, hide } = props
  const { id } = state

  const [showPasswordConfirmation] = ConfirmationPasswordHook()

  const [onPostInvoice, { loading: postingLoading }] =
    useMutation(SUBMIT_INVOICE)

  const [onMutateInvoice, { loading: loadingCreateInvoice }] =
    useMutation(CREATE_INVOICE)

  const [onRemoveInvoice, { loading: removeInvoiceLoading }] =
    useMutation(VOID_INVOICE)

  const handleSaveClose = () => {
    const values = form.getFieldsValue()
    onMutateInvoice({
      variables: {
        id,
        fields: {
          ...values,
        },
      },
      onCompleted: () => hide(false),
    })
  }

  const handleMenuSaveClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case 'submit-approval':
        const values = form.getFieldsValue()
        onMutateInvoice({
          variables: {
            id,
            fields: {
              ...values,
              status: InvoiceStatusEnum.APPROVAL_IN_PROGRESS,
            },
          },
          onCompleted: () => hide(false),
        })
      default:
        return null
    }
  }

  const saveMenuProps = {
    items:
      state.status == InvoiceStatusEnum.DRAFT
        ? SaveItems
        : SaveForApprovalItems,
    onClick: handleMenuSaveClick,
  }

  const confirmVoid = (e?: React.MouseEvent<HTMLElement>) => {
    showPasswordConfirmation(() => {
      onRemoveInvoice({
        variables: { id },
        onCompleted: ({ invoice: { success, message: messageText } }) => {
          if (success) message.success(messageText)
          else message.error(messageText)

          hide(false)
        },
      })
    })
  }

  const confirmApprove = (e?: React.MouseEvent<HTMLElement>) => {
    showPasswordConfirmation(() => {
      const values = form.getFieldsValue()
      onPostInvoice({
        variables: {
          id,
          fields: {
            ...values,
          },
          entryPosting: true,
        },
        onCompleted: ({ invoice: { success, message: messageText } }) => {
          if (success) message.success(messageText)
          else message.error(messageText)

          hide(false)
        },
      })
    })
  }

  const onHandlePreview = () => {
    window.open(apiUrlPrefix + '/arreports/arinvoice?id=' + id, 'invoice')
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
        <Space>
          {state.status == InvoiceStatusEnum.PENDING && (
            <Button
              type='link'
              size='large'
              style={{ color: 'white' }}
              icon={<EyeFilled />}
              onClick={onHandlePreview}
            >
              Print or Preview
            </Button>
          )}

          {[
            InvoiceStatusEnum.APPROVAL_IN_PROGRESS.toString(),
            InvoiceStatusEnum.DRAFT.toString(),
          ] && (
            <Dropdown.Button
              menu={saveMenuProps}
              placement='bottomRight'
              icon={
                <CaretDownOutlined
                  style={{ fontSize: '15px', color: 'white' }}
                />
              }
              size='large'
              type='primary'
              style={{ display: 'inline-block' }}
              onClick={handleSaveClose}
            >
              Save & Close
            </Dropdown.Button>
          )}

          {[
            InvoiceStatusEnum.APPROVAL_IN_PROGRESS.toString(),
            InvoiceStatusEnum.DRAFT.toString(),
          ].includes(state?.status ?? '') && (
            <Popconfirm
              title='Approve Invoice'
              description='Are you sure you want to approve this invoice?'
              onConfirm={confirmApprove}
              okText='Yes'
              cancelText='No'
              okButtonProps={{ loading: false }}
            >
              <Button
                danger
                type='dashed'
                icon={<LikeOutlined />}
                size='large'
                loading={postingLoading}
              >
                Approve
              </Button>
            </Popconfirm>
          )}

          {state.status == InvoiceStatusEnum.PENDING && (
            <Popconfirm
              title='Void Invoice'
              description='Are you sure you want to void this invoice?'
              onConfirm={confirmVoid}
              okText='Yes'
              cancelText='No'
              okButtonProps={{ loading: false }}
            >
              <Button
                danger
                type='dashed'
                icon={<DislikeOutlined />}
                size='large'
                loading={removeInvoiceLoading}
              >
                Void
              </Button>
            </Popconfirm>
          )}
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
