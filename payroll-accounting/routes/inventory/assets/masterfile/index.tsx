import React, { useState } from "react";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Input, Button, message, Row, Col, Select, Form } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { FormSelect } from "@/components/common";
import AssetTable from "@/components/inventory/assets/masterfile/assetTable";
import { AssetStatus, AssetType, Assets } from "@/graphql/gql/graphql";
import { useDialog } from "@/hooks";
import UpsertAssetModal from "@/components/inventory/assets/dialogs/upsertAssetModal";
import _ from "lodash";
import useGetAssets from "@/hooks/asset/useGetAssets";
import CustomButton from "@/components/common/CustomButton";

const { Search } = Input;
type Props = {};

export interface IAssetState {
  filter: string;
  page: number;
  size: number;
  status: AssetStatus | null;
  type: AssetType | null;
}

const initialState: IAssetState = {
  filter: "",
  status: null,
  page: 0,
  size: 10,
  type: null,
};

export default function AssetsComponent({}: Props) {
  const modal = useDialog(UpsertAssetModal);
  const [state, setState] = useState(initialState);
  let title = "All Assets";

  const [data, loading, refetch] = useGetAssets({
    variables: state,
    fetchPolicy: "network-only",
  });

  const onUpsertRecord = (record?: Assets) => {
    modal({ record: record }, (result: any) => {
      if (result) {
        refetch();
        if (record?.id) {
          message.success("Item successfully added");
        } else {
          message.success("Item successfully updated");
        }
      }
    });
  };


  const assetStatusOptions = Object.values(AssetStatus).map((item) => ({
    value: item,
    label: item.replace(/_/g, " "),
  }));

  const assetTypeOptions = Object.values(AssetType).map((item) => ({
    value: item,
    label: item.replace(/_/g, " "),
  }));

  return (
    <PageContainer
      title="Asset Masterfile"
      content="Mastering Your Assets: Configuration and Optimization of Asset Masterfile."
    >
      <ProCard
        title={`${title} List`}
        headStyle={{
          flexWrap: "wrap",
        }}
        bordered
        headerBordered
        extra={
          <ProFormGroup>
            <Search
              size="middle"
              placeholder="Search here.."
              onSearch={(e) => setState((prev) => ({ ...prev, filter: e }))}
              className="w-full"
            />
            <CustomButton
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={() => onUpsertRecord()}
              allowedPermissions={["manage_asset"]}
            >
              Create New
            </CustomButton>
          </ProFormGroup>
        }
      >
        <div className="w-full mb-5">
          <Form layout="vertical" className="filter-form">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <FormSelect
                  label="Filter Asset Status"
                  propsselect={{
                    showSearch: true,
                    // mode: "tags",
                    // value: category,
                    options: assetStatusOptions,
                    allowClear: true,
                    // placeholder: "Select Item Category",
                    onChange: (newValue) => {
                      console.log("Change", newValue);
                      setState((prev) => ({ ...prev, status: newValue }));
                    },
                  }}
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <FormSelect
                  label="Filter Asset Type"
                  propsselect={{
                    showSearch: true,
                    //mode: "tags",
                    // value: category,
                    options: assetTypeOptions,
                    allowClear: true,
                    // placeholder: "Select Item Category",
                    onChange: (newValue) => {
                      setState((prev) => ({ ...prev, type: newValue }));
                    },
                  }}
                />
              </Col>
            </Row>
          </Form>
        </div>
        <AssetTable
          dataSource={data?.content as Assets[]}
          loading={false}
          totalElements={data?.totalElements as number}
          handleOpen={(record) => onUpsertRecord(record)}
          handleAssign={(record) => {}}
          handleSupplier={(record) => {}}
          changePage={(page) => {
            setState((prev) => ({ ...prev, page: page }));
          }}
        />
      </ProCard>
    </PageContainer>
  );
}
