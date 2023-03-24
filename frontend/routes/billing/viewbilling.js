import React from "react";
import { Row, Col, Tabs, message, Skeleton, Divider, Modal } from "antd";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useLocalStorage } from "../../util/customhooks";
import BillingHeader from "./component/billingHeader";
import BillingHeaderOTC from "./component/billingHeaderOTC";
import _ from "lodash";
import TableItems from "./component/tableItems";

const TabPane = Tabs.TabPane;
const { confirm } = Modal;
//graphQL Queries
const GET_RECORDS = gql`
  query ($id: UUID) {
    b: billingById(id: $id) {
      id
      dateTrans
      billNo
      project {
        id
        projectCode
        description
      }
      customer {
        id
        fullName
        customerType
        address
        telNo
        emailAdd
      }
      otcName
      locked
      lockedBy
      balance
      totals
      deductions
      payments
      status
    }
  }
`;

const LOCKED = gql`
  mutation ($id: UUID, $type: String) {
    upsert: lockBilling(id: $id, type: $type) {
      id
    }
  }
`;

const CLOSED_BILLING = gql`
  mutation ($id: UUID, $type: String) {
    upsert: closeBilling(id: $id, type: $type) {
      id
    }
  }
`;

const ViewBillingContent = ({ account, id, type }) => {
  const [active, setActive] = useLocalStorage("billingTab", "items");
  const { loading, data, refetch } = useQuery(GET_RECORDS, {
    variables: {
      id: id,
    },
    fetchPolicy: "network-only",
  });

  const [lockedRecord, { loading: lockedLoading }] = useMutation(LOCKED, {
    ignoreResults: false,
    onCompleted: (data) => {
      if (!_.isEmpty(data?.upsert?.id)) {
        message.success("Billing Locked/Unlocked");
        refetch();
      }
    },
  });

  const [closedRecord, { loading: closedLoading }] = useMutation(
    CLOSED_BILLING,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.upsert?.id)) {
          message.success("Billing Closed");
          refetch();
        }
      },
    }
  );

  const onLocked = (message) => {
    confirm({
      title: `Do you want ${message} this Billing?`,
      icon: <ExclamationCircleOutlined />,
      content: "Please click ok to proceed.",
      onOk() {
        lockedRecord({
          variables: {
            id: _.get(data, "b.id"),
            type: message,
          },
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const onClosed = (e) => {
    confirm({
      title: `Do you want ${e} this Billing?`,
      icon: <ExclamationCircleOutlined />,
      content: "All the deduction will be deleted. Please click ok to proceed.",
      onOk() {
        if (_.get(data, "b.balance") === 0) {
          closedRecord({
            variables: {
              id: _.get(data, "b.id"),
              type: e,
            },
          });
        } else {
          message.error(`Cannot ${e} folio. Please contact administrator`);
        }
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const callback = (e) => {
    setActive(e);
  };

  return (
    <Row>
      <Col span={24}>
        {loading ? (
          <Skeleton active />
        ) : (
          <>
            {type === "PROJECT" && (
              <BillingHeader
                record={_.get(data, "b")}
                onLocked={(e) => onLocked(e)}
                loading={lockedLoading}
                loadingClose={closedLoading}
                onClose={(e) => onClosed(e)}
              />
            )}
            {type === "OTC" && (
              <BillingHeaderOTC
                record={_.get(data, "b")}
                onLocked={(e) => onLocked(e)}
                loading={lockedLoading}
                loadingClose={closedLoading}
                onClose={(e) => onClosed(e)}
              />
            )}
          </>
        )}
      </Col>
      <Col span={24}>
        <Divider />
        <Tabs
          onChange={callback}
          type="card"
          destroyInactiveTabPane={true}
          activeKey={active}
        >
          <TabPane tab="Items" key="items">
            <TableItems
              type={["ITEM"]}
              id={id}
              officeId={account?.office?.id}
              reload={() => refetch()}
              transType={type}
              locked={_.get(data, "b.locked")}
              status={_.get(data, "b.status")}
              isGovernment={
                _.get(data, "b.customer.customerType") == "GOVERNMENT"
                  ? true
                  : false
              }
            />
          </TabPane>
          <TabPane tab="Services" key="services">
            <TableItems
              type={["SERVICE"]}
              id={id}
              officeId={account?.office?.id}
              reload={() => refetch()}
              transType={type}
              locked={_.get(data, "b.locked")}
              status={_.get(data, "b.status")}
              isProject={!_.isEmpty(_.get(data, "b.project.id"))}
              isGovernment={
                _.get(data, "b.customer.customerType") == "GOVERNMENT"
                  ? true
                  : false
              }
            />
          </TabPane>
          {/* <TabPane tab="Misc. Services" key="misc">
            <TableItems
              type={["MISC"]}
              id={id}
              officeId={account?.office?.id}
              reload={() => refetch()}
              transType={type}
              locked={_.get(data, "b.locked")}
              status={_.get(data, "b.status")}
            />
          </TabPane> */}
          <TabPane tab="Deductions" key="deductions">
            <TableItems
              type={["DEDUCTIONS"]}
              id={id}
              officeId={account?.office?.id}
              reload={() => refetch()}
              transType={type}
              locked={_.get(data, "b.locked")}
              status={_.get(data, "b.status")}
            />
          </TabPane>
          <TabPane tab="Payments" key="payments">
            <TableItems
              type={["PAYMENTS"]}
              id={id}
              officeId={account?.office?.id}
              reload={() => refetch()}
              transType={type}
              locked={_.get(data, "b.locked")}
              status={_.get(data, "b.status")}
            />
          </TabPane>
        </Tabs>
      </Col>
    </Row>
  );
};

export default ViewBillingContent;
