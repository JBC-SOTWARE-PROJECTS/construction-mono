import { Col } from "antd"
import { useRouter } from "next/router"
import React from "react"
import { TerminalWindowsPayor } from "../../../../data-types/interfaces"
import PayorFolioDetails from "./details/folio"
import MiscPayor from "./details/others"
import DoctorPayor from "./details/doctor"
import EmployeePayor from "./details/employee"
import OtherPayor from "./details/others"
import InvestorPayor from "./details/investor"
import PromissoryNotePayor from "./details/promissory"
import CorporatePayor from "./details/corporate"

export interface PaymentRoute {
  "payor-type": string
  "payment-type": string
  id: string
}

const TerminalWindowPayor = React.memo((props: TerminalWindowsPayor) => {
  console.log("Payor window ...")
  const router = useRouter()
  const query: PaymentRoute = (router?.query ?? {
    "payment-type": "",
    "payor-type": "",
    id: "",
  }) as any

  const getPayorDetails: React.FC<TerminalWindowsPayor> = (params) => {
    let payorType = params.payorType
    let paymentType = params.paymentType
    switch (payorType) {
      case "FOLIO":
        return (
          <PayorFolioDetails
            {...{
              ...params.billing,
              paymentType,
              payorType,
              randomGender: props.randomGender,
              dispatch: props.dispatch,
              ...query,
            }}
          />
        )
        break
      case "WALK-IN":
        return (
          <PayorFolioDetails
            {...{
              ...params.billing,
              paymentType,
              payorType,
              randomGender: props.randomGender,
              dispatch: props.dispatch,
              ...query,
            }}
          />
        )
        break
      case "EMPLOYEE":
        return (
          <EmployeePayor
            {...{
              paymentType,
              payorType,
              randomGender: props.randomGender,
              dispatch: props.dispatch,
              ...query,
            }}
          />
        )
        break
      case "DOCTORS":
        return (
          <DoctorPayor
            {...{
              paymentType,
              payorType,
              randomGender: props.randomGender,
              dispatch: props.dispatch,
              ...query,
            }}
          />
        )
        break
      case "INVESTOR":
        return (
          <InvestorPayor
            {...{
              paymentType,
              payorType,
              randomGender: props.randomGender,
              dispatch: props.dispatch,
              ...query,
            }}
          />
        )
        break
      case "PROMISSORY_NOTE":
        return (
          <PromissoryNotePayor
            {...{
              paymentType,
              payorType,
              randomGender: props.randomGender,
              dispatch: props.dispatch,
              ...query,
            }}
          />
        )
      case "CORPORATE":
        return (
          <CorporatePayor
            {...{
              paymentType,
              payorType,
              randomGender: props.randomGender,
              dispatch: props.dispatch,
              ...query,
            }}
          />
        )
      case "HMO":
        return (
          <CorporatePayor
            {...{
              paymentType,
              payorType,
              randomGender: props.randomGender,
              dispatch: props.dispatch,
              ...query,
            }}
          />
        )
      case "OTHER":
        return (
          <MiscPayor
            {...{
              paymentType,
              payorType,
              randomGender: props.randomGender,
              dispatch: props.dispatch,
              ...query,
            }}
          />
        )
        break
      default:
        return (
          <OtherPayor
            {...{
              paymentType,
              payorType,
              randomGender: props.randomGender,
              dispatch: props.dispatch,
              ...query,
            }}
          />
        )
        return <></>
        break
    }
  }

  return <Col span={24}>{getPayorDetails(props)}</Col>
})

TerminalWindowPayor.displayName = "TerminalWindowPayor"

export default TerminalWindowPayor
