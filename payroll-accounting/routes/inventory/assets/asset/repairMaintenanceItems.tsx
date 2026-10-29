import React, { useState, useEffect } from "react";
import { ProCard, ProFormGroup } from "@ant-design/pro-components";
import { Input, Button, App } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useDialog } from "@/hooks";
import { AssetRepairMaintenanceItems, Item, RepairMaintenanceItemType } from "@/graphql/gql/graphql";
import AssetRepairMaintenanceItemTable from "@/components/inventory/assets/masterfile/assetRepairMaintenanceItem";
import ItemSelector from "@/components/inventory/itemSelector";
import _ from "lodash";
import useGetAssetRepairMaintenanceItem from "@/hooks/asset/useGetAssetRepairMaintenanceItem";
import { UPSERT_MP_REPAIR_MAINTENANCE_ITEM_RECORD } from "@/graphql/assets/queries";
import { useMutation } from "@apollo/client";
import ConfirmationPasswordHook from "@/hooks/promptPassword";
import UpsertRepairMaintenenceServiceModal from "@/components/inventory/assets/dialogs/upsertRepairMaintenenceServiceModal";

type RepairMaintenanceItemRow = AssetRepairMaintenanceItems & {
  sourceOfficeId?: string | null;
};

type SelectedInventoryItem = {
  item: Item;
  office?: {
    id?: string | null;
  };
};

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
  const [state, setState] = useState(initialState);
  const [isUpdating, setIsUpdating] = useState(false);
  const [itemList, setItemList] = useState<RepairMaintenanceItemRow[]>([]);
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
          setIsUpdating(false);
          refetch();
          message.success("Items successfully added");
        }
      },
      onError: (error) => {
        message.error(error.message);
      },
    }
  );

  const onOpenItemSelector = () => {
    showItems(
      { defaultSelected: [], defaultKey: [], isSingleSelection: false },
      (newItems: SelectedInventoryItem[]) => {
        if (!_.isEmpty(newItems) && newItems.length > 0) {
          newItems.forEach((n) => {
            const isExist = _.filter(itemList, (e) => {
              return e.item?.id === n.item.id;
            });

            if (isExist.length == 0) {
              itemList.push({
                id: null,
                quantity: 1,
                item: n?.item,
                itemType: RepairMaintenanceItemType.Material,
                basePrice: null,
                sourceOfficeId: n.office?.id,
              });

              setItemList([...itemList]);
            }
          });

          setIsUpdating(true);
        }
      }
    );
  };

  const onUpsertService = () => {
    showUpsertService({ rmId }, () => {
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
        office: item.sourceOfficeId,
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
              <Button type="primary" loading={upsertLoading} onClick={() => onSave()}>
                Save
              </Button>
            ) : (
              <></>
            )}
          </ProFormGroup>
        }
      >
        <AssetRepairMaintenanceItemTable
          dataSource={itemList}
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
