import {
  FormInput,
  FormSelect,
  FormInputNumber,
  FormDatePicker,
  FormRadioButton,
} from '@/components/common'
import { ClaimsType } from '@/constant/accountReceivables'
import {
  ADD_INVOICE_ITEMS,
  DOCTORS,
  PATIENTS,
} from '@/graphql/accountReceivables/invoices'
import { ArInvoice, ArInvoiceItems } from '@/graphql/gql/graphql'
import { UserOutlined } from '@ant-design/icons'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { Divider, Form, Modal, RadioChangeEvent } from 'antd'
import { useReducer, useState } from 'react'

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

interface CreateManualClaimsI {
  hide: () => void
  values: ArInvoiceItems
  invoice: ArInvoice
}

interface StateI {
  itemName: string
  pf_name: string
  claimType: string
}

interface ActionI {
  type: string
  payload: string
}

const reducer = (state: StateI, action: ActionI) => {
  switch (action.type) {
    case 'ITEM_NAME':
      return { ...state, itemName: action.payload }
    case 'PF_NAME':
      return { ...state, pf_name: action.payload }
    case 'CLAIM_TYPE':
      return { ...state, claimType: action.payload }
    default:
      return state
  }
}

const initialState = { itemName: '', pf_name: '', claimType: 'HCI' }

export default function CreateManualClaims(props: CreateManualClaimsI) {
  const { hide, values, invoice } = props
  const [form] = Form.useForm()

  const [state, dispatch] = useReducer(reducer, initialState)

  const [onSearchPF, { loading: onSearchPFLoading, data: onSearchData }] =
    useLazyQuery(DOCTORS)
  const [onSearchPatient, { loading: loadingSearch, data: searchedData }] =
    useLazyQuery(PATIENTS)
  const [onAddInvoiceItems, { loading: onAddInvoiceItemsLoading }] =
    useMutation(ADD_INVOICE_ITEMS, { onCompleted: () => hide() })

  const pfOpt = (onSearchData?.doctors?.content ?? []).map((pf: any) => ({
    label: pf.fullName,
    value: pf.id,
  }))

  const onHandleSubmit = (formFields: ArInvoiceItems) => {
    const fields = {
      arInvoice: { id: invoice?.id.toString() },
      ...formFields,
      ...state,
      patient_name: state.itemName,
      quantity: 1,
      claimsItem: true,
      totalAmountDue: formFields.unitPrice,
      status: 'active',
    }

    fields.description = `${fields?.description ?? ''} (${fields.itemType})`

    onAddInvoiceItems({
      variables: {
        id: null,
        fields,
      },
    })
  }

  const onHandleClaimType = (value: string) => {
    dispatch({ type: 'CLAIM_TYPE', payload: value })
  }

  return (
    <Modal
      title='Manually Add Project'
      wrapClassName='ar-modal'
      open={true}
      okText='Create'
      onOk={() => form.submit()}
      okButtonProps={{ loading: onAddInvoiceItemsLoading, size: 'large' }}
      cancelButtonProps={{ loading: onAddInvoiceItemsLoading, size: 'large' }}
      onCancel={() => hide()}
      // width={1000}
    >
      <Divider dashed />
      <Form
        form={form}
        {...formItemLayout}
        initialValues={{ itemType: 'HCI', ...values }}
        onFinish={onHandleSubmit}
      >
        <FormSelect
          {...{
            label: 'Patient',
            name: 'patientId',
            tooltip: 'Search your patient here and this is a required field',
          }}
          rules={[
            {
              required: true,
              message: 'Please select patient!',
            },
          ]}
          propsselect={{
            size: 'large',
            options: searchedData?.patients?.content || [],
            showSearch: true,
            onSearch: (e) => onSearchPatient({ variables: { filter: e } }),
            loading: loadingSearch,
            filterOption: false,
            style: { minWidth: 300 },
            onSelect: (_, option) => {
              dispatch({ type: 'ITEM_NAME', payload: option?.label as string })
            },
          }}
        />

        <FormInput
          label='Description'
          name='description'
          propsinput={{
            size: 'large',
          }}
        />

        <FormInput
          label='Reference'
          name='approval_code'
          tooltip='Approval Code or LOA'
          propsinput={{
            size: 'large',
          }}
          rules={[
            {
              required: true,
              message: 'Please input Reference!',
            },
          ]}
        />

        <FormInput
          label='SOA'
          name='soa_no'
          tooltip='Billing SOA'
          propsinput={{
            size: 'large',
          }}
          rules={[
            {
              required: true,
              message: 'Please input soa!',
            },
          ]}
        />

        <FormRadioButton
          label='Claim Type'
          name='itemType'
          propsradiobutton={{
            options: ClaimsType,
            optionType: 'button',
            onChange: ({ target }: RadioChangeEvent) =>
              onHandleClaimType(target.value),
          }}
        />

        {state.claimType == 'PF' && (
          <FormSelect
            {...{
              label: 'Doctor',
              name: 'pf_id',
              tooltip: 'Search here and this is a required field',
            }}
            rules={[
              {
                required: true,
                message: 'Please select doctor!',
              },
            ]}
            propsselect={{
              size: 'large',
              options: pfOpt,
              showSearch: true,
              onSearch: (e) =>
                onSearchPF({
                  variables: {
                    filter: e,
                    size: 10,
                    page: 0,
                    department: null,
                    option: 'EXCLUDE_PAYROLL',
                  },
                }),
              loading: onSearchPFLoading,
              filterOption: false,
              style: { minWidth: 300 },
              onSelect: (_, option) =>
                dispatch({ type: 'PF_NAME', payload: option?.label as string }),
            }}
          />
        )}

        <FormDatePicker
          label='Discharged Date'
          name='discharge_date'
          propsdatepicker={{ size: 'large', style: { width: '100%' } }}
          rules={[
            {
              required: true,
              message: 'Please select discharged date!',
            },
          ]}
        />

        <FormInputNumber
          label='Claim Amount'
          name='unitPrice'
          propsinputnumber={{
            size: 'large',
            style: { width: '100%' },
          }}
          rules={[
            {
              required: true,
              message: 'Please input amount!',
            },
          ]}
        />
      </Form>
    </Modal>
  )
}
