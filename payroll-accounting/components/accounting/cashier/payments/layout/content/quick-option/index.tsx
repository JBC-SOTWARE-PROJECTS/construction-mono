import {
  AppstoreOutlined,
  BarsOutlined,
  PlusCircleOutlined,
  SwapLeftOutlined,
  SwapRightOutlined,
} from "@ant-design/icons";
import type { ButtonProps } from "antd";
import {
  Button,
  Col,
  Divider,
  Layout,
  Row,
  Segmented,
  Space,
  Switch,
  Typography,
} from "antd";
import { useState } from "react";
import { CSSProp } from "styled-components";
import { PaymentQuickOptions } from "../../../data-types/interfaces";
import { useConfirmationPasswordHook, useDialog } from "@/hooks";
import { useMutation, useQuery } from "@apollo/client";
import SearchPayorMC from "../../../dialog/customer";
import { useRouter } from "next/router";
import { PayorType } from "../../../data-types/types";
import { GET_BILLING_ITEMS, LOCK_BILLING } from "@/graphql/billing/queries";
import { BillingItem } from "@/graphql/gql/graphql";
import { AddProjectDeductions } from "@/components/accounting/billing/dialog/add-projrect-deductions";

const { Sider, Content, Footer } = Layout;

const buttonStyle: CSSProp = {
  height: "40px",
  borderRadius: "5px",
  fontSize: "13px",
  fontWeight: "bold",
};

const QuickOptionsBtn = (props: ButtonProps) => {
  return (
    <Button
      type="primary"
      block
      style={{ ...buttonStyle }}
      size="large"
      {...props}
    />
  );
};

const TerminalWindowsQuickOption = (props: PaymentQuickOptions) => {
  const { push } = useRouter();
  const [collapse, setCollapse] = useState(false);
  const payorDialog = useDialog(SearchPayorMC);
  const projectDeductionsDialog = useDialog(AddProjectDeductions);

  const { data, loading, refetch } = useQuery(GET_BILLING_ITEMS, {
    fetchPolicy: "cache-and-network",
    variables: {
      filter: "",
      id: props?.billing?.id,
      type: "DEDUCTIONS",
    },
  });

  const [onToggleLock, { loading: lockLoading }] = useMutation(LOCK_BILLING);

  const lockLabel = props.billing?.locked ? "Unlock" : "Lock";

  const [showPasswordConfirmation] = useConfirmationPasswordHook();

  const toggleLockBilling = () => {
    if (props.billing?.locked) {
      alert("Please reconcile any subsidized deductions to the AR personnel");
    }

    showPasswordConfirmation(() => {
      onToggleLock({
        variables: {
          id: props?.billing?.id,
          type: "LOCK",
        },
        onCompleted: () => {
          location.reload();
        },
      });
    });
  };

  const onAddDeduction = () => {
    const billingItems = (data?.billingItemByParentType ?? [])
      .filter((item: BillingItem) => {
        return !!item?.projectCostId && item.status;
      })
      .map((item: BillingItem) => item.projectCostId)
      .filter(Boolean);
    projectDeductionsDialog(
      {
        id: props?.billing?.project?.id,
        billingId: props?.billing?.id,
        billingItems,
      },
      () => {
        location.reload();
      }
    );
  };

  const onHandleSelectPayor = () => {
    const payorType = props.payorType;
    payorDialog(
      {
        paymentType: props.paymentType,
        defaultPayorType: payorType,
      },
      (params: { id: string; payorType: PayorType }) => {
        if (params.id) {
          push(
            `/accounting/cashier/payments/${
              props.paymentType
            }/${params.payorType.toLowerCase()}/${params.id}`
          );
        }
      }
    );
  };

  // const onAddItems = () => {
  //   const type = props.paymentType
  //   switch (type) {
  //     case "folio-payments":
  //       return quickActionFolioPayments(
  //         folioItemsDialog,
  //         props.state.billing,
  //         props.state.folioItems,
  //         props.dispatch
  //       )
  //     case "miscellaneous-payments":
  //       return quickActionMiscPayments(miscItemsDialog, props.dispatch)
  //     default:
  //       return null
  //   }
  // }

  const onToggleReceiptType = () => {};

  return (
    <Sider
      theme="light"
      width="150px"
      breakpoint="lg"
      collapsedWidth={0}
      collapsed={collapse}
      onBreakpoint={(broken) => setCollapse(broken)}
      style={{ marginTop: 10, marginRight: 10 }}
    >
      <Row gutter={[8, 8]} style={{ padding: 10 }} justify="center">
        <Col span={23}>
          <Space>
            <Segmented
              options={[
                { label: "OR", value: "OR", icon: <SwapLeftOutlined /> },
                {
                  label: "AR",
                  value: "AR",
                  icon: <SwapRightOutlined />,
                },
              ]}
              value={props.state.receiptType}
              onChange={onToggleReceiptType}
            />
          </Space>
        </Col>
        <Col span={24} style={{ textAlign: "center" }}>
          <Typography.Text strong>Quick Options</Typography.Text>
        </Col>
        {/* <Col span={24}>
          <QuickOptionsBtn>New Folio</QuickOptionsBtn>
        </Col> */}
        {/* <Col span={24}>
          <QuickOptionsBtn>History</QuickOptionsBtn>
        </Col> */}
        <Col span={24}>
          <QuickOptionsBtn onClick={onHandleSelectPayor}>
            Select Payor (F2)
          </QuickOptionsBtn>
        </Col>
        {/* <Col span={24}>
          {props.billing?.locked && (
            <QuickOptionsBtn
              onClick={() =>
                props.onAddItems(props?.paymentType ?? "project-payments")
              }
            >
              Select Item (F3)
            </QuickOptionsBtn>
          )}
        </Col> */}
        <Col span={24}>
          {!props.billing?.locked && props.billing && (
            <QuickOptionsBtn onClick={toggleLockBilling}>
              Lock Folio
            </QuickOptionsBtn>
          )}
        </Col>
        <Col span={24}>
          {props.billing?.status && (
            <QuickOptionsBtn>Close Folio</QuickOptionsBtn>
          )}
        </Col>

        <Divider dashed />

        <Col span={24}>
          {props.billing?.locked && (
            <QuickOptionsBtn onClick={onAddDeduction}>
              Apply Deduction
            </QuickOptionsBtn>
          )}
        </Col>
        {/* <Col span={24}>
          <QuickOptionsBtn icon={<PlusCircleOutlined />}>Notes</QuickOptionsBtn>
        </Col> */}
      </Row>
    </Sider>
  );
};

export default TerminalWindowsQuickOption;
