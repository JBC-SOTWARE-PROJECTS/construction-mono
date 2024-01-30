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
      {record?.consignment && <Tag color="magenta">Consignment</Tag>}
      {record?.fixAsset && <Tag color="cyan">Fixed Asset</Tag>}
      {record?.vatable && <Tag color="volcano">Vatable</Tag>}
      {record?.isMedicine && <Tag color="gold">Medicine</Tag>}
      {record?.production && <Tag color="blue">Production Item</Tag>}
    </span>
  );
}
