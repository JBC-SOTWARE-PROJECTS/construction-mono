import { Descriptions } from 'antd'
import {
  PaymentMethodBankDeposit,
  PaymentMethodCard,
  PaymentMethodCheck,
  PaymentMethodEWallet,
  PaymentMethodFields,
} from '../types'
import dayjs from 'dayjs'
import { dateFormat } from '@/components/accountReceivables/common/enum'

export function CardDesc(props: PaymentMethodCard) {
  return (
    <Descriptions column={5}>
      <Descriptions.Item style={{ paddingBottom: 0 }} label='Reference'>
        {props.reference}
      </Descriptions.Item>
      <Descriptions.Item style={{ paddingBottom: 0 }} label='Name of card'>
        {props.nameOfCard}
      </Descriptions.Item>
      <Descriptions.Item style={{ paddingBottom: 0 }} label='Bank'>
        {props.bank}
      </Descriptions.Item>
      <Descriptions.Item style={{ paddingBottom: 0 }} label='Check date'>
        {dayjs(props.checkdate).format(dateFormat)}
      </Descriptions.Item>
      <Descriptions.Item style={{ paddingBottom: 0 }} label='Approval date'>
        {props.approvalCode}
      </Descriptions.Item>
      <Descriptions.Item style={{ paddingBottom: 0 }} label='POS Terminal'>
        {props.posTerminalId}
      </Descriptions.Item>
      <Descriptions.Item style={{ paddingBottom: 0 }} label='Acquiring Bank'>
        {props.acquiringBank.bankname}
      </Descriptions.Item>
      <Descriptions.Item style={{ paddingBottom: 0 }} label='Card Type'>
        {props.cardType}
      </Descriptions.Item>
      <Descriptions.Item style={{ paddingBottom: 0 }} label='Other Type'>
        {props?.otherType}
      </Descriptions.Item>
    </Descriptions>
  )
}

export function CheckDesc(props: PaymentMethodCheck) {
  return (
    <Descriptions>
      <Descriptions.Item style={{ paddingBottom: 0 }} label='Reference'>
        {props.reference}
      </Descriptions.Item>
      <Descriptions.Item style={{ paddingBottom: 0 }} label='Bank'>
        {props.bank}
      </Descriptions.Item>
      <Descriptions.Item style={{ paddingBottom: 0 }} label='Check date'>
        {dayjs(props.checkdate).format(dateFormat)}
      </Descriptions.Item>
    </Descriptions>
  )
}

export function BankDepositDesc(props: PaymentMethodBankDeposit) {
  return (
    <Descriptions>
      <Descriptions.Item style={{ paddingBottom: 0 }} label='Reference'>
        {props.reference}
      </Descriptions.Item>
      <Descriptions.Item style={{ paddingBottom: 0 }} label='Bank'>
        {props.bankEntity.bankname}
      </Descriptions.Item>
      <Descriptions.Item style={{ paddingBottom: 0 }} label='Check date'>
        {dayjs(props.checkdate).format(dateFormat)}
      </Descriptions.Item>
    </Descriptions>
  )
}

export function EWalletDesc(props: PaymentMethodEWallet) {
  return (
    <Descriptions>
      <Descriptions.Item style={{ paddingBottom: 0 }} label='Reference'>
        {props.reference}
      </Descriptions.Item>
      <Descriptions.Item style={{ paddingBottom: 0 }} label='Trace #'>
        {props.traceNo}
      </Descriptions.Item>
      <Descriptions.Item style={{ paddingBottom: 0 }} label='Invoice #'>
        {props.invoiceNo}
      </Descriptions.Item>
      <Descriptions.Item style={{ paddingBottom: 0 }} label='Approval date'>
        {props.approvalCode}
      </Descriptions.Item>
      <Descriptions.Item style={{ paddingBottom: 0 }} label='POS Terminal'>
        {props.terminalId}
      </Descriptions.Item>
      <Descriptions.Item style={{ paddingBottom: 0 }} label='Acquiring Bank'>
        {props.acquiringBank.bankname}
      </Descriptions.Item>
      <Descriptions.Item style={{ paddingBottom: 0 }} label='E-wallet Type'>
        {props.eWalletType}
      </Descriptions.Item>
      <Descriptions.Item style={{ paddingBottom: 0 }} label='Other Type'>
        {props?.otherType}
      </Descriptions.Item>
    </Descriptions>
  )
}
