import { Signature } from "@/graphql/gql/graphql";
import { FolderOpenOutlined } from "@ant-design/icons";
import { Row, Col, Table, Tag, Button } from "antd";
import { ColumnsType } from "antd/es/table";

interface IProps {
  dataSource: Signature[];
  loading: boolean;
  handleOpen: (record: Signature) => void;
}

export default function SignaturesTable({
  dataSource,
  loading,
  handleOpen,
}: IProps) {
  // ===================== menus ========================

  // ===================== columns ========================
  const columns: ColumnsType<Signature> = [
    {
      title: "Sequence",
      key: "sequence",
      dataIndex: "sequence",
    },
    {
      title: "Signature Header",
      dataIndex: "signatureHeader",
      key: "signatureHeader",
    },
    {
      title: "Signaturies",
      dataIndex: "signaturePerson",
      key: "signaturePerson",
      render: (text, record) => {
        if (record.currentUsers) {
          return <Tag color={"green"}>Current user</Tag>;
        } else {
          return text;
        }
      },
    },
    {
      title: "Position/Designation",
      dataIndex: "signaturePosition",
      key: "signaturePosition",
    },
    {
      title: "#",
      key: "action",
      width: 70,
      align: "center",
      fixed: "right",
      render: (_, record) => {
        return (
          <Button size="small" type="dashed" onClick={() => handleOpen(record)}>
            <FolderOpenOutlined />
          </Button>
        );
      },
    },
  ];

  return (
    <Row>
      <Col span={24}>
        <Table
          rowKey="id"
          size="small"
          columns={columns}
          dataSource={dataSource}
          pagination={{
            pageSize: 20,
            showSizeChanger: false,
          }}
          loading={loading}
          scroll={{ x: 1400 }}
        />
      </Col>
    </Row>
  );
}
