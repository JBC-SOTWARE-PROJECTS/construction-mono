import React from "react";
import { Button, Tag } from "antd";
import IntlMessages from "../../../util/IntlMessages";
import { useRouter } from "next/router";

const AssetItem = ({ product, grid, onEdit = () => {} }) => {
  const router = useRouter();
  const { id, image, assetCode, description, status, brand, model, plateNo } =
    product;

  return (
    <div
      className={`gx-product-item  ${
        grid ? "gx-product-vertical" : "gx-product-horizontal"
      }`}
    >
      {image && (
        <div className="gx-product-image">
          <div className="gx-grid-thumb-equal">
            <span className="gx-link gx-grid-thumb-cover">
              <img alt="CIMS Project Image" src={image} />
            </span>
          </div>
        </div>
      )}
      <div className="gx-product-body">
        <div className="ant-row-flex">
          <h3 className="gx-product-title">
            [{assetCode}]{description}
          </h3>
        </div>
        <p style={{ paddingTop: 10 }}>
          Asset Status: <Tag color="green">{status}</Tag>
        </p>
        <p>
          Equipment Brand: <span className="font-bold">{brand}</span>
          <br />
          Equipment Model: <span className="font-bold">{model}</span>
          <br />
          Equipment Plat No: <span className="font-bold">{plateNo}</span>
        </p>
      </div>
      <div className="gx-product-footer">
        <Button variant="raised" onClick={onEdit}>
          <IntlMessages id="project.editInfo" />
        </Button>
        <Button
          type="primary"
          onClick={() => router.push(`/assets/manage/${id}`)}
        >
          <IntlMessages id="asset.updates" />
        </Button>
      </div>
    </div>
  );
};

export default AssetItem;
