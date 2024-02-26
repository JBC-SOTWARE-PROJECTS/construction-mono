import CustomButton from "@/components/common/CustomButton";
import { IPMState } from "@/components/inventory/assets/dialogs/vehicleUsageAttachment";
import AssetRentalRateTable from "@/components/inventory/assets/masterfile/assetRentalRateTable";
import { RentalRates } from "@/graphql/gql/graphql";
import useGetRentalRateByAsset from "@/hooks/asset/useGetRentalRateByAsset";
import { PlusCircleOutlined } from "@ant-design/icons";
import { ProCard, ProFormGroup } from "@ant-design/pro-components";
import { Input, message } from "antd";
import { useRouter } from "next/router";
import React , {useState} from "react";
import { useDialog } from "@/hooks";
import UpsertRentalRatesModal from "@/components/inventory/assets/dialogs/upsertRentalRates";

type Props = {}
const { Search } = Input;;

const initialState: IPMState = {
    filter: "",
    page: 0,
    size: 10,
  };

const AssetRentalRates = (props: Props) => {
    const modal = useDialog(UpsertRentalRatesModal);
    const router = useRouter();
    const [state, setState] = useState(initialState);

    const [rates, loadingAsset, refetch] = useGetRentalRateByAsset({
        variables: {
          ...state,
          id: router?.query?.id,
        },
        fetchPolicy: "network-only",
      });

      const onUpsertRecord = (record?: any) => {
        modal({ record: record , assetId: router?.query?.id}, (result: any) => {
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

  return (
    <div>
        <ProCard
        title={``}
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
              onSearch={(e: any) => setState((prev) => ({ ...prev, filter: e }))}
              className="w-full"
            />
            <CustomButton
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={() => onUpsertRecord()}
              allowedPermissions={["manage_pms"]}
            >
              Create New
            </CustomButton>
          </ProFormGroup>
        }
      >
      <AssetRentalRateTable
        dataSource={rates?.content as RentalRates[]}
        loading={false}
        totalElements={rates?.totalElements as number}
        handleOpen={(record) => {}}
        changePage={(page) => {
            setState((prev) => ({ ...prev, page: page }));
        }}
      />
      </ProCard>
    </div>
  );
};

export default AssetRentalRates;
