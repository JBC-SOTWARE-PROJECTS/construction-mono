import React, { useState, useEffect } from "react";
import { LoadingOutlined, DeleteOutlined } from "@ant-design/icons";
import { Row, Col, Table, Pagination, Button, App } from "antd";
import { ColumnsType } from "antd/es/table";
import {
  AssetRepairMaintenanceItems,
  RepairMaintenanceItemType,
} from "@/graphql/gql/graphql";
import { useRouter } from "next/router";
import { FormInput } from "@/components/common";
import _ from "lodash";
import { DELETE_REPAIR_MAINTENANCE_ITEM_RECORD } from "@/graphql/assets/queries";
import { useMutation } from "@apollo/client";
import ConfirmationPasswordHook from "@/hooks/promptPassword";

type IProps = {
  dataSource: AssetRepairMaintenanceItems[];
  loading: boolean;
  isUpdating: boolean;
  totalElements: number;
  handleOpen: (record: AssetRepairMaintenanceItems) => void;
  handleView: (record: AssetRepairMaintenanceItems) => void;
  handleSupplier: (record: AssetRepairMaintenanceItems) => void;
  setItemList: (list: AssetRepairMaintenanceItems[]) => void;
  changePage: (page: number) => void;
};

export default function AssetRepairMaintenanceItemTable({
  dataSource,
  loading,
  isUpdating,
  totalElements = 1,
  handleOpen,
  handleView,
  handleSupplier,
  setItemList,
  changePage,
}: IProps) {
  const { message } = App.useApp();
  const router = useRouter();
  const [showPasswordConfirmation] = ConfirmationPasswordHook();
  const [refresh, setRefresh] = useState<number | null>(null);

  useEffect(() => {
    refreshTable();
  }, [!isUpdating]);

  function refreshTable() {
    setRefresh(null);
    setTimeout(() => setRefresh(1), 100);
  }

  const [deleteItem, { loading: upsertLoading }] = useMutation(
    DELETE_REPAIR_MAINTENANCE_ITEM_RECORD,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (data) {
          message.success("Successfully removed item");
        }
      },
    }
  );

  const itemFormChange = (id: string, value: any, type: string) => {
    const udpatedList: AssetRepairMaintenanceItems[] = _.map(
      dataSource,
      (obj) => {
        if (obj.itemType == RepairMaintenanceItemType.Material) {
          if (obj.item?.id === id) {
            return { ...obj, [type]: value };
          }
        } else {
          if (obj.id === id) {
            return { ...obj, [type]: value };
          }
        }

        return obj;
      }
    );

    setItemList([...udpatedList]);
  };

  const itemRemove = (itemId: string, id: string) => {
    const udpatedList: AssetRepairMaintenanceItems[] = _.filter(
      dataSource,
      (obj) => {
        if (obj.itemType == RepairMaintenanceItemType.Material) {
          return obj.item?.id !== itemId;
        } else {
          return obj?.id !== itemId;
        }
      }
    );
    showPasswordConfirmation(() => {
      deleteItem({
        variables: {
          id: id,
        },
      }).finally(() => {
        setItemList([...udpatedList]);
        refreshTable();
      });
    });
  };

  const columns: ColumnsType<AssetRepairMaintenanceItems> = [
    {
      title: "Particular",
      dataIndex: "item",
      key: "item",
      render: (_, record) => (
        <>
          {isUpdating && record?.itemType == RepairMaintenanceItemType.Service ? (
            <FormInput
              name="description"
              propsinput={{
                placeholder: "Description",
                defaultValue: record?.description ?? "",
                onBlur: (e) => {
                  itemFormChange(record?.id, e.target.value, "description");
                },
              }}
            />
          ) : (
            <span>
              {record?.itemType == RepairMaintenanceItemType.Material
                ? record?.item?.descLong
                : record?.description}
            </span>
          )}
        </>
      ),
    },
    {
      title: "Type",
      dataIndex: "itemType",
      key: "itemType",
      width: 150,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: 150,
      render: (_, record) => (
        <>
          {isUpdating ? (
            <FormInput
              name="quantity"
              propsinput={{
                placeholder: "Quantity",
                type: "number",
                defaultValue: record?.quantity ?? 0,
                onBlur: (e) => {
                  itemFormChange(
                    record?.itemType == RepairMaintenanceItemType.Material
                      ? record.item?.id
                      : record?.id,
                    parseInt(e.target.value),
                    "quantity"
                  );
                },
              }}
            />
          ) : (
            <>{record?.quantity}</>
          )}
        </>
      ),
    },
    {
      title: "Base Price",
      dataIndex: "basePrice",
      key: "basePrice",
      width: 150,
      render: (_, record) => (
        <>
          {isUpdating ? (
            <FormInput
              name="Unit Cost"
              propsinput={{
                placeholder: "Unit Cost",
                type: "number",
                defaultValue: record?.basePrice,
                onBlur: (e) => {
                  itemFormChange(
                    record?.itemType == RepairMaintenanceItemType.Material
                      ? record.item?.id
                      : record?.id,
                    parseInt(e.target.value),
                    "basePrice"
                  );
                },
              }}
            />
          ) : (
            <>{record?.basePrice}</>
          )}
        </>
      ),
    },
    {
      title: "Action",
      dataIndex: "",
      key: "",
      width: "10%",
      fixed: "right",
      render: (_, record) => {
        return (
          <>
            {isUpdating ? (
              <Row gutter={5}>
                <Col>
                  <Button
                    icon={<DeleteOutlined />}
                    type="primary"
                    onClick={() => {
                      if (
                        confirm("Are you sure you want to remove this item?")
                      ) {
                        itemRemove(
                          record?.itemType == RepairMaintenanceItemType.Material
                            ? record.item?.id
                            : record?.id,
                          record?.id
                        );
                      }
                    }}
                  />
                </Col>
              </Row>
            ) : (
              <></>
            )}
          </>
        );
      },
    },
  ];

  return (
    <Row>
      <Col span={24}>
        {refresh ? (
          <Table
            rowKey="id"
            size="small"
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            loading={loading}
            footer={() => (
              <Pagination
                showSizeChanger={false}
                pageSize={10}
                responsive={true}
                total={totalElements}
                onChange={(e) => {
                  changePage(e - 1);
                }}
              />
            )}
          />
        ) : (
          <div className="items-center">
            <LoadingOutlined />
          </div>
        )}
      </Col>
    </Row>
  );
}
