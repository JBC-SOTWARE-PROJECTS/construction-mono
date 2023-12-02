import React, { useState, useEffect } from "react";
import { ProCard, ProFormGroup } from "@ant-design/pro-components";
import { Input, Button, App } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useDialog } from "@/hooks";
import { useRouter } from "next/router";
import { AssetRepairMaintenanceItems, Item, RepairMaintenanceItemType } from "@/graphql/gql/graphql";
import UpsertRepairMaintenanceModal from "@/components/inventory/assets/dialogs/upsertAssetRepairMaintenance";
import ViewRepairMaintenance from "@/components/inventory/assets/dialogs/viewRepairMaintenance";
import AssetRepairMaintenanceItemTable from "@/components/inventory/assets/masterfile/assetRepairMaintenanceItem";
import ItemSelector from "@/components/inventory/itemSelector";
import _ from "lodash";
import useGetAssetRepairMaintenanceItem from "@/hooks/asset/useGetAssetRepairMaintenanceItem";
import {
  UPSERT_MP_REPAIR_MAINTENANCE_ITEM_RECORD,
  UPSERT_REPAIR_MAINTENANCE_ITEM_RECORD,
} from "@/graphql/assets/queries";
import { useMutation } from "@apollo/client";
import ConfirmationPasswordHook from "@/hooks/promptPassword";
import UpsertRepairMaintenenceServiceModal from "@/components/inventory/assets/dialogs/upsertRepairMaintenenceServiceModal";

type Props = {
  rmId: string | null;
};
const { Search } = Input;

export interface IPMState {
  filter: string;
  rmId: string | null;
  page: number;
  size: number;
}

const initialState: IPMState = {
  rmId: null,
  filter: "",
  page: 0,
  size: 10,
};

export default function AssetRepairMaintenanceItemsComponent({ rmId }: Props) {
  const [showPasswordConfirmation] = ConfirmationPasswordHook();
  const showItems = useDialog(ItemSelector);
  const showUpsertService = useDialog(UpsertRepairMaintenenceServiceModal);
  const router = useRouter();
  const [state, setState] = useState(initialState);
  const [isUpdating, setIsUpdating] = useState(false);
  const [itemList, setItemList] = useState<AssetRepairMaintenanceItems[]>([]);
  const { message } = App.useApp();

  const [data, loading, refetch] = useGetAssetRepairMaintenanceItem({
    variables: {
      ...state,
      rmId: rmId,
    },
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (data) {
      setItemList(data?.content);
    }
  }, [data]);

  const [upsert, { loading: upsertLoading }] = useMutation(
    UPSERT_MP_REPAIR_MAINTENANCE_ITEM_RECORD,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (data) {
          setIsUpdating(false)
          message.success("Items successfully added");
        }
      },
    }
  );

  const onOpenItemSelector = (record?: AssetRepairMaintenanceItems) => {
    showItems({ defaultSelected: [], defaultKey: [] }, (newItems: Item[]) => {
      if (!_.isEmpty(newItems)) {
        var listSelected: AssetRepairMaintenanceItems[] = [];
        if (newItems.length > 0) {
          newItems.map((n: any) => {
            const isExist = _.filter(itemList, (e) => {
              return e.item?.id === n.item.id;
            });

            if (isExist.length == 0) {
              itemList.push({
                id: null,
                quantity: 1,
                item: n?.item,
                itemType: RepairMaintenanceItemType.Material,
                basePrice: n.actualUnitCost,
              });

              setItemList([...itemList]);
            }
          });

          setIsUpdating(true);
        }
      }
    });
  };

  const onUpsertService = (record?: AssetRepairMaintenanceItems) => {
    showUpsertService({ rmId}, (data: any) => {
      refetch();
    });
  };

  const onSave = () => {
    var payload: any = [];

    itemList.map((item) => {
      payload.push({
        id: item.id,
        quantity: item.quantity,
        item: item.item?.id,
        basePrice: item.basePrice,
        itemType: item?.itemType,
        description: item?.description,
        assetRepairMaintenance: rmId,
      });
    });

    showPasswordConfirmation(() => {
      upsert({
        variables: {
          items: payload,
        },
      });
    });
  };

  return (
    <>
      <ProCard
        title={`All Used Items`}
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
              onClick={() => onOpenItemSelector()}
            >
              Add Items
            </Button>
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={() => onUpsertService()}
            >
              Add Service
            </Button>
            <Button type="default" onClick={() => setIsUpdating(!isUpdating)}>
              {isUpdating ? "Read Only" : "Update"}
            </Button>
            {isUpdating ? (
              <Button type="primary" onClick={() => onSave()}>
                Save
              </Button>
            ) : (
              <></>
            )}
          </ProFormGroup>
        }
      >
        <AssetRepairMaintenanceItemTable
          dataSource={itemList as AssetRepairMaintenanceItems[]}
          setItemList={(list) => setItemList([...list])}
          isUpdating={isUpdating}
          loading={false}
          totalElements={0 as number}
          handleOpen={(record) => {}}
          handleView={(record) => {}}
          handleSupplier={(record) => {}}
          changePage={(page) => {
            //setState((prev) => ({ ...prev, page: page }));
          }}
        />
      </ProCard>
    </>
  );
}
