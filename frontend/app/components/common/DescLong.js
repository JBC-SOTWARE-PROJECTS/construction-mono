import React from "react";
import { Tag } from "antd";

export default function DescLong({ descripton, record }) {
  return (
    <span>
      {`${descripton} `}
      {record?.consignment && <Tag color="magenta">Consignment</Tag>}
      {record?.fixAsset && <Tag color="cyan">Fix Asset</Tag>}
      {record?.vatable && <Tag color="volcano">Vatable</Tag>}
      {record?.isMedicine && <Tag color="gold">Medicine</Tag>}
      {record?.production && <Tag color="blue">Production Item</Tag>}
    </span>
  );
}
