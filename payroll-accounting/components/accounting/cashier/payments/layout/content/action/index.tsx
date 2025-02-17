import { Button, Col, Layout, message, Row } from "antd";
import { useContext } from "react";
import { TerminalWindowContext } from "../../..";
import useProcessPayment from "@/hooks/cashier/use-process-payment";
import { gql, useMutation } from "@apollo/client";
import { BillingItem, PaymentItem } from "@/graphql/gql/graphql";
import { FolioItemsI } from "../../../data-types/interfaces";
import { useRouter } from "next/router";
import { useDialog } from "@/hooks";
import ActionControl from "../../../dialog/control";
import { getFolioFields, onCompletePayment } from "./utils";

const POST_PAYMENT = gql`
  mutation (
    $type: String
    $items: [Map_String_ObjectScalar]
    $tendered: [Map_String_ObjectScalar]
    $fields: Map_String_ObjectScalar
  ) {
    processPayment(
      type: $type
      items: $items
      tendered: $tendered
      fields: $fields
    ) {
      success
      response {
        id
      }
    }
  }
`;

type Props = {};
const background = "#f5f5f5";

const TerminalWindowAction = (props: Props) => {
  const router = useRouter();
  const actionControl = useDialog(ActionControl);
  const context = useContext(TerminalWindowContext);
  const [onProcess, { loading }] = useMutation(POST_PAYMENT);

  const onClickContinue = () => {
    const paymentType = context?.paymentType;
    const state = context?.state;
    let items: any[] = [];

    if (paymentType == "project-payments") {
      const folioFields = getFolioFields({
        billing: state?.billing,
        terminalDetails: context?.terminalDetails,
      });

      onProcess({
        variables: {
          type: paymentType,
          tendered: state?.paymentMethods,
          items: state?.paymentItems,
          fields: {
            ...folioFields?.fields,
            receiptType: state?.receiptType,
          },
        },
        onCompleted: (response) => {
          if (response.processPayment?.success)
            actionControl({}, (e: string) =>
              onCompletePayment(e, paymentType, router)
            );
          else message.error("Failed to process payment");
        },
      });
    } else {
      items = [...(state?.paymentItems ?? [])];
    }
  };

  function onWindowClose() {
    router.push("/accounting/cashier");
  }

  return (
    <Layout.Footer
      style={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        background,
        padding: 12,
        height: "105px",
        paddingRight: "46%",
        marginLeft: "2px",
      }}
    >
      <Row gutter={[8, 8]}>
        <Col flex="auto">
          <Button
            size="large"
            block
            style={{ fontWeight: "bold", height: 50 }}
            danger
            onClick={onWindowClose}
          >
            Close
          </Button>
        </Col>
        {/* <Col flex="auto">
          <Button
            size="large"
            block
            style={{ height: 50, color: "#399b53", borderColor: "#399b53" }}
          >
            Hold
          </Button>
        </Col> */}
        <Col flex="auto">
          <Button
            size="large"
            block
            style={{ fontWeight: "bold", height: 50, background: "#399b53" }}
            type="primary"
            onClick={() => onClickContinue()}
            loading={loading}
          >
            Continue
          </Button>
        </Col>
      </Row>
    </Layout.Footer>
  );
};

export default TerminalWindowAction;
