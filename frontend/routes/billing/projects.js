import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  message,
  Input,
  Divider,
  Spin,
  Empty,
  Pagination,
} from "antd";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { PlusCircleOutlined } from "@ant-design/icons";
import ProjectItem from "../../app/components/projectGrid/ProjectItem";
import "./index.css";
import AddPrjectForm from "./dialogs/addProject";
import { dialogHook } from "../../util/customhooks";
import { col3 } from "../../shared/constant";
import FilterSelect from "../../util/customForms/filterSelect";
import _ from "lodash";

const { Search } = Input;
//graphQL Queries
const GET_RECORDS = gql`
  query (
    $filter: String
    $customer: UUID
    $location: UUID
    $status: String
    $page: Int
    $size: Int
  ) {
    list: projectListPageable(
      filter: $filter
      customer: $customer
      location: $location
      status: $status
      page: $page
      size: $size
    ) {
      content {
        id
        projectCode
        description
        projectStarted
        projectEnded
        customer {
          id
          customerType
          address
          fullName
        }
        location {
          id
          officeDescription
          fullAddress
        }
        image
        remarks
        totals
        totalsMaterials
        totalExpenses
        disabledEditing
        status
      }
      size
      totalElements
      number
    }
  }
`;

const GET_CONSTANT = gql`
  {
    customer: customerAll {
      value: id
      label: fullName
    }
    office: activeOffices {
      value: id
      label: officeDescription
    }
    projectStatus: jobStatusActive {
      value: description
      label: description
    }
  }
`;

const ProjectItemData = ({
  data = [],
  loading = false,
  onEdit = () => {},
  setState = () => {},
  pageSize,
  total,
  defaultCurrent,
}) => {
  if (_.isEmpty(data)) {
    return (
      <Row>
        <Col span={24}>
          <Empty />
        </Col>
      </Row>
    );
  } else {
    return (
      <Spin spinning={loading}>
        <Row>
          {data.map((project, index) => (
            <Col key={index} xl={8} md={12} sm={24} xs={24}>
              <ProjectItem
                key={index}
                grid
                product={project}
                onEdit={() => onEdit(project)}
              />
            </Col>
          ))}
          <Col span={24}>
            <div className="flex-box-wrap-center">
              <Pagination
                pageSize={pageSize}
                total={total}
                defaultCurrent={defaultCurrent}
                onChange={(page) => {
                  setState({ ...state, page: page - 1 });
                }}
              />
            </div>
          </Col>
        </Row>
      </Spin>
    );
  }
};

const Projects = ({ account }) => {
  const [customer, setCustomer] = useState(null);
  const [location, setLocation] = useState(null);
  const [state, setState] = useState({
    filter: "",
    status: null,
    page: 0,
    size: 10,
  });
  const { loading, data, refetch } = useQuery(GET_RECORDS, {
    variables: {
      filter: state.filter,
      customer: customer,
      location: location,
      status: state.status,
      page: state.page,
      size: state.size,
    },
  });

  const { loading: loadingFilter, data: filterData } = useQuery(GET_CONSTANT);

  const [modal, showModal] = dialogHook(AddPrjectForm, (result) => {
    if (result) {
      message.success(result);
    }
    refetch();
  });

  return (
    <Card
      title="Projects List"
      size="small"
      extra={
        <span>
          <Button
            size="small"
            type="primary"
            icon={<PlusCircleOutlined />}
            className="margin-0"
            onClick={() => showModal({ show: true, myProps: null })}
          >
            New Project
          </Button>
        </span>
      }
    >
      <Row>
        <Col span={24}>
          <Search
            placeholder="Search Projects"
            onSearch={(e) => setState({ ...state, filter: e })}
            enterButton
          />
        </Col>
        <Col span={24}>
          <Divider>Filters</Divider>
        </Col>
        <Col {...col3}>
          <FilterSelect
            allowClear
            loading={loadingFilter}
            field="customer"
            placeholder="Filter By Customer"
            onChange={(e) => {
              setCustomer(e);
            }}
            list={_.get(filterData, "customer")}
          />
        </Col>
        <Col {...col3}>
          <FilterSelect
            allowClear
            loading={loadingFilter}
            field="status"
            placeholder="Filter By Status"
            onChange={(e) => {
              setState({ ...state, status: e });
            }}
            list={_.get(filterData, "projectStatus")}
          />
        </Col>
        <Col {...col3}>
          <FilterSelect
            allowClear
            loading={loadingFilter}
            field="office"
            placeholder="Filter By Office"
            onChange={(e) => {
              setLocation(e);
            }}
            list={_.get(filterData, "office")}
          />
        </Col>
      </Row>
      <Divider />
      <ProjectItemData
        data={_.get(data, "list.content", [])}
        loading={loading || loadingFilter}
        pageSize={_.get(data, "list.size", 0)}
        total={_.get(data, "list.totalElements", 0)}
        defaultCurrent={_.get(data, "list.number", 0) + 1}
        onEdit={(props) => showModal({ show: true, myProps: props })}
        setState={setState}
      />
      {modal}
    </Card>
  );
};

export default Projects;
