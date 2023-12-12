import { FormInput, FormSelect } from '@/components/common'
import { gql, useMutation, useQuery } from '@apollo/client'
import { Button, Col, Form, Modal, Row } from 'antd'
import _ from 'lodash'
import { useState } from 'react'

const UPSERT_RECORD = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsert: addTerminal(id: $id, fields: $fields) {
      id
    }
  }
`

const CASHIER = gql`
  query ($role: String, $filter: String) {
    cashier: searchEmployeesByRole(role: $role, filter: $filter) {
      value: id
      label: fullName
    }
  }
`

const TerminalForm = ({ visible, hide, ...props }: any) => {
  const [formError, setFormError] = useState({})

  const { loading, data } = useQuery(CASHIER, {
    variables: {
      role: 'ROLE_CASHIER',
      filter: '',
    },
    fetchPolicy: 'network-only',
  })
  {
    /* error = { errorTitle: "", errorMsg: ""}*/
  }

  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.upsert?.id)) {
          if (props?.id) {
            hide('Terminal Information Updated')
          } else {
            hide('Terminal Information Added')
          }
        }
      },
    }
  )

  //======================= =================== =================================================//

  const onSubmit = (data: any) => {
    let payload = _.clone(data)
    payload.employee = { id: data.employee }
    upsertRecord({
      variables: {
        id: props?.id,
        fields: payload,
      },
    })
  }

  return (
    <Modal
      width={'30%'}
      title={'Terminal Information'}
      open
      footer={[
        <Button key='back' onClick={() => hide()} danger>
          Return
        </Button>,
        <Button
          form='terminalForm'
          key='submit'
          htmlType='submit'
          type='primary'
          loading={upsertLoading}
        >
          Submit
        </Button>,
      ]}
    >
      <Form
        name='terminalForm'
        id='terminalForm'
        onFinish={onSubmit}
        className='form-card'
      >
        <Row>
          <Col span={24}>
            <FormInput
              label={'Terminal No'}
              name='terminal_no'
              initialValue={props?.terminal_no}
              propsinput={{
                placeholder: 'AUTO GENERATE',
                disabled: true,
              }}
            />
          </Col>
          <Col span={24}>
            <FormInput
              label={'Description'}
              rules={[{ required: true, message: 'This Field is required' }]}
              name='description'
              initialValue={props?.description}
              propsinput={{
                placeholder: 'Description',
              }}
            />
          </Col>
          <Col span={24}>
            <FormInput
              label={'MAC Address'}
              rules={[{ required: true, message: 'This Field is required' }]}
              name='mac_address'
              initialValue={props?.mac_address}
              propsinput={{
                placeholder: 'e.g 48-F1-7F-DB-CC-39',
              }}
            />
          </Col>
          <Col span={24}>
            <FormSelect
              label={'Assign Cashier'}
              rules={[{ required: true, message: 'This Field is required' }]}
              initialValue={props?.employee?.id}
              name='employee'
              propsselect={{
                loading: loading,
                placeholder: 'Assign Cashier',
                options: _.get(data, 'cashier'),
              }}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default TerminalForm
