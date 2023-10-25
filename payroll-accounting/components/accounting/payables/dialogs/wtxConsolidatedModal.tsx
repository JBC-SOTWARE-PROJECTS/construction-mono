import FormTextArea from "@/components/common/formTextArea/formTextArea";
import { Wtx2307 } from "@/graphql/gql/graphql";
import { UPSERT_CONSOLIDATED_WTX } from "@/graphql/payables/wtx-queries";
import { useConfirmationPasswordHook } from "@/hooks";
import { currency } from "@/utility/constant";
import { DateFormatter, NumberFormater } from "@/utility/helper";
import { FilterDates, OptionsValue } from "@/utility/interfaces";
import { ReconciliationOutlined, SaveOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import {
  Button,
  Col,
  Divider,
  Form,
  Modal,
  Row,
  Space,
  Table,
  Tag,
  Typography,
  App,
} from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import _ from "lodash";

interface IProps {
  hide: (hideProps: any) => void;
  items: Wtx2307[];
  supplier: OptionsValue;
  filterDates: FilterDates;
}

export default function WTXConsolidatedModal(props: IProps) {
  const { message } = App.useApp();
  const { hide, items, supplier, filterDates } = props;
  const [showPasswordConfirmation] = useConfirmationPasswordHook();
  const [upsert, { loading: upsertLoading }] = useMutation(
    UPSERT_CONSOLIDATED_WTX,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (data) {
          hide(data);
        }
      },
    }
  );
  //================== functions ====================
  const onFinishFailed = () => {
    message.error("Something went wrong. Please contact administrator.");
  };

  const onSubmit = (values: any) => {
    let payload = {
      dateFrom: dayjs(filterDates.start),
      dateTo: dayjs(filterDates.end),
      ...values,
    };
    if (_.size(items) > 10) {
      return message.error(
        "Up Ten (10) 2307 can be consolidated. Please try again."
      );
    } else {
      showPasswordConfirmation(() => {
        upsert({
          variables: {
            fields: payload,
            items: items,
            id: null,
            supplier: supplier?.value,
          },
        });
      });
    }
  };

  // ================ columns ================================
  const columns: ColumnsType<Wtx2307> = [
    {
      title: "Date",
      dataIndex: "wtxDate",
      key: "wtxDate",
      width: 125,
      render: (text) => <span>{DateFormatter(text)}</span>,
    },
    {
      title: "Source Document",
      dataIndex: "sourceDoc",
      key: "sourceDoc",
      render: (text, record) => <span key={text}>{text ?? record?.refNo}</span>,
    },
    {
      title: "Ref. No",
      dataIndex: "refNo",
      key: "refNo",
    },
    {
      title: "Supplier/Payee",
      dataIndex: "supplier.supplierFullname",
      key: "supplier.supplierFullname",
      render: (text, record) => (
        <span key={text}>{record.supplier?.supplierFullname}</span>
      ),
    },
    {
      title: "Amount",
      dataIndex: "ewtAmount",
      key: "ewtAmount",
      align: "right",
      render: (amount) => (
        <span>
          <small>{currency} </small>
          {NumberFormater(amount)}
        </span>
      ),
    },
  ];

  return (
    <Modal
      title={
        <Typography.Title level={4}>
          <Space align="center">
            <ReconciliationOutlined /> Consolidate 2307:
            {supplier?.value && <Tag color="magenta">{supplier?.label}</Tag>}
          </Space>
        </Typography.Title>
      }
      destroyOnClose={true}
      maskClosable={false}
      open={true}
      width={"100%"}
      style={{ maxWidth: "1400px" }}
      onCancel={() => hide(false)}
      footer={
        <Space>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            form="wtxForm"
            loading={upsertLoading}
            icon={<SaveOutlined />}>
            Save & Close
          </Button>
        </Space>
      }>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <p>
            <span className="font-bold">Date From: </span>
            {dayjs(filterDates.start).format("MMM DD, YYYY")}
          </p>
          <p>
            <span className="font-bold">Date to: </span>
            {dayjs(filterDates.end).format("MMM DD, YYYY")}
          </p>
          <Divider className="my-5" />
          <Form
            name="wtxForm"
            layout="vertical"
            initialValues={{ remarks: "" }}
            onFinish={onSubmit}
            onFinishFailed={onFinishFailed}>
            <FormTextArea
              label="Remarks/Notes"
              name="remarks"
              propstextarea={{
                placeholder: "Remarks/Notes",
              }}
            />
          </Form>
        </Col>
        <Col span={24}>
          <Table
            rowKey="id"
            size="small"
            columns={columns}
            dataSource={items}
            pagination={false}
          />
        </Col>
      </Row>
    </Modal>
  );
}
