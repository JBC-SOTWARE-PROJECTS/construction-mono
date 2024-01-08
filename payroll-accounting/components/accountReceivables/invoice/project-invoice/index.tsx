import { Modal } from 'antd'
import { CustomModalTitle } from '../../common/modalPageHeader'

export default function ProjectInvoice() {
  return (
    <Modal
      open
      title={
        <CustomModalTitle
          editing={false}
          title={{
            onNew: 'New Invoice',
            onEdit: 'Edit Invoice',
          }}
          subTitle={{
            onNew: 'Add a contact to start saving the invoice.',
            onEdit: 'Changes have been saved in the draft',
          }}
        />
      }
      width={'100%'}
      style={{
        top: 20,
        border: 'none',
        boxShadow: 'none',
        marginBottom: 100,
      }}
      maskStyle={{ background: '#f2f3f4' }}
      className='full-page-modal'
      footer={<></>}
    ></Modal>
  )
}
