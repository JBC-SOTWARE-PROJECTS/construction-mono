import { useContext } from "react"
import styled from "styled-components"
import { TerminalWindowContext } from "../../../.."
import FoliosContent from "./folios"
import PaymentItemsContent from "./payment-items"

const TerminalWindowSiderContent = () => {
  const context = useContext(TerminalWindowContext)

  if (context) {
    const { state, dispatch, amountSummary, paymentType, onAddItems, id } =
      context

    return (
      <ContentDiv>
        {paymentType == "folio-payments" || paymentType == "otc-payments" ? (
          <FoliosContent
            {...{
              folioItems: state.folioItems,
              dispatch,
              amountSummary,
              paymentType,
              onAddItems,
              billing: state?.billing,
            }}
          />
        ) : (
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
        )}
      </ContentDiv>
    )
  }
}

export default TerminalWindowSiderContent

const ContentDiv = styled.div``
