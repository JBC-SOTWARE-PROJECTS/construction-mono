import React from "react";
import {
  Table,
  message,
  Button,
  Tag,
  Collapse,
  Divider,
  List,
  Skeleton,
  Modal,
  Statistic,
} from "antd";
import _ from "lodash";
import moment from "moment";
import { dialogHook } from "../../../util/customhooks";
import ProjectMaterialsModal from "../dialogs/addProjectMaterials";
import AddProjectUpdatesNotes from "../dialogs/addProjectUpdatesNotes";
import numeral from "numeral";
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";

const { Panel } = Collapse;
const { confirm } = Modal;
//graphQL Queries
const DELETE_RECORD = gql`
  mutation ($id: UUID) {
    upsert: removedMaterial(id: $id) {
      id
    }
  }
`;

const ProjectUpdatesContent = ({
  obj,
  color,
  loading,
  onEditMilestone = () => {},
  projectId,
  officeId,
  parentRefresh = () => {},
}) => {
  const [modalMaterials, showModalmaterials] = dialogHook(
    ProjectMaterialsModal,
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

  const [upsertRecord] = useMutation(DELETE_RECORD, {
    ignoreResults: false,
    onCompleted: (data) => {
      if (data?.upsert?.id) {
        message.success("Item/Material successfully deleted");
        parentRefresh();
      }
    },
  });

  const confirmDelete = (descLong, id) => {
    confirm({
      title: `Do you want to delete these item ${descLong}?`,
      icon: <ExclamationCircleOutlined />,
      content: "Please click OK to proceed.",
      onOk() {
        upsertRecord({
          variables: {
            id: id,
          },
        });
      },
      onCancel() {},
    });
  };

  const columns = [
    {
      title: "Date of Transaction",
      dataIndex: "dateTransact",
      key: "dateTransact",
      render: (text) => {
        return <span>{moment(text).format("MM-DD-YYYY h:mm a")}</span>;
      },
    },
    {
      title: "Description",
      dataIndex: "descLong",
      key: "descLong",
      width: "60%",
    },
    {
      title: "Qty (Unit)",
      dataIndex: "qty",
      key: "qty",
      render: (text, record) => {
        return <span>{`${numeral(text).format("0,0")} [${record.uou}]`}</span>;
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
          type="danger"
          size="small"
          onClick={() => confirmDelete(record.descLong, record.id)}
        >
          <DeleteOutlined />
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
          <div className="flex-box-wrap-end">
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
          <div className="flex-box-wrap">
            <Statistic
              title="Total Materials (Php)"
              valueStyle={{ color: "#cf1322" }}
              value={_.sumBy(obj.materials, "subTotal", 0)}
              precision={2}
            />
            <Button
              size="small"
              className="margin-y-0"
              type="primary"
              onClick={() =>
                showModalmaterials({
                  show: true,
                  myProps: {
                    parent: obj,
                    project: projectId,
                    officeId: officeId,
                  },
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
            dataSource={obj.materials}
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
