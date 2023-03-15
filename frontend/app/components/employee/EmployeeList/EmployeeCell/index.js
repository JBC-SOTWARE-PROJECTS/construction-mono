import React from "react";
import { Avatar, Dropdown, Menu, Tag } from "antd";
import { useRouter } from 'next/router';

// import AddContact from "../../AddContact/index";

const options = [
  'View',
  'Edit',
  'Inactive/Active',
];

const color = [
  "#24c5ff", // male
  "#f56a00" // female
]

const EmployeeCell = (props) => {
  const router = useRouter();
  //deserialize
  const { employee, onUpdateStatus } = props;
  const { id, employeeNo, fullName, gender, position, office, emailAddress, employeeCelNo, isActive } = employee;


  const menus = (id, status) => (<Menu onClick={(e) => {
    if (e.key === 'View') {
      router.push(`/admin/employees/view/${id}`);
    } else if (e.key === 'Edit') {
      router.push(`/admin/employees/manage/${id}`);
    } else {
      onUpdateStatus(id, status)
    }
  }
  }>
    {options.map(option =>
      <Menu.Item key={option}>
        {option}
      </Menu.Item>,
    )}
  </Menu>);



  return (

    <div className="gx-contact-item">
      <div className="gx-module-list-icon">
        <div className="gx-ml-2 gx-d-none gx-d-sm-flex">
          <Avatar size="large" style={{ background: gender === "FEMALE" ? color[1] : color[0] }}>
            {fullName.charAt(0).toUpperCase()}
          </Avatar>
        </div>
      </div>
      <div className="gx-module-list-info gx-contact-list-info" >
        <div className="gx-module-contact-content">
          <p className="gx-mb-1">
            <span className="gx-text-truncate gx-contact-name">{employeeNo}</span>
            <span className="gx-toolbar-separator">&nbsp;</span>
            <span className="gx-text-truncate gx-contact-name"> {fullName} </span>
            <span className="gx-toolbar-separator">&nbsp;</span>
            <span className="gx-text-truncate gx-job-title">{_.isEmpty(position) ? "No Postition Yet" : position.description}</span>
          </p>
          <div className="gx-text-muted">
            <span className="gx-email gx-d-inline-block gx-mr-2">{emailAddress}</span>
            <span className="gx-toolbar-separator">&nbsp;</span>
            <span className="gx-phone gx-d-inline-block">{employeeCelNo}</span>
            <span className="gx-toolbar-separator">&nbsp;</span>
            <span className="gx-phone gx-d-inline-block">{office?.officeDescription}</span>
            <span className="gx-toolbar-separator">&nbsp;</span>
            <span className="gx-phone gx-d-inline-block">
              <Tag color={isActive ? "green" : "red"}>{isActive ? "Active" : "Inactive"}</Tag>
            </span>
          </div>
        </div>
        <div className="gx-module-contact-right" style={{ marginLeft: 50 }}>
          <Dropdown overlay={menus(id, isActive)} placement="bottomRight" trigger={['click']}>
            <i className="gx-icon-btn icon icon-ellipse-v" />
          </Dropdown>
        </div>
      </div>
    </div>
  )

}

export default EmployeeCell;
