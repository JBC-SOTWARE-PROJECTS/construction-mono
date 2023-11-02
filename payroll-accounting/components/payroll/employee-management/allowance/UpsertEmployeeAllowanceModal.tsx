import { AllowanceItem } from "@/graphql/gql/graphql";
import useGetAllAllowancePackage from "@/hooks/allowance/useGetAllAllowancePackage";
import useGetOneAllowancePackage from "@/hooks/allowance/useGetOneAllowancePackage";
import useUpsertEmployeeAllowance from "@/hooks/employee-allowance/useUpsertEmployeeAllowance";
import NumeralFormatter from "@/utility/numeral-formatter";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Modal, Select, Space, Spin, Table } from "antd";
import { useRouter } from "next/router";
import React, { useState } from "react";

function UpsertEmployeeAllowanceModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState();

  const [packageList, loadingPackageList] = useGetAllAllowancePackage();
  const [allowancePackage, loadingPackage] =
    useGetOneAllowancePackage(selectedId);

  const [switchPackage, loadingSwitchPackage] = useUpsertEmployeeAllowance(
    (result) => {
      if (result?.success) {
        setOpen(false);
      }
    }
  );

  const handleSave = () => {
    switchPackage({
      employeeId: router?.query?.id as string,
      allowancePackageId: selectedId,
    });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (value: number) => <NumeralFormatter value={value} />,
    },
    {
      title: "Allowance Type",
      dataIndex: "allowanceType",
    },
  ];

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        icon={<EditOutlined />}
        type="primary"
        ghost
      >
        Update Allowance Package
      </Button>
      <Spin
        spinning={loadingPackageList || loadingPackage || loadingSwitchPackage}
      >
        <Modal
          open={open}
          onCancel={() => {
            setOpen(false);
          }}
          title="Employee Allowance"
          footer={
            <Space>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                loading={false}
                icon={<SaveOutlined />}
                onClick={handleSave}
              >
                Save
              </Button>
            </Space>
          }
        >
          <label style={{ marginRight: 10 }}>Select Allowance Package: </label>
          <Select
            style={{ width: "100%" }}
            options={packageList?.map((item: AllowanceItem) => ({
              label: item.name,
              value: item.id,
            }))}
            onChange={(value) => {
              setSelectedId(value);
            }}
            allowClear
          />
          <br />
          <br />
          <Table
            size={"small"}
            dataSource={allowancePackage?.allowanceItems as AllowanceItem[]}
            columns={columns}
            loading={loadingPackageList || loadingPackage}
          />
        </Modal>
      </Spin>
    </>
  );
}

export default UpsertEmployeeAllowanceModal;
