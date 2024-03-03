import React from "react";
import { Item } from "@/graphql/gql/graphql";
import { Tag } from "antd";

interface IProps {
  descripton: string;
  record?: Item;
}

export default function DescLong({ descripton, record }: IProps) {
  return (
    <span>
      {`${descripton} `}
      {record?.consignment && (
        <Tag color="magenta" bordered={false}>
          Consignment
        </Tag>
      )}
      {record?.fixAsset && (
        <Tag color="cyan" bordered={false}>
          Fixed Asset
        </Tag>
      )}
      {record?.vatable && (
        <Tag color="volcano" bordered={false}>
          Vatable
        </Tag>
      )}
      {record?.isMedicine && (
        <Tag color="gold" bordered={false}>
          Medicine
        </Tag>
      )}
      {record?.production && (
        <Tag color="blue" bordered={false}>
          Production Item
        </Tag>
      )}
      {record?.forSale && (
        <Tag color="lime" bordered={false}>
          For Sale
        </Tag>
      )}
    </span>
  );
}
