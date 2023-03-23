import React from "react";
import {
  Table,
  message,
  Button,
  Typography,
  Tag,
  Collapse,
  Divider,
  List,
  Skeleton,
} from "antd";
import _ from "lodash";
import moment from "moment";
import { dialogHook } from "../../../util/customhooks";
import ProjectMilestone from "../dialogs/addProjectMilestone";
import AddProjectUpdatesNotes from "../dialogs/addProjectUpdatesNotes";

const { Text } = Typography;
const { Panel } = Collapse;
//graphQL Queries

const ProjectUpdatesContent = ({
  obj,
  color,
  loading,
  onEditMilestone = () => {},
  projectId,
  parentRefresh = () => {},
}) => {
  const [modalMaterials, showModalmaterials] = dialogHook(
    ProjectMilestone,
    (result) => {
      if (result) {
        message.success(result);
      }
      parentRefresh();
    }
  );

  const [modalNotes, showModalNotes] = dialogHook(
    AddProjectUpdatesNotes,
    (result) => {
      if (result) {
        message.success(result);
      }
      parentRefresh();
    }
  );

  const columns = [
    {
      title: "Date of Transaction",
      dataIndex: "dateTransact",
      key: "dateTransact",
      render: (text, record) => {
        if (record.status) {
          return <span>{moment(text).format("MM-DD-YYYY h:mm a")}</span>;
        } else {
          return (
            <Text delete type="danger">
              {moment(text).format("MM-DD-YYYY h:mm a")}
            </Text>
          );
        }
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "60%",
      render: (text, record) => {
        if (record.status) {
          return <span>{text}</span>;
        } else {
          return (
            <Text delete type="danger">
              {text}
            </Text>
          );
        }
      },
    },
    {
      title: "Qty (Unit)",
      dataIndex: "unit",
      key: "unit",
      render: (status, record) => {
        if (record.status) {
          return <Tag color="blue">{status}</Tag>;
        } else {
          return (
            <Text delete>
              <Tag>{cost}</Tag>
            </Text>
          );
        }
      },
    },
    {
      title: "User",
      dataIndex: "lastModifiedBy",
      key: "lastModifiedBy",
      render: (lastModifiedBy) => {
        return <Tag color="magenta">{lastModifiedBy}</Tag>;
      },
    },
    {
      title: "#",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <Button
          type="primary"
          size="small"
          // onClick={() =>
          //   showModal({ show: true, myProps: { ...record, project: id } })
          // }
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <>
      <Collapse
        collapsible="header"
        defaultActiveKey={[obj.id]}
        destroyInactivePanel={true}
      >
        <Panel
          header={obj.description}
          extra={
            <span>
              <Tag color={color} className="margin-y-0">
                {obj.status}
              </Tag>
              <Tag
                color="#2db7f5"
                className="margin-y-0 cursor-pointer"
                onClick={onEditMilestone}
              >
                Edit
              </Tag>
            </span>
          }
          key={obj.id}
        >
          <div className="w-full">
            <Button
              size="small"
              className="margin-y-0"
              type="primary"
              onClick={() =>
                showModalNotes({
                  show: true,
                  myProps: { parent: obj, project: projectId },
                })
              }
            >
              Add Remarks/Notes
            </Button>
          </div>
          <Divider>Remarks Notes</Divider>
          <List
            loading={false}
            itemLayout="horizontal"
            // loadMore={loadMore}
            dataSource={obj.notes}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button
                    onClick={() =>
                      showModalNotes({
                        show: true,
                        myProps: { ...item, parent: obj, project: projectId },
                      })
                    }
                    key="list-loadmore-edit"
                    size="small"
                    type="primary"
                  >
                    Edit
                  </Button>,
                ]}
              >
                <Skeleton avatar title={false} loading={loading} active>
                  <List.Item.Meta
                    title={item.remarks}
                    description={
                      <small className="opacity-60 font-semibold">{`${
                        item.user.fullName
                      } - ${moment(item.dateTransact).fromNow()}`}</small>
                    }
                  />
                </Skeleton>
              </List.Item>
            )}
          />
          <Divider>Materials Used</Divider>
          <div className="w-full">
            <Button
              size="small"
              className="margin-y-0"
              type="primary"
              onClick={() =>
                showModalmaterials({
                  show: true,
                  myProps: { parent: obj, project: projectId },
                })
              }
            >
              Add Materials
            </Button>
          </div>
          <Table
            loading={loading}
            className="gx-table-responsive"
            columns={columns}
            dataSource={[]}
            rowKey={(record) => record.id}
            size="small"
          />
        </Panel>
      </Collapse>
      {modalMaterials}
      {modalNotes}
    </>
  );
};

export default ProjectUpdatesContent;
