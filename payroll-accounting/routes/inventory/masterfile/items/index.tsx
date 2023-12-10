import React, { useMemo, useState } from "react";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Input, Button, message, Row, Col, Form } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Item, Query } from "@/graphql/gql/graphql";
import { useDialog } from "@/hooks";
import { useQuery } from "@apollo/client";
import { GET_ITEM_RECORDS } from "@/graphql/inventory/masterfile-queries";
import UpsertItemModal from "@/components/inventory/masterfile/items/dialogs/upsertItem";
import ItemTable from "@/components/inventory/masterfile/items/itemTable";
import { FormSelect } from "@/components/common";
import {
  useItemCategory,
  useItemGroups,
  useItemBrands,
} from "@/hooks/inventory";
import UpsertAssignItemLocationModal from "@/components/inventory/masterfile/other-configurations/dialogs/upsertAssignItem";

const { Search } = Input;

export default function ItemComponent({ type }: { type: string }) {
  const modal = useDialog(UpsertItemModal);
  const assignItemModal = useDialog(UpsertAssignItemLocationModal);
  const [category, setCategory] = useState<string[]>([]);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [state, setState] = useState({
    filter: "",
    brand: null,
    status: true,
    page: 0,
    size: 10,
  });
  // ====================== queries =====================================
  const groups = useItemGroups();
  const categories = useItemCategory({ groupId: groupId });
  const brands = useItemBrands();
  const { data, loading, refetch } = useQuery<Query>(GET_ITEM_RECORDS, {
    variables: {
      filter: state.filter,
      groupId: groupId,
      category: category,
      brand: state.brand ?? "",
      type: type,
      page: state.page,
      size: state.size,
    },
    fetchPolicy: "cache-and-network",
  });

  const onUpsertRecord = (record?: Item) => {
    modal({ record: record }, (msg: string) => {
      if (msg) {
        message.success(msg);
        refetch();
      }
    });
  };

  const onAssignRecord = (record?: Item) => {
    assignItemModal({ record: record });
  };

  const title = useMemo(() => {
    let title = "All Item";
    switch (type) {
      case "medicine":
        title = "Medicine Item";
        break;
      case "production":
        title = "Material Production Item";
        break;
      case "fix":
        title = "Fix Asset Item";
        break;
      case "consignment":
        title = "Consignment Item";
        break;
      default:
        title = "All Item";
        break;
    }
    return title;
  }, [type]);

  return (
    <PageContainer
      title="Item Masterfile"
      content="Mastering Your Inventory: Configuration and Optimization of Item Masterfile.">
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
              <Col xs={24} sm={12} md={8}>
                <FormSelect
                  label="Filter Item Group"
                  propsselect={{
                    showSearch: true,
                    value: groupId,
                    options: groups,
                    allowClear: true,
                    placeholder: "Select Item Group",
                    onChange: (newValue) => {
                      setGroupId(newValue);
                      setCategory([]);
                    },
                  }}
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <FormSelect
                  label="Filter Item Category"
                  propsselect={{
                    showSearch: true,
                    mode: "multiple",
                    value: category,
                    options: categories,
                    allowClear: true,
                    placeholder: "Select Item Category",
                    onChange: (newValue) => {
                      setCategory(newValue);
                    },
                  }}
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <FormSelect
                  label="Filter Item Brand"
                  propsselect={{
                    showSearch: true,
                    value: state.brand,
                    options: brands,
                    allowClear: true,
                    placeholder: "Select Item Brand",
                    onChange: (newValue) => {
                      setState((prev) => ({ ...prev, brand: newValue }));
                    },
                  }}
                />
              </Col>
            </Row>
          </Form>
        </div>
        <ItemTable
          dataSource={data?.itemByFiltersPage?.content as Item[]}
          loading={loading}
          totalElements={data?.itemByFiltersPage?.totalElements as number}
          handleOpen={(record) => onUpsertRecord(record)}
          handleAssign={(record) => onAssignRecord(record)}
          handleSupplier={(record) => onUpsertRecord(record)}
          changePage={(page) => setState((prev) => ({ ...prev, page: page }))}
        />
      </ProCard>
    </PageContainer>
  );
}
