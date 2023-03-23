import React, { useState } from "react";
import {
  Table,
  Col,
  Row,
  Input,
  message,
  Button,
  Typography,
  Tag,
  Space,
  Collapse,
  Divider,
  Spin,
} from "antd";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { PlusCircleOutlined } from "@ant-design/icons";
import { colSearch, colButton } from "../../../shared/constant";
import _ from "lodash";
import moment from "moment";
import { dialogHook } from "../../../util/customhooks";
import AddProjectUpdatesForm from "../dialogs/addProjectUpdates";
import ProjectMilestone from "../dialogs/addProjectMilestone";
import ProjectUpdatesContent from "./projectUpdatesContent";

const { Search } = Input;
const { Text } = Typography;
const { Panel } = Collapse;
//graphQL Queries
const GET_RECORDS = gql`
  query ($filter: String, $id: UUID) {
    list: pUpdatesByList(filter: $filter, id: $id) {
      id
      dateTransact
      description
      status
      startDate
      estimateEndDate
      completedDate
      lastModifiedBy
      notes {
        id
        user {
          id
          fullName
        }
        dateTransact
        remarks
      }
    }
  }
`;

const ProjectUpdates = ({ id }) => {
  const [filter, setFilter] = useState("");
  const [list, setList] = useState([]);
  //query
  const { loading, refetch } = useQuery(GET_RECORDS, {
    variables: {
      filter: filter,
      id: id,
    },
    onCompleted: (data) => {
      const { list } = data;
      setList(list);
    },
  });

  const [modal, showModal] = dialogHook(AddProjectUpdatesForm, (result) => {
    if (result) {
      message.success(result);
    }
    refetch();
  });

  const [modalUpdates, showModalUpdates] = dialogHook(
    ProjectMilestone,
    (result) => {
      if (result) {
        message.success(result);
      }
      refetch();
    }
  );

  return (
    <div className="pd-10">
      <Row>
        <Col {...colSearch}>
          <Search
            placeholder="Search Project Milestone"
            onSearch={(e) => setFilter(e)}
            enterButton
          />
        </Col>
        <Col {...colButton}>
          <Button
            icon={<PlusCircleOutlined />}
            type="primary"
            block
            onClick={() => showModal({ show: true, myProps: { project: id } })}
          >
            New
          </Button>
        </Col>
        <Col span={24}>
          <Spin spinning={loading}>
            <Space direction="vertical" style={{ width: "100%" }}>
              {list.map((obj, index) => {
                let color = "blue";
                if (obj.status === "Completed") {
                  color = "green";
                } else if (obj.status === "Pending") {
                  color = "orange";
                } else if (obj.status === "Cancelled") {
                  color = "red";
                }
                return (
                  <ProjectUpdatesContent
                    key={index}
                    obj={obj}
                    color={color}
                    loading={loading}
                    projectId={id}
                    parentRefresh={refetch}
                    onEditMilestone={() => {
                      showModal({
                        show: true,
                        myProps: { ...obj, project: id },
                      });
                    }}
                  />
                );
              })}
            </Space>
          </Spin>
        </Col>
      </Row>
      {modal}
      {modalUpdates}
    </div>
  );
};

export default ProjectUpdates;
