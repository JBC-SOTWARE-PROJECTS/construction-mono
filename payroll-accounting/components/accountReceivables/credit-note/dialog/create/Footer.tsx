import {
  SaveForApprovalItems,
  SaveItems,
} from '@/components/accountReceivables/helper/invoice-form'
import { CreditNoteStatusEnum } from '@/constant/accountReceivables'
import ConfirmationPasswordHook from '@/hooks/promptPassword'
import { CaretDownOutlined, EyeFilled, LikeOutlined } from '@ant-design/icons'
import { Button, Dropdown, MenuProps, Popconfirm, Space, message } from 'antd'
import { CreditNCreateContextProps } from './CreditNCreate'
import { onCNHandlePreview } from './functions'
import { ModalStyle } from './styles'
// import PermissionManager from '@/components/accessControl/helper'
import { useContext } from 'react'
import { AccountContext } from '@/components/accessControl/AccountContext'

export default function CNFooter(props: CreditNCreateContextProps) {
  const { state, form, mutation, loading } = props

  const [showPasswordConfirmation] = ConfirmationPasswordHook()
  const account = useContext(AccountContext)

  const onHandlePreview = () => {
    onCNHandlePreview(state.id)
  }

  const confirmApprove = (e?: React.MouseEvent<HTMLElement>) => {
    showPasswordConfirmation(() => {
      const values = form?.getFieldsValue()

      mutation?.creditNoteItemMultiUpdate({
        variables: {
          id: state?.id,
          fields: state.dataSource,
        },
        onCompleted: () => {
          mutation?.createCreditNote({
            variables: {
              id: state?.id,
              fields: {
                ...values,
                status: CreditNoteStatusEnum.UNAPPLIED,
              },
            },
            onCompleted: ({
              creditNote: { success, message: messageText },
            }: any) => {
              if (success) message.success(messageText)
              else message.error(messageText)

              props.hide(false)
            },
          })
        },
      })
    })
  }

  const handleMenuSaveClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case 'submit-approval':
        const values = form?.getFieldsValue()
        mutation?.creditNoteItemMultiUpdate({
          variables: {
            id: state?.id,
            fields: state.dataSource,
          },
          onCompleted: () => {
            mutation?.createCreditNote({
              variables: {
                id: state?.id,
                fields: {
                  ...values,
                  status: CreditNoteStatusEnum.APPROVAL_IN_PROGRESS,
                },
              },
              onCompleted: () => props.hide(false),
            })
          },
        })
      default:
        return null
    }
  }

  const handleSaveClose = () => {
    const values = form?.getFieldsValue()

    mutation?.creditNoteItemMultiUpdate({
      variables: {
        id: state?.id,
        fields: state.dataSource,
      },
      onCompleted: () => {
        mutation?.createCreditNote({
          variables: {
            id: state?.id,
            fields: {
              ...values,
            },
          },
          onCompleted: () => props.hide(false),
        })
      },
    })
  }

  const saveMenuProps = {
    items:
      state.status == CreditNoteStatusEnum.DRAFT
        ? SaveItems
        : SaveForApprovalItems,
    onClick: handleMenuSaveClick,
  }

  return (
    <ModalStyle>
      <div className='footer'>
        <Button
          type='primary'
          size='large'
          style={{ background: '#db2828', float: 'left' }}
          onClick={() => props.hide(false)}
        >
          Close
        </Button>
        <Space>
          {state.status == CreditNoteStatusEnum.POSTED && (
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

          {state.status == CreditNoteStatusEnum.APPROVAL_IN_PROGRESS && (
            <Button size='large' onClick={handleSaveClose}>
              Save & Close
            </Button>
          )}

          {state.status == CreditNoteStatusEnum.DRAFT && (
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
            CreditNoteStatusEnum.APPROVAL_IN_PROGRESS.toString(),
            CreditNoteStatusEnum.DRAFT.toString(),
          ].includes(state?.status ?? '') && (
            // <PermissionManager
            //   account={account}
            //   permission='allow_user_to_approve_ar_credit_note'
            // >
            <Popconfirm
              title='Approve Credit Note'
              description='Are you sure you want to approve this Credit Note?'
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
                loading={loading?.creditNotePosting}
              >
                Approve
              </Button>
            </Popconfirm>
            // </PermissionManager>
          )}
        </Space>
      </div>
    </ModalStyle>
  )
}
