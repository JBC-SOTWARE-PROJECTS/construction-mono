import React from "react";
import { Avatar, Popover, Modal } from "antd";
import { avatar } from "../../../shared/constant";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const UserInfo = ({ account }) => {
  const confirm = () => {
    Modal.confirm({
      title: "Are you sure you want to logout",
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
    <Popover
      overlayClassName="gx-popover-horizantal"
      placement="bottomRight"
      content={userMenuOptions}
      trigger="click"
    >
      <div className="gx-flex-row">
        <span className="gx-mr-2 gx-mt-2 user-name-full">{account?.fullName}</span>
        <Avatar
          src={account?.gender === "MALE" ? avatar[0] : avatar[1]}
          className="gx-avatar gx-pointer"
          alt="Construction IMS-avatar"
        />
      </div>
    </Popover>
  );
};

export default UserInfo;
