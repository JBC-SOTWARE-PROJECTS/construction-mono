import {
  Button,
  Checkbox,
  Divider,
  Form,
  FormInstance,
  Space,
  message,
} from 'antd'
import CustomerSelector from '../../common/customerSelector'
import {
  FormDatePicker,
  FormInput,
  FormInputNumber,
  FormSelect,
  FormSwitch,
  FormTextArea,
} from '@/components/common'
import {
  BookOutlined,
  CaretDownOutlined,
  PercentageOutlined,
} from '@ant-design/icons'
import { CWTRates, InvoiceStatusEnum } from '@/constant/accountReceivables'
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'
import { StateI } from '.'
import { INVOICE_TYPE_CUSTOMER } from './enum'
import dayjs from 'dayjs'
import { ApolloQueryResult, FetchResult, useMutation } from '@apollo/client'
import {
  GENERATE_INVOICE_TAX,
  GENERATE_INVOICE_VAT,
} from '@/graphql/accountReceivables/invoices'
import CustomFieldLabel from '../../common/customFieldLabel'
import { assignFormValues } from './helper'
import styled from 'styled-components'

const dateFormat = 'DD MMM YYYY'

interface FormHeaderI {
  id?: string
  editable: boolean
  form: FormInstance<any>
  state: StateI
  dispatch: any
  invoiceType: string
  invoiceRefetch: (values?: any) => Promise<ApolloQueryResult<any>>
  invoiceItemRefetch: (values?: any) => void
  onMutateInvoice: (value: {
    variables: any
    onCompleted?: (value: any) => void
  }) => void
  handleFindInvoice: any
  handleFindInvoiceItems: any
}

export default function FormHeader(props: FormHeaderI) {
  const {
    id,
    form,
    editable,
    state,
    dispatch,
    invoiceType,
    onMutateInvoice,
    invoiceRefetch,
    invoiceItemRefetch,
    handleFindInvoice,
    handleFindInvoiceItems,
  } = props

  const [messageApi, contextHolder] = message.useMessage()

  const { isCWT, isVatable } = state

  const [onGenerateTax, { loading: generateTaxLoading }] = useMutation(
    GENERATE_INVOICE_TAX,
    {
      onCompleted: () => {},
    }
  )

  const [onGenerateVat, { loading: generateVatLoading }] = useMutation(
    GENERATE_INVOICE_VAT,
    {
      onCompleted: () => {},
    }
  )

  function asyncMutationWithLoader(mutationFunc: any, variables: any) {
    console.log(variables, 'variables')
    messageApi.open({
      type: 'loading',
      content: 'Action in progress..',
      duration: 0,
    })

    mutationFunc({
      variables,
      onCompleted: () => {
        messageApi.destroy()
        handleFindInvoice(state?.id)
        handleFindInvoiceItems(state?.id)
      },
    })
  }

  const onHandleClickCWT = () => {
    const rate = form.getFieldValue('cwtRate')
    const isApply = rate > 0 ? true : false

    asyncMutationWithLoader(onGenerateTax, {
      invoiceId: state.id,
      taxType: 'CWT',
      rate,
      isApply,
    })
  }

  const onChangeCWT = ({ target }: CheckboxChangeEvent) => {
    dispatch({ type: 'toggleCWT' })
    if (!target.checked) {
      const rate = form.getFieldValue('cwtRate')

      asyncMutationWithLoader(onGenerateTax, {
        invoiceId: state.id,
        taxType: 'CWT',
        rate,
        isApply: false,
      })
    }
  }

  const onHandleClickVat = () => {
    const vat = form.getFieldValue('vat')
    const isVatable = vat > 0 ? true : false

    asyncMutationWithLoader(onGenerateVat, {
      invoiceId: state.id,
      isVatable,
      vatValue: vat,
    })
  }

  const onChangeVat = ({ target }: CheckboxChangeEvent) => {
    dispatch({ type: 'toggleVat' })
    if (!target.checked) {
      const vat = form.getFieldValue('vat')

      asyncMutationWithLoader(onGenerateVat, {
        invoiceId: state.id,
        isVatable: false,
        vatValue: vat,
      })
    }
  }

  const onSelectCustomer = (value: string) => {
    onMutateInvoice({
      variables: {
        id,
        fields: {
          arCustomer: { id: value },
          status: InvoiceStatusEnum.DRAFT,
          invoiceDate: dayjs(),
          invoiceType,
          dueDate: dayjs().add(1, 'M'),
        },
      },
      onCompleted: ({ createInvoice: { response } }: any) => {
        console.log(response, 'response')
        dispatch({ type: 'invoice-id', payload: response?.id })
      },
    })
  }

  const onRefreshAddress = () => {
    onMutateInvoice({
      variables: {
        id,
        fields: { billingAddress: null },
      },
      onCompleted: ({ createInvoice: { response } }: any) => {
        invoiceRefetch().then(({ data: { findOne } }) =>
          assignFormValues(findOne, form, dispatch)
        )
      },
    })
  }

  return (
    <Form
      form={form}
      layout='vertical'
      name='invoice-fields-form'
      style={{ marginTop: 50 }}
      initialValues={{
        vat: 12,
        invoiceDate: dayjs(),
        dueDate: dayjs().add(1, 'M'),
      }}
    >
      {contextHolder}
      <HeaderStyle>
        <Space wrap>
          <CustomerSelector
            defaultValue={''}
            readonly={false}
            customerType={
              INVOICE_TYPE_CUSTOMER[
                invoiceType as keyof typeof INVOICE_TYPE_CUSTOMER
              ] ?? []
            }
            onSelect={(e) => onSelectCustomer(e)}
          />
          <FormDatePicker
            label='Invoice Date'
            name='invoiceDate'
            required
            tooltip='This is a required field'
            style={{ fontWeight: 'bold' }}
            propsdatepicker={{
              style: { minWidth: 300 },
              size: 'large',
              format: dateFormat,
              allowClear: false,
            }}
          />

          <FormDatePicker
            label='Due Date'
            name='dueDate'
            required
            tooltip='This is a required field'
            style={{ fontWeight: 'bold' }}
            propsdatepicker={{
              style: { minWidth: 300 },
              size: 'large',
              format: dateFormat,
              allowClear: false,
            }}
          />

          <FormInput
            label='Reference'
            name='reference'
            style={{ fontWeight: 'bold' }}
            propsinput={{
              size: 'large',
              prefix: true ? <BookOutlined /> : <span />,
              style: { minWidth: 300 },
            }}
          />

          <FormSelect
            label={
              <CustomFieldLabel
                formField={() => (
                  <Checkbox checked={isCWT} onChange={onChangeCWT}>
                    Creditable Withholding Tax
                  </Checkbox>
                )}
                formExtra={() => (
                  <Button
                    type='dashed'
                    size='small'
                    style={{ float: 'right' }}
                    danger
                    onClick={() => onHandleClickCWT()}
                    disabled={!isCWT}
                  >
                    Apply
                  </Button>
                )}
                style={{ width: 285 }}
              />
            }
            name='cwtRate'
            style={{ fontWeight: 'bold' }}
            propsselect={{
              style: { width: 300 },
              options: CWTRates,
              size: 'large',
              // onSelect: (e: number) => onHandleSelectCWT(e),
              disabled: !editable || !isCWT,
              suffixIcon: (
                <CaretDownOutlined
                  style={{ fontSize: '15px', color: 'black' }}
                />
              ),
            }}
          />

          <FormInputNumber
            label={
              <CustomFieldLabel
                formField={() => (
                  <Checkbox checked={isVatable} onChange={onChangeVat}>
                    Vat
                  </Checkbox>
                )}
                formExtra={() => (
                  <Button
                    type='dashed'
                    size='small'
                    style={{ float: 'right' }}
                    danger
                    onClick={() => onHandleClickVat()}
                    disabled={!isVatable}
                  >
                    Apply
                  </Button>
                )}
                style={{ width: 285 }}
              />
            }
            name='vat'
            style={{ fontWeight: 'bold', width: 300 }}
            propsinputnumber={{
              disabled: !editable || !isVatable,
              size: 'large',
              formatter: (value) => `${value}%`,
              parser: (value) => value!.replace('%', ''),
              // onSelect: (e: string) => onHandleSelectVat(e),
            }}
          />
        </Space>
        <Divider dashed style={{ margin: 10 }} />
        <Space wrap>
          <FormTextArea
            label={
              <CustomFieldLabel
                formField={() => <b>Billing Address</b>}
                formExtra={() => (
                  <Button
                    type='dashed'
                    size='small'
                    style={{ float: 'right' }}
                    danger
                    onClick={() => onRefreshAddress()}
                    disabled={!editable}
                  >
                    Refresh address
                  </Button>
                )}
                style={{ width: 285 }}
              />
            }
            name='billingAddress'
            style={{ fontWeight: 'bold' }}
            propstextarea={{
              style: { width: 300 },
              rows: 4,
            }}
          />
        </Space>
      </HeaderStyle>
    </Form>
  )
}

const HeaderStyle = styled.div`
  .ant-form-item .ant-form-item-label > label {
    color: #000a1ebf !important;
  }
  .ant-checkbox {
    color: #000a1ebf !important;
  }
`
