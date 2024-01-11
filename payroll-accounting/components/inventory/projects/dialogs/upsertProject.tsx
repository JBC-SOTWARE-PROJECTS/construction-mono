import React from 'react'
import { JobStatus, Projects } from '@/graphql/gql/graphql'
import { SaveOutlined } from '@ant-design/icons'
import { useMutation } from '@apollo/client'
import {
  Alert,
  Button,
  Col,
  Divider,
  Form,
  Modal,
  Row,
  Space,
  Typography,
  message,
} from 'antd'
import _ from 'lodash'
import { requiredField } from '@/utility/helper'
import {
  FormInput,
  FormSelect,
  FormDatePicker,
  FormTextArea,
  FormColorPicker,
} from '@/components/common'
import { responsiveColumn3, responsiveColumn4 } from '@/utility/constant'
import {
  useClients,
  useProjectStatus,
  useProjectStatusList,
} from '@/hooks/inventory'
import { getRandomColor } from '@/hooks/accountReceivables/commons'
import dayjs from 'dayjs'
import { useOffices } from '@/hooks/payables'
import { UPSERT_RECORD_PROJECT } from '@/graphql/inventory/project-queries'

interface IProps {
  hide: (hideProps: any) => void
  record?: Projects | null | undefined
}

export default function UpsertProject(props: IProps) {
  const { hide, record } = props
  const [form] = Form.useForm()

  // ===================== Queries ==============================
  const offices = useOffices()
  const clients = useClients()
  const statusList = useProjectStatus()
  const statusRaw = useProjectStatusList()
  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD_PROJECT,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (data?.upsertProject?.id) {
          hide('Project created successfully')
        }
      },
    }
  )

  //================== functions ====================

  const onFinishFailed = () => {
    message.error('Something went wrong. Please contact administrator.')
  }

  const onSubmit = (data: any) => {
    let payload = _.clone(data)
    let objStatus = _.find(statusRaw, {
      description: data?.status,
    }) as JobStatus
    payload.customer = { id: data?.customer }
    payload.location = { id: data?.location }
    payload.disabledEditing = objStatus?.disabledEditing
    payload.projectStatusColor = objStatus?.statusColor

    upsertRecord({
      variables: {
        id: record?.id,
        fields: payload,
      },
    })
  }

  return (
    <Modal
      title={
        <Typography.Title level={4}>
          <Space align='center'>Project Information</Space>
        </Typography.Title>
      }
      destroyOnClose={true}
      maskClosable={false}
      open={true}
      width={'100%'}
      style={{ maxWidth: '1200px' }}
      onCancel={() => hide(false)}
      footer={
        <Space>
          <Button
            type='primary'
            size='large'
            htmlType='submit'
            form='upsertForm'
            loading={upsertLoading}
            icon={<SaveOutlined />}
          >
            {`${record?.id ? 'Save Changes' : 'Save'} & Close`}
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        name='upsertForm'
        layout='vertical'
        onFinish={onSubmit}
        onFinishFailed={onFinishFailed}
        initialValues={{
          ...record,
          customer: record?.customer?.id ?? null,
          location: record?.location?.id ?? null,
          projectStarted: dayjs(record?.projectStarted ?? new Date()),
          projectEnded: dayjs(record?.projectEnded ?? new Date()),
          projectColor: record?.projectColor ?? getRandomColor(),
        }}
      >
        <Row gutter={[8, 0]}>
          <Col span={24} style={{ marginBottom: 10 }}>
            <Alert
              type='info'
              message='Note: Project Prefix Code will be appended each time there are Purchase Requests, Purchase Orders, and Delivery Receiving in this project, concatenated with the respective series number.'
            />
          </Col>
          <Col {...responsiveColumn4}>
            <FormInput
              name='prefixShortName'
              rules={requiredField}
              label='Project Prefix Code'
              propsinput={{
                disabled: record?.id ? true : false,
                placeholder: 'Project Short Name e.g INC',
              }}
            />
          </Col>
          <Col {...responsiveColumn4}>
            <FormInput
              name='projectCode'
              label='Project Number'
              propsinput={{
                disabled: true,
                placeholder: 'Project # (Auto Generated)',
              }}
            />
          </Col>
          <Col {...responsiveColumn4}>
            <FormDatePicker
              label='Project Start Date'
              name='projectStarted'
              rules={requiredField}
              propsdatepicker={{
                allowClear: false,
                placeholder: 'Project Start Date',
              }}
            />
          </Col>
          <Col {...responsiveColumn4}>
            <FormDatePicker
              label='Estimate Proj. End Date'
              name='projectEnded'
              rules={requiredField}
              propsdatepicker={{
                allowClear: false,
                placeholder: 'Estimate Project End Date',
              }}
            />
          </Col>
          <Col span={6}>
            <FormInput
              name='contractId'
              label='Project Contract ID'
              rules={requiredField}
              propsinput={{
                placeholder: 'Project Contract ID',
              }}
            />
          </Col>
          <Col span={18}>
            <FormInput
              name='description'
              label='Project Description'
              rules={requiredField}
              propsinput={{
                placeholder: 'Project Description',
              }}
            />
          </Col>
          <Col {...responsiveColumn3}>
            <FormSelect
              name='customer'
              label='Customer'
              rules={requiredField}
              propsselect={{
                options: clients,
                placeholder: 'Select Customer',
              }}
            />
          </Col>
          <Col {...responsiveColumn3}>
            <FormSelect
              name='location'
              label='Project Location'
              rules={requiredField}
              propsselect={{
                options: offices,
                placeholder: 'Select Project Location',
              }}
            />
          </Col>
          <Col {...responsiveColumn3}>
            <FormSelect
              name='status'
              label='Project Status'
              rules={requiredField}
              propsselect={{
                options: statusList,
                placeholder: 'Select Project Status',
              }}
            />
          </Col>
          <Col span={24}>
            <FormTextArea
              label='Remarks/Notes'
              name='remarksNotes'
              propstextarea={{
                rows: 4,
                placeholder: 'Remarks/Notes',
              }}
            />
          </Col>
          <Divider plain>Other Configuration</Divider>
          <Col {...responsiveColumn4}>
            <FormColorPicker
              label='Color'
              name='projectColor'
              propscolorpicker={{
                format: 'hex',
                onChange: (_, hex: string) => {
                  form.setFieldValue('projectColor', hex)
                },
              }}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
