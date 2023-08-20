import React, { useState } from "react";
import { Button, Drawer, Spin, message } from "antd";
// import CustomScrollbars from "@/util/CustomScrollbars";
import EmployeeList from "@/components/administrative/employees/EmployeeList";
import { useRouter } from "next/router";
import _ from "lodash";
import { IPageProps } from "@/utility/interfaces";
import { useMutation, useQuery, gql } from "@apollo/client";

const filterOptions = [
  {
    id: 1,
    status: null,
    name: "All Employee",
    icon: "all-contacts",
  },
  {
    id: 2,
    status: true,
    name: "Active Employee",
    icon: "check-circle-o",
  },
  {
    id: 3,
    status: false,
    name: "Inactive Employee",
    icon: "close-circle",
  },
];

//graphQL Queries
const GET_RECORDS = gql`
  query ($filter: String, $status: Boolean, $office: UUID, $position: UUID) {
    list: employeeByFilter(
      filter: $filter
      status: $status
      office: $office
      position: $position
    ) {
      id
      employeeNo
      fullName
      position {
        id
        description
      }
      office {
        id
        officeDescription
      }
      emailAddress
      employeeCelNo
      gender
      isActive
    }
  }
`;

const FILTERS = gql`
  query {
    office: activeOffices {
      id
      name: officeDescription
    }
    pos: activePositions {
      id
      name: description
    }
  }
`;

const UPSERT_RECORD = gql`
  mutation ($id: UUID, $status: Boolean) {
    upsert: employeeUpdateStatus(id: $id, status: $status) {
      id
    }
  }
`;

const Employee = ({ account }: IPageProps) => {
  //state first before useQuery
  const router = useRouter();
  //state
  const [state, setState] = useState({
    noContentFoundMessage: "No Employee found in the system",
    selectedStatus: null,
    selectedOffice: null,
    selectedPos: null,
    drawerState: false,
    filterOption: "All Employees",
  });
  const [filter, setFilter] = useState("");
  //query
  const { loading, data, refetch } = useQuery(GET_RECORDS, {
    variables: {
      filter: filter,
      status: state.selectedStatus,
      office: state.selectedOffice,
      position: state.selectedPos,
    },
    fetchPolicy: "network-only",
  });

  const { data: filterData } = useQuery(FILTERS);

  const [upsertRecord] = useMutation(UPSERT_RECORD, {
    ignoreResults: false,
    onCompleted: (data) => {
      if (!_.isEmpty(data?.upsert?.id)) {
        message.success("Employee Status Updated");
        refetch();
      }
    },
  });
  //================================================== ===========================
  //functions
  const ContactSideBar = () => {
    return (
      <div className="gx-module-side">
        <div className="gx-module-side-content">
          {/* <CustomScrollbars className="gx-module-side-scroll"> */}
          <div className="gx-module-add-task">
            <Button
              className="gx-btn-block ant-btn"
              type="primary"
              aria-label="add"
              onClick={onAddEmployee}
            >
              <i className="icon icon-add gx-mr-2" />
              <span>New Employee</span>
            </Button>
          </div>
          <div className="gx-module-side-nav">
            <ul className="gx-module-nav">
              {filterOptions.map((option) => (
                <li key={option.id} className="gx-nav-item">
                  <span
                    className={`gx-link ${
                      option.status === state.selectedStatus ? "active" : ""
                    }`}
                    onClick={() =>
                      setState({ ...state, selectedStatus: option.status })
                    }
                  >
                    <i className={`icon icon-${option.icon}`} />
                    <span>{option.name}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="gx-module-add-task">
              <span className="gx-nav-item">Filter Office</span>
            </div>
            <ul className="gx-module-nav">
              <li key="all-offices" className="gx-nav-item">
                <span
                  className={`gx-link ${!state.selectedOffice && "active"}`}
                  onClick={() => setState({ ...state, selectedOffice: null })}
                >
                  <i className={`icon icon-all-contacts`} />
                  <span>All Offices</span>
                </span>
              </li>
              {(filterData?.office || []).map((option) => (
                <li key={option.id} className="gx-nav-item">
                  <span
                    className={`gx-link ${
                      option.id === state.selectedOffice ? "active" : ""
                    }`}
                    onClick={() =>
                      setState({ ...state, selectedOffice: option.id })
                    }
                  >
                    <i className={`icon icon-home`} />
                    <span>{_.startCase(_.toLower(option.name))}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="gx-module-add-task">
              <span className="gx-nav-item">Filter Position</span>
            </div>
            <ul className="gx-module-nav">
              <li key="all-offices" className="gx-nav-item">
                <span
                  className={`gx-link ${!state.selectedPos && "active"}`}
                  onClick={() => setState({ ...state, selectedPos: null })}
                >
                  <i className={`icon icon-all-contacts`} />
                  <span>All Offices</span>
                </span>
              </li>
              {(filterData?.pos || []).map((option) => (
                <li key={option.id} className="gx-nav-item">
                  <span
                    className={`gx-link ${
                      option.id === state.selectedPos ? "active" : ""
                    }`}
                    onClick={() =>
                      setState({ ...state, selectedPos: option.id })
                    }
                  >
                    <i className={`icon icon-badge`} />
                    <span>{_.startCase(_.toLower(option.name))}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          {/* </CustomScrollbars> */}
        </div>
      </div>
    );
  };

  const onAddEmployee = () => {
    router.push(`/admin/employees/manage`);
  };

  const onFilterOptionSelect = (option) => {
    switch (option.name) {
      case "All contacts": {
        console.log("all contacts");
        break;
      }
      case "Frequently contacted": {
        console.log("Frequently contacted");
        break;
      }
      case "Starred contacts": {
        console.log("Starred contacts");
        break;
      }
      default:
        break;
    }
  };

  const onUpdateStatus = (id, status) => {
    upsertRecord({
      variables: {
        id: id,
        status: !status,
      },
    });
  };

  const onToggleDrawer = () => {
    setState({ ...state, drawerState: !state.drawerState });
  };

  return (
    <div className="gx-main-content">
      <div className="gx-app-module">
        <div className="gx-d-block gx-d-lg-none">
          <Drawer
            placement="left"
            closable={false}
            visible={state.drawerState}
            onClose={onToggleDrawer}
          >
            {ContactSideBar()}
          </Drawer>
        </div>
        <div className="gx-module-sidenav gx-d-none gx-d-lg-flex">
          {ContactSideBar()}
        </div>
        <div className="gx-module-box">
          <div className="gx-module-box-header">
            <span className="gx-drawer-btn gx-d-flex gx-d-lg-none">
              <i
                className="icon icon-menu gx-icon-btn"
                aria-label="Menu"
                onClick={onToggleDrawer}
              />
            </span>
            {/* <AppModuleHeader
              placeholder="Search Employee"
              notification={false}
              apps={false}
              onChange={(e) => setFilter(e.target.value)}
              value={filter}
            /> */}
          </div>
          <div className="gx-module-box-content">
            {/* <CustomScrollbars className="gx-module-content-scroll"> */}
            {loading ? (
              <div className="gx-h-100 gx-d-flex gx-align-items-center gx-justify-content-center">
                <Spin tip="Please wait ..." />
              </div>
            ) : _.get(data, "list", []).length === 0 ? (
              <div className="gx-h-100 gx-d-flex gx-align-items-center gx-justify-content-center">
                {state.noContentFoundMessage}
              </div>
            ) : (
              <EmployeeList
                emplist={_.get(data, "list", [])}
                onUpdateStatus={onUpdateStatus}
              />
            )}
            {/* </CustomScrollbars> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Employee;
