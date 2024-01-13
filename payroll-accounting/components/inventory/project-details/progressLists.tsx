import React, { useContext, useMemo } from "react";
import { ProjectProgress } from "@/graphql/gql/graphql";
import { Row, Col, Collapse, Tag, Button, Empty, Spin, Pagination } from "antd";
import type { CollapseProps } from "antd";
import _ from "lodash";
import { EditOutlined } from "@ant-design/icons";
import ProgressDetails from "./common/progressDetails";
import { AccountContext } from "@/components/accessControl/AccountContext";
import { accessControl } from "@/utility/helper";

interface IProps {
  dataSource: ProjectProgress[];
  loading: boolean;
  totalElements: number;
  handleOpen: (record: ProjectProgress) => void;
  handleChangePage: (page: number) => void;
}

export default function ProgressLists({
  dataSource,
  loading,
  totalElements,
  handleOpen,
  handleChangePage,
}: IProps) {
  // ===================== menus ========================
  const account = useContext(AccountContext);
  const genExtra = (record: ProjectProgress) => (
    <>
      <Tag color={record?.status === "ACTIVE" ? "green" : "default"}>
        {record?.status}
      </Tag>
      <Tag color="cyan">{record?.createdBy}</Tag>
      <Button
        size="small"
        type="dashed"
        disabled={
          record?.status === "ACTIVE"
            ? false
            : accessControl(account?.user?.access, "overwrite_lock_progress")
        }
        onClick={(event) => {
          // If you don't want click extra trigger collapse, you can prevent this:
          event.stopPropagation();
          handleOpen(record);
        }}
        icon={<EditOutlined />}
      />
    </>
  );

  const itemLists = useMemo(() => {
    const items: CollapseProps["items"] = (dataSource || []).map(
      (obj: ProjectProgress) => {
        return {
          key: obj.id,
          label: `[${obj.transNo}] ${obj.description}`,
          children: <ProgressDetails record={obj} />,
          extra: genExtra(obj),
        };
      }
    );
    return items;
  }, [dataSource]);

  return (
    <Row>
      <Col span={24}>
        <Spin spinning={loading} tip="Loading...">
          <div className="w-full">
            {_.isEmpty(itemLists) ? (
              <Empty />
            ) : (
              <Collapse
                defaultActiveKey={[`${itemLists[0]?.key}`]}
                size="small"
                destroyInactivePanel={true}
                items={itemLists}
              />
            )}
            {totalElements ? (
              <div className="w-full project-accomplishments-pagination">
                <Pagination
                  defaultCurrent={1}
                  total={totalElements}
                  onChange={(e) => handleChangePage(e - 1)}
                />
              </div>
            ) : null}
          </div>
        </Spin>
      </Col>
    </Row>
  );
}
