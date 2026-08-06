import { TerminalWindowsAction } from "@/components/accounting/cashier/payments/data-types/interfaces";
import {
  GenderType,
  PaymentType,
  Payor,
  PayorType,
} from "@/components/accounting/cashier/payments/data-types/types";
import { Billing } from "@/graphql/gql/graphql";
import { useBillingById } from "@/hooks/cashier/use-billing";
import { HistoryOutlined, LockOutlined } from "@ant-design/icons";
import { Divider, Skeleton, Space, Tag, Tooltip, Typography } from "antd";
import numeral from "numeral";
import React, { Dispatch } from "react";
import { PayorLayout } from "./main";

interface Props extends Billing {
  id?: string;
  payorType: PayorType;
  paymentType: PaymentType;
  randomGender: GenderType;
  billing?: Billing | null;
  payor?: Payor | null;
  dispatch: Dispatch<TerminalWindowsAction>;
}

interface FolioStatusProps {
  loading: boolean;
  registryType?: string;
  locked?: boolean;
  isAllowedProgressPayment?: boolean;
}

export const PayorFolioIconStatus = React.memo((props: FolioStatusProps) => {
  return props.loading ? (
    <Skeleton.Button active={true} size="small" style={{ height: 15 }} />
  ) : (
    <>
      {props?.registryType && (
        <Tag color="#f50" bordered={false}>
          {props?.registryType}
        </Tag>
      )}
      {props.locked && (
        <Tag color="red" bordered={false} icon={<LockOutlined />} />
      )}
      {props.isAllowedProgressPayment && (
        <Tooltip title="Allowed Progress Payment">
          <Tag color="blue" bordered={false} icon={<HistoryOutlined />} />
        </Tooltip>
      )}
    </>
  );
});

PayorFolioIconStatus.displayName = "PayorFolioIconStatus";

const PayorFolioDetails = React.memo((props: Props) => {
  console.log("Folio payor ...");
  console.log(props, "props");
  const paymentType = props.paymentType as PaymentType;
  const defaultPayorType = (
    paymentType == "otc-payments" ? "WALK-IN" : props.payorType
  ) as PayorType;

  const { loading, data: billing } = useBillingById({
    variables: { id: props.id },
    onComplete: (billing) => {
      if (billing) {
        props.dispatch({ type: "set-billing", payload: billing });
        props.dispatch({
          type: "set-payor",
          payload: billing as Billing,
        });
        // props.dispatch({
        //   type: "set-folio-items",
        //   payload: {
        //     ROOMBOARD: [],
        //     MEDICINES: [],
        //     SUPPLIES: [],
        //     DIAGNOSTICS: [],
        //     CATHLAB: [],
        //     ORFEE: [],
        //     PF: [],
        //     OTHERS: [],
        //   },
        // })
      }
    },
  });

  const payorName =
    paymentType == "otc-payments"
      ? billing?.otcName
      : billing?.customer?.customerName ?? "";

  function onRouteFolio() {
    window.open(`/accounting/billing/folio/${billing?.id}`, "_blank");
  }
  return (
    <PayorLayout
      payorType={defaultPayorType}
      paymentType={paymentType}
      loading={loading}
      title={
        <Space wrap size="small">
          <PayorFolioIconStatus
            {...{
              locked: !!billing?.locked,
              loading,
            }}
          />
        </Space>
      }
      payorName={payorName}
      payorDescription={{
        label: loading ? (
          <Space split={<Divider type="vertical" />} wrap>
            <Skeleton.Button
              active={true}
              size="small"
              style={{ height: 15 }}
            />
            <Skeleton.Button
              active={true}
              size="small"
              style={{ height: 15 }}
            />
            <Skeleton.Button
              active={true}
              size="small"
              style={{ height: 15 }}
            />
          </Space>
        ) : billing ? (
          <Space split={<Divider type="vertical" />} wrap>
            <Typography.Text strong>
              Folio #: <a onClick={onRouteFolio}>{billing?.billNo}</a>
            </Typography.Text>
            <Typography.Text strong>
              Project #: {billing?.project?.contractId}
            </Typography.Text>
          </Space>
        ) : (
          <i>Please select a payor to proceed with the transaction.</i>
        ),
        extra: loading ? (
          <Skeleton.Button active={true} size="small" style={{ height: 15 }} />
        ) : billing ? (
          <Typography.Text strong underline type="danger">
            Balance:
            {numeral(billing?.balance).format("0,0.00")}
          </Typography.Text>
        ) : (
          "--------"
        ),
      }}
    />
  );
});

PayorFolioDetails.displayName = "PayorFolioDetails";

export default PayorFolioDetails;
