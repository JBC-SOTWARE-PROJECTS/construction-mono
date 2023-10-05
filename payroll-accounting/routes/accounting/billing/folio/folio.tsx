import React, { useState } from "react";
import { Card, Button } from "antd";
import { Billing, Query } from "@/graphql/gql/graphql";
import { useQuery } from "@apollo/client";
import { GET_BILLING_INFO_BY_ID } from "@/graphql/billing/queries";
import { PrinterOutlined } from "@ant-design/icons";
import BillingHeader from "@/components/accounting/billing/component/billingHeader";
import BillingTables from "@/components/accounting/billing/component/billingTables";
import _ from "lodash";

interface Iprops {
  id?: string;
}

export default function BillingFolioComponent(props: Iprops) {
  const { id } = props;
  const [billingInfo, setBillingInfo] = useState<Billing>({});

  const { refetch } = useQuery<Query>(GET_BILLING_INFO_BY_ID, {
    fetchPolicy: "cache-and-network",
    variables: {
      id: id,
    },
    onCompleted: (data) => {
      let result = data?.billingById as Billing;
      if (result?.id) {
        setBillingInfo(result);
      }
    },
  });

  const onRefetchBillingInfo = () => {
    refetch({ id: id });
  };

  return (
    <>
      <Card
        title="Billing Folio Details"
        size="small"
        extra={
          <>
            <Button size="small" type="primary" icon={<PrinterOutlined />}>
              Print Billing Statement
            </Button>
          </>
        }>
        <BillingHeader
          record={billingInfo}
          onRefetchBillingInfo={onRefetchBillingInfo}
          otc={!_.isEmpty(billingInfo.otcName)}
        />
      </Card>
      <BillingTables
        record={billingInfo}
        billingId={id}
        onRefetchBillingInfo={onRefetchBillingInfo}
      />
    </>
  );
}
