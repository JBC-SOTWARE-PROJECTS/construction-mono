import React from "react";
import { Button, Tag } from "antd";
import IntlMessages from "../../../util/IntlMessages";
import moment from "moment";
import numeral from "numeral";
import { useRouter } from "next/router";

const ProjectItem = ({ product, grid, onEdit = () => {} }) => {
  const router = useRouter()
  const {
    id,
    image,
    projectCode,
    description,
    projectStarted,
    projectEnded,
    status,
    location,
    customer,
    totals,
    totalsMaterials
  } = product;

  return (
    <div
      className={`gx-product-item  ${
        grid ? "gx-product-vertical" : "gx-product-horizontal"
      }`}
    >
      <div className="gx-product-image">
        <div className="gx-grid-thumb-equal">
          <span className="gx-link gx-grid-thumb-cover">
            <img alt="CIMS Project Image" src={image} />
          </span>
        </div>
      </div>
      <div className="gx-product-body">
        <div className="ant-row-flex">
          <h3 className="gx-product-title">
            [{projectCode}]{description}
          </h3>
        </div>
        <div className="ant-row-flex">
          <p>{location?.fullAddress}</p>
        </div>
        <p>Customer: {customer?.fullName}</p>
        <p>
          Project Status: <Tag color="green">{status}</Tag>
        </p>
        <div className="w-full mb-5">
          <div className="ant-row-flex">
            <p>
              Date Started: {moment(projectStarted).format("MMM Do, YYYY")}{" "}
            </p>
          </div>
          <div className="ant-row-flex">
            <p>
              Estimate Date End: {moment(projectEnded).format("MMM Do, YYYY")}{" "}
            </p>
          </div>
        </div>
        <div className="w-full mb-5">
          <div className="ant-row-flex">
            <h4 className="gx-text-success">
              Total Project Cost: {numeral(totals).format("0,0.00")}{" "}
            </h4>
          </div>
          <div className="ant-row-flex">
            <h4 className="gx-text-danger">
              Total Materials Used: {numeral(totalsMaterials).format("0,0.00")}{" "}
            </h4>
          </div>
        </div>
      </div>
      <div className="gx-product-footer">
        <Button variant="raised" onClick={onEdit}>
          <IntlMessages id="project.editInfo" />
        </Button>
        <Button type="primary" onClick={() => router.push(`/projects/project-list/manage/${id}`)} >
          <IntlMessages id="project.updates" />
        </Button>
      </div>
    </div>
  );
};

export default ProjectItem;
