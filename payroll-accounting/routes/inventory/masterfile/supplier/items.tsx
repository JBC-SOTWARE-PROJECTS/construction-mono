import React, { useState } from "react";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Input, Button, message } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Query, Supplier, SupplierItem } from "@/graphql/gql/graphql";
import { useDialog } from "@/hooks";
import { useMutation, useQuery } from "@apollo/client";
import {
  GET_RECORD_ITEM_BY_SUPPLIER,
  UPSERT_RECORD_ITEM_BY_SUPPLIER,
  DELETE_RECORD_ITEM_BY_SUPPLIER,
} from "@/graphql/inventory/masterfile-queries";
import UpsertSupplierModal from "@/components/inventory/masterfile/supplier/dialogs/upsertSupplier";
import SupplierItemTable from "@/components/inventory/masterfile/supplier/supplierItemTable";
import { useSupplierObject } from "@/hooks/inventory";
import { useRouter } from "next/router";
import _ from "lodash";
import UpsertItemSupplierModal from "@/components/inventory/masterfile/other-configurations/dialogs/upsertItemSupplier";

const { Search } = Input;

export default function SupplierItemComponent() {
  const modal = useDialog(UpsertItemSupplierModal);
  const router = useRouter();
  const id = router?.query?.id as string;
  const [state, setState] = useState({
    filter: "",
  });
  // ====================== queries =====================================
  const supplier = useSupplierObject({
    id: id ?? "",
  });
  const { data, loading, refetch } = useQuery<Query>(
    GET_RECORD_ITEM_BY_SUPPLIER,
    {
      variables: {
        id: id ?? "",
        filter: state.filter,
      },
      fetchPolicy: "cache-and-network",
    }
  );

  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD_ITEM_BY_SUPPLIER,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.upsertSupplierItem?.id)) {
          message.success("Success");
          refetch();
        }
      },
    }
  );

  const [removeRecord, { loading: removeLoading }] = useMutation(
    DELETE_RECORD_ITEM_BY_SUPPLIER,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.removeItemSupplier)) {
          message.success("Item removed on this supplier");
          refetch();
        }
      },
    }
  );

  const onUpsertRecord = (record?: Supplier) => {
    modal({ id: id }, (result: any) => {
      if (result) {
        message.success(result);
        refetch();
      }
    });
  };

  const onHandleRemove = (supItemId: string) => {
    removeRecord({
      variables: {
        id: supItemId,
      },
    });
  };

  const onChangeUnitCost = (record: SupplierItem, newValue: number) => {
    // update
    let payload = _.clone(record);
    payload.supplier = { id: id };
    payload.item = { id: record?.itemId };
    payload.cost = newValue;
    //delete
    delete payload?.itemId;
    delete payload?.descLong;
    delete payload?.brand;
    delete payload?.unitMeasurement;
    delete payload?.genericName;

    upsertRecord({
      variables: {
        fields: payload,
        itemId: payload?.item?.id,
        supId: id,
        id: record?.id,
      },
    });
  };

  return (
    <PageContainer
      title="Supplier Items"
      content="Mastering Your Inventory: Configuration and Optimization of Item Masterfile.">
      <ProCard
        title={`Item List of ${supplier?.supplierFullname ?? ""}`}
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
              Assign Item
            </Button>
          </ProFormGroup>
        }>
        <div className="w-full mb-5">
          <Search
            size="middle"
            placeholder="Search here.."
            onSearch={(e) => setState((prev) => ({ ...prev, filter: e }))}
            className="w-full"
          />
        </div>
        <SupplierItemTable
          dataSource={data?.allItemBySupplier as SupplierItem[]}
          loading={loading || upsertLoading || removeLoading}
          handleRemove={(id) => onHandleRemove(id)}
          handleChangeCost={(record, value) => onChangeUnitCost(record, value)}
        />
      </ProCard>
    </PageContainer>
  );
}
