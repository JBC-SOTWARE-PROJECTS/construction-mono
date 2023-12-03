import CustomFieldLabel from '@/components/accountReceivables/common/customFieldLabel'
import CustomerSelector from '@/components/accountReceivables/common/customerSelector'
import {
  FormDatePicker,
  FormInput,
  FormInputNumber,
  FormSelect,
  FormTextArea,
} from '@/components/common'
import { CWTRates } from '@/constant/accountReceivables'
import { BookOutlined, CaretDownOutlined } from '@ant-design/icons'
import {
  Button,
  Checkbox,
  Col,
  DatePickerProps,
  Divider,
  Form,
  InputProps,
  Row,
  Space,
  Statistic,
} from 'antd'
import dayjs from 'dayjs'
import numeral from 'numeral'
import styled from 'styled-components'
import { CreditNCreateContextProps } from './CreditNCreate'
import {
  onChangeCnCWT,
  onChangeCnVat,
  onHandleClickCWT,
  onHandleClickVat,
  onHandleRefreshAddress,
  onSelectCustomer,
} from './functions'
import { CnCommonFormProps } from './props'
import { CNFormCommonStyles } from './styles'
import { dateFormat } from '@/components/accountReceivables/common/enum'
import { INVOICE_TYPE_CUSTOMER } from '@/components/accountReceivables/invoice/form/enum'

const initialValues = { vat: 12, cwtRate: 0, creditNoteDate: dayjs() }

export default function CNHeader(props: CreditNCreateContextProps) {
  const { state, dispatch, form, mutation, refetch, totalSummary, messageApi } =
    props

  const customerType =
    INVOICE_TYPE_CUSTOMER[
      state.invoiceType as keyof typeof INVOICE_TYPE_CUSTOMER
    ] ?? []

  return (
    <Form
      form={props.form}
      layout='vertical'
      name='creditNote-fields-form'
      style={{ marginTop: 50 }}
      initialValues={initialValues}
    >
      <HeaderStyle>
        <Row>
          <Col flex='700px'>
            <Space wrap>
              <CustomerSelector
                defaultValue=''
                readonly={false}
                customerType={customerType}
                onSelect={(value) =>
                  onSelectCustomer({
                    state,
                    value,
                    mutation,
                    dispatch,
                  })
                }
              />
              <FormDatePicker
                label='Credit Note Date'
                name='creditNoteDate'
                required
                tooltip='This is a required field'
                style={CNFormCommonStyles}
                propsdatepicker={{
                  ...(CnCommonFormProps as DatePickerProps),
                  format: dateFormat,
                  allowClear: false,
                }}
              />
            </Space>
          </Col>
          <Col flex='auto'>
            <Statistic
              title='AMOUNT TO REFUND'
              value={numeral(totalSummary.total).format('0,0.00')}
              prefix={<>&#8369;</>}
              style={{ textAlign: 'end' }}
              valueStyle={{
                fontWeight: 'bold',
                width: '100%',
                textAlign: 'end',
              }}
            />
          </Col>
        </Row>
        <Divider dashed style={{ margin: 10 }} />
        <Space wrap>
          <FormInput
            label='Reference'
            name='reference'
            style={CNFormCommonStyles}
            propsinput={{
              ...(CnCommonFormProps as InputProps),
              prefix: true ? <BookOutlined /> : <span />,
            }}
          />
          <FormSelect
            label={
              <CustomFieldLabel
                formField={() => (
                  <Checkbox
                    checked={state?.isCWT}
                    onChange={(value) =>
                      onChangeCnCWT({
                        value,
                        state,
                        refetch,
                        dispatch,
                        mutation,
                        messageApi,
                      })
                    }
                  >
                    Creditable Withholding Tax
                  </Checkbox>
                )}
                formExtra={() => (
                  <Button
                    type='dashed'
                    size='small'
                    style={{ float: 'right' }}
                    danger
                    onClick={() =>
                      onHandleClickCWT({
                        state,
                        refetch,
                        form,
                        mutation,
                        messageApi,
                      })
                    }
                    disabled={!state?.isCWT}
                  >
                    Apply
                  </Button>
                )}
                style={{ width: 285 }}
              />
            }
            name='cwtRate'
            style={CNFormCommonStyles}
            propsselect={{
              style: { width: 300 },
              options: CWTRates,
              size: 'large',
              disabled: !state?.isCWT,
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
                  <Checkbox
                    checked={state.isVatable}
                    onChange={(value) =>
                      onChangeCnVat({
                        value,
                        state,
                        refetch,
                        dispatch,
                        mutation,
                        messageApi,
                      })
                    }
                  >
                    Vat
                  </Checkbox>
                )}
                formExtra={() => (
                  <Button
                    type='dashed'
                    size='small'
                    style={{ float: 'right' }}
                    danger
                    onClick={() =>
                      onHandleClickVat({
                        state,
                        refetch,
                        form,
                        mutation,
                        messageApi,
                      })
                    }
                    disabled={!state.isVatable}
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
              disabled: !state?.isVatable,
              size: 'large',
              formatter: (value) => `${value}%`,
              parser: (value) => value!.replace('%', ''),
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
                    onClick={() =>
                      onHandleRefreshAddress({
                        state,
                        refetch,
                        mutation,
                        messageApi,
                      })
                    }
                  >
                    Refresh address
                  </Button>
                )}
                style={{ width: 285 }}
              />
            }
            name='billingAddress'
            style={CNFormCommonStyles}
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
