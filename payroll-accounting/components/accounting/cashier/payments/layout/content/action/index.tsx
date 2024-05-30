import { Button, Col, Layout, Row } from "antd"
import { useContext } from "react"
import { TerminalWindowContext } from "../../.."
import useProcessPayment from "@/hooks/cashier/use-process-payment"
import { gql, useMutation } from "@apollo/client"
import { BillingItem, PaymentItem } from "@/graphql/gql/graphql"
import { FolioItemsI } from "../../../data-types/interfaces"
import { useRouter } from "next/router"
import { useDialog } from "@/hooks"
import ActionControl from "../../../dialog/control"
import { getFolioFields, onCompletePayment } from "./utils"

const POST_PAYMENT = gql`
  mutation (
    $type: String
    $items: [Map_String_ObjectScalar]
    $tendered: [Map_String_ObjectScalar]
    $taggedIds: [UUID]
    $taggedIdsMeds: [UUID]
    $fields: Map_String_ObjectScalar
  ) {
    processPayment(
      type: $type
      items: $items
      tendered: $tendered
      taggedIds: $taggedIds
      taggedIdsMeds: $taggedIdsMeds
      fields: $fields
    ) {
      response {
        id
      }
    }
  }
`

type Props = {}
const background = "#f5f5f5"

const TerminalWindowAction = (props: Props) => {
  const router = useRouter()
  const actionControl = useDialog(ActionControl)
  const context = useContext(TerminalWindowContext)
  const [onProcess, { loading }] = useMutation(POST_PAYMENT)

  const onClickContinue = () => {
    const paymentType = context?.paymentType
    const state = context?.state
    let items: any[] = []

    if (paymentType == "folio-payments" || paymentType == "otc-payments") {
      const folioFields = getFolioFields({
        folioItems: state?.folioItems,
        billing: state?.billing,
        terminalDetails: context?.terminalDetails,
      })

      onProcess({
        variables: {
          type: paymentType,
          tendered: state?.paymentMethods,
          ...folioFields,
        },
        onCompleted: () => {
          actionControl({}, (e: string) =>
            onCompletePayment(e, paymentType, router)
          )
        },
      })
    } else {
      items = [...(state?.paymentItems ?? [])]
    }
  }

  return (
    <Layout.Footer
      style={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        background,
        padding: 12,
        height: 120,
        paddingRight: "45.5%",
      }}
    >
      <Row gutter={[8, 8]}>
        <Col flex="auto">
          <Button size="large" block style={{ height: 50 }} danger>
            Suspend
          </Button>
        </Col>
        <Col flex="auto">
          <Button
            size="large"
            block
            style={{ height: 50, color: "#115e59", borderColor: "#115e59" }}
          >
            Hold
          </Button>
        </Col>
        <Col flex="auto">
          <Button
            size="large"
            block
            style={{ height: 50, background: "#115e59" }}
            type="primary"
            onClick={() => onClickContinue()}
            loading={loading}
          >
            Continue
          </Button>
        </Col>
      </Row>
    </Layout.Footer>
  )
}

export default TerminalWindowAction
