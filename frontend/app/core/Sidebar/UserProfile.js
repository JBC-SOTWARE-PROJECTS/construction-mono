import React from "react";
import { Avatar, Popover, Modal } from "antd";
import _ from "lodash";
import { post } from "../../../shared/global";
import { avatar } from "../../../shared/constant";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const UserProfile = ({ account }) => {
  const confirm = () => {
    Modal.confirm({
      title: "Are you sure you want to logout?",
      content: "Please click ok to continue",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        return new Promise((resolve, reject) => {
          logOut();
        }).catch(() => console.log("Oops errors!"));
      },
      onCancel() {},
    });
  };

  const logOut = () => {
    post("/api/logout")
      .then((response) => {
        window.location = "/";
      })
      .catch((error) => {})
      .finally(() => {
        // setconfirmOpen(false);
      });
  };

  const myAccount = () => {
    window.open(`/admin/employees/view/${account?.id}`);
  };

  const userMenuOptions = (
    <ul className="gx-user-popover">
      <li onClick={myAccount}>My Account</li>
      <li onClick={confirm}>Logout</li>
    </ul>
  );

  return (
    <div className="gx-flex-row gx-align-items-center gx-mb-4 gx-avatar-row">
      <Popover
        placement="bottomRight"
        content={userMenuOptions}
        trigger="click"
      >
        <Avatar
          src={account?.gender === "MALE" ? avatar[0] : avatar[1]}
          className="gx-size-40 gx-pointer gx-mr-3"
          alt="Construction IMS-avatar"
        />
        <span className="gx-avatar-name">
          {_.startCase(_.toLower(account?.initialName))}
          <i className="icon icon-chevron-down gx-fs-xxs gx-ml-2" />
        </span>
      </Popover>
    </div>
  );
};

export default UserProfile;
