import React, { useState } from "react";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Input, Button, message, Row, Col, Form } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Signature, Query } from "@/graphql/gql/graphql";
import { useDialog } from "@/hooks";
import { useQuery } from "@apollo/client";
import { GET_RECORDS_SIGNATURES } from "@/graphql/inventory/masterfile-queries";
import UpsertSignatureModal from "@/components/inventory/signatures/dialogs/upsertSignatures";
import SignaturesTable from "@/components/inventory/signatures/signaturesTable";

const { Search } = Input;

interface IProps {
  type: string;
  title: string;
}

export default function SignaturiesComponent({ type, title }: IProps) {
  const modal = useDialog(UpsertSignatureModal);
  const [state, setState] = useState({
    filter: "",
  });
  // ====================== queries =====================================

  const { data, loading, refetch } = useQuery<Query>(GET_RECORDS_SIGNATURES, {
    variables: {
      type: type,
      filter: state.filter,
    },
    fetchPolicy: "cache-and-network",
  });

  const onUpsertRecord = (record?: Signature) => {
    modal({ record: { ...record, signatureType: type } }, (result: any) => {
      if (result) {
        if (record?.id) {
          message.success("Signaturies Setup successfully updated");
        } else {
          message.success("Signaturies Setup successfully added");
        }
        refetch();
      }
    });
  };

  return (
    <PageContainer
      title="Signaturies Masterfile"
      content="Mastering Your Inventory: Configuration and Optimization of Item Masterfile.">
      <ProCard
        title={`${title}`}
        headStyle={{
          flexWrap: "wrap",
        }}
        bordered
        headerBordered
        extra={
          <ProFormGroup>
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={() => onUpsertRecord()}>
              Create New
            </Button>
          </ProFormGroup>
        }>
        <div className="w-full mb-5">
          <Form layout="vertical" className="filter-form">
            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <Search
                  size="middle"
                  placeholder="Search here.."
                  onSearch={(e) => setState((prev) => ({ ...prev, filter: e }))}
                  className="w-full"
                />
              </Col>
            </Row>
          </Form>
        </div>
        <SignaturesTable
          dataSource={data?.signatureListFilter as Signature[]}
          loading={loading}
          handleOpen={(record) => onUpsertRecord(record)}
        />
      </ProCard>
    </PageContainer>
  );
}
