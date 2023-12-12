import { AllowanceItem, EmployeeAllowance } from "@/graphql/gql/graphql";
import useGetAllAllowancePackage from "@/hooks/allowance/useGetAllAllowancePackage";
import useGetOneAllowancePackage from "@/hooks/allowance/useGetOneAllowancePackage";
import useUpsertEmployeeAllowance from "@/hooks/employee-allowance/useUpsertEmployeeAllowance";
import NumeralFormatter from "@/utility/numeral-formatter";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Modal, Select, Space, Spin, Table } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
interface IProps {
  allowancePackageId: any;
  refetch: () => void;
  employeeAllowanceItems: EmployeeAllowance[];
}

interface AllowanceItemCustom extends AllowanceItem {
  originalAmount: number;
}

function UpsertEmployeeAllowanceModal({
  allowancePackageId,
  refetch,
  employeeAllowanceItems,
}: IProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState();

  const [packageList, loadingPackageList] = useGetAllAllowancePackage();

  const [dataSource, setDataSource] = useState<AllowanceItemCustom[]>([]);
  const [allowancePackage, loadingPackage] = useGetOneAllowancePackage(
    selectedId,
    (data) => {
      generateDataSource(data?.allowanceItems as AllowanceItem[]);
    }
  );

  const generateDataSource = (allowanceItems: AllowanceItem[]) => {
    let arr: AllowanceItemCustom[] = [];
    allowanceItems?.forEach((item) => {
      let amount;
      employeeAllowanceItems?.map((item_2) => {
        if (item_2?.allowanceId === item?.allowanceId) {
          amount = item_2.amount;
        }
      });
      let obj = {
        ...item,
        originalAmount: item?.amount,
        amount: amount || item?.amount,
      };
      arr?.push(obj);
    });
    setDataSource(arr);
  };
  const [switchPackage, loadingSwitchPackage] = useUpsertEmployeeAllowance(
    (result) => {
      if (result?.success) {
        setOpen(false);
        refetch();
      }
    }
  );

  const handleSave = () => {
    switchPackage({
      employeeId: router?.query?.id as string,
      allowancePackageId: selectedId,
    });
  };

  useEffect(() => {
    if (open) setSelectedId(allowancePackageId);
    else setSelectedId(undefined);
  }, [open]);

  useEffect(() => {
    generateDataSource(allowancePackage?.allowanceItems as AllowanceItem[]);
  }, [employeeAllowanceItems]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Original Amount",
      dataIndex: "originalAmount",
      render: (value: number) => <NumeralFormatter value={value} />,
    },
    {
      title: "Custom Amount",
      dataIndex: "amount",
      render: (value: number) => (
        <b>
          <NumeralFormatter value={value} />
        </b>
      ),
    },
    {
      title: "Allowance Type",
      dataIndex: "allowanceType",
      render: (value: string) => value?.replace("_", " "),
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
          width="80%"
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
            value={selectedId}
            allowClear
          />
          <br />
          <br />
          <Table
            size={"small"}
            dataSource={dataSource as AllowanceItemCustom[]}
            columns={columns}
            loading={loadingPackageList || loadingPackage}
          />
        </Modal>
      </Spin>
    </>
  );
}

export default UpsertEmployeeAllowanceModal;
