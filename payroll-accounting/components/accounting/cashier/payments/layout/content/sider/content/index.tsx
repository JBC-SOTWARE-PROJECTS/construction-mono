import { useContext } from "react"
import styled from "styled-components"
import { TerminalWindowContext } from "../../../.."
import PaymentItemsContent from "./payment-items"

const TerminalWindowSiderContent = () => {
  const context = useContext(TerminalWindowContext)

  if (context) {
    const { state, dispatch, paymentType, onAddItems, id } = context

    return (
      <ContentDiv>
        <PaymentItemsContent
          {...{
            id,
            paymentType,
            dispatch,
            onAddItems,
            paymentItems: state?.paymentItems ?? [],
            billing: state?.billing,
          }}
        />
      </ContentDiv>
    )
  }
}

export default TerminalWindowSiderContent

const ContentDiv = styled.div``
