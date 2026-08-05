import { TerminalWindowsAction } from "@/components/accounting/cashier/payments/data-types/interfaces";
import {
  GenderType,
  PaymentType,
  Payor,
  PayorType,
} from "@/components/accounting/cashier/payments/data-types/types";
import { useCustomerById } from "@/hooks/cashier/use-customer";
import { Divider, Skeleton, Space, Typography } from "antd";
import { Dispatch } from "react";
import { PayorLayout } from "./main";

export interface PaymentRoute {
  "payor-type": string;
  "payment-type": string;
  id: string;
}

interface Props extends PaymentRoute {
  id: string;
  paymentType: PaymentType;
  randomGender: GenderType;
  payor?: Payor | null;
  dispatch: Dispatch<TerminalWindowsAction>;
}

export default function CorporatePayor(props: Props) {
  const { data, loading } = useCustomerById({
    variables: { id: props.id },
  });

  const hasValue = true;
  const record = null;
  const amount = 0.0;

  return (
    <PayorLayout
      payorType={props["payor-type"] as PayorType}
      paymentType={props["payment-type"] as PaymentType}
      loading={loading}
      payorName={data?.customerName ?? ""}
      payorDescription={{
        label: loading ? (
          <Skeleton.Button active={true} size="small" style={{ height: 15 }} />
        ) : data ? (
          <Space split={<Divider type="vertical" />} wrap>
            <Typography.Text>ACC NO: {data?.accountNo}</Typography.Text>
            <Typography.Text>Type: {data?.customerType}</Typography.Text>
          </Space>
        ) : (
          <i>Please select a payor to proceed with the transaction.</i>
        ),
        extra: (
          <Space split={<Divider type="vertical" />}>
            {loading ? (
              <Skeleton.Button
                active={true}
                size="small"
                style={{ height: 15 }}
              />
            ) : (
              <></>
            )}
          </Space>
        ),
      }}
    />
  );
}
