import React from "react";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Input, Button, message, Row, Col, Select, Form } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { FormSelect } from "@/components/common";
import AssetTable from "@/components/inventory/assets/masterfile/assetTable";
import { Assets } from "@/graphql/gql/graphql";
import { useDialog } from "@/hooks";
import UpsertAssetModal from "@/components/inventory/assets/dialogs/upsertAssetModal";
import ItemSelector from "@/components/inventory/itemSelector";
import _ from "lodash";

const { Search } = Input;
type Props = {};

export default function AssetsComponent({}: Props) {
  const modal = useDialog(UpsertAssetModal);
  const showItems = useDialog(ItemSelector);
  let title = "All Assets";

  const onUpsertRecord = (record?: Assets) => {
    modal({ record: record }, (result: any) => {
      if (result) {
        if (record?.id) {
          message.success("Item successfully added");
        } else {
          message.success("Item successfully updated");
        }
      }
    });

    // showItems(
    //   { defaultSelected: [], defaultKey: [] },
    //   () => {
    //     // if (!_.isEmpty(newItems)) {
    //     //   if (_.isEmpty(dataSource)) {
    //     //     setDataSource(newItems);
    //     //   } else {
    //     //     setDataSource((prev) => [...prev, ...newItems]);
    //     //   }
    //     // }
    //   }
    // );
  };


  return (
    <PageContainer
      title="Asset Masterfile"
      content="Mastering Your Inventory: Configuration and Optimization of Item Masterfile."
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
              //  onSearch={(e) => setState((prev) => ({ ...prev, filter: e }))}
              className="w-full"
            />
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={() => onUpsertRecord()}
            >
              Create New
            </Button>
          </ProFormGroup>
        }
      >
        <div className="w-full mb-5">
          <Form layout="vertical" className="filter-form">
            <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
                <FormSelect
                  label="Filter Item Brand"
                  propsselect={{
                    showSearch: true,
                    // value: state.brand,
                    // options: brands,
                    // allowClear: true,
                    // placeholder: "Select Item Brand",
                    // onChange: (newValue) => {
                    //   setState((prev) => ({ ...prev, brand: newValue }));
                    // },
                  }}
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <FormSelect
                  label="Filter Item Status"
                  propsselect={{
                    showSearch: true,
                    mode: "multiple",
                    // value: category,
                    // options: categories,
                    // allowClear: true,
                    // placeholder: "Select Item Category",
                    // onChange: (newValue) => {
                    //   setCategory(newValue);
                    // },
                  }}
                />
              </Col>
              
            </Row>
          </Form>
        </div>
        <AssetTable
          dataSource={[] as Assets[]}
          loading={false}
          totalElements={3 as number}
          handleOpen={(record) => {}}
          handleAssign={(record) => {}}
          handleSupplier={(record) => {}}
          changePage={(page) => {}}
        />
      </ProCard>
    </PageContainer>
  );
}
