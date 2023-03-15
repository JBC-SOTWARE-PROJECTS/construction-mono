import React from "react";
import { Avatar } from "antd";
import { useRouter } from "next/router";
import { avatar, calculate_age } from "../../../../shared/constant";
import moment from "moment";

const ProfileHeader = ({ data }) => {
  const router = useRouter();

  return (
    <div className="gx-profile-banner">
      <div className="gx-profile-container">
        <div className="gx-profile-banner-top">
          <div className="gx-profile-banner-top-left">
            <div className="gx-profile-banner-avatar">
              <Avatar
                className="gx-size-90"
                alt="Construction IMS-avatar"
                src={data?.gender === "MALE" ? avatar[0] : avatar[1]}
              />
            </div>
            <div className="gx-profile-banner-avatar-info">
              <h2 className="gx-mb-2 gx-mb-sm-3 gx-fs-xxl gx-font-weight-light">
                {data?.fullName}
              </h2>
              <p className="gx-mb-0 gx-fs-lg">{data?.fullAddress}</p>
            </div>
          </div>
          <div className="gx-profile-banner-top-right">
            <ul className="gx-follower-list">
              <li>
                <span className="gx-follower-title gx-fs-lg gx-font-weight-medium">
                  {data?.employeeNo}
                </span>
                <span className="gx-fs-sm">Employee No</span>
              </li>
              <li>
                <span className="gx-follower-title gx-fs-lg gx-font-weight-medium">
                  {calculate_age(moment(data?.dob).format("MM/DD/YYYY"))} yr(s)
                  old
                </span>
                <span className="gx-fs-sm">Employee Age</span>
              </li>
              <li>
                <span className="gx-follower-title gx-fs-lg gx-font-weight-medium">
                  {data?.office?.officeDescription}
                </span>
                <span className="gx-fs-sm">Assigned Office</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="gx-profile-banner-bottom">
          <div className="gx-tab-list"></div>
          <span className="gx-link gx-profile-setting">
            <i className="icon icon-feedback gx-fs-lg gx-mr-2 gx-mr-sm-3 gx-d-inline-flex gx-vertical-align-middle" />
            <span
              className="gx-d-inline-flex gx-vertical-align-middle gx-ml-1 gx-ml-sm-0"
              onClick={() => router.push(`/admin/employees/manage/${data?.id}`)}
            >
              Edit Employee Information
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
