import React from "react";
import { currency } from "@/utility/constant";
import { NumberFormater } from "@/utility/helper";
import { Table } from "antd";
import _ from "lodash";

interface IProps {
  amount: number;
}

export default function PettyCashSummaryFooter(props: IProps) {
  const { amount } = props;
  return (
    <Table.Summary fixed>
      <Table.Summary.Row>
        <Table.Summary.Cell index={0} className="font-bold">
          Amount Unused
        </Table.Summary.Cell>
        <Table.Summary.Cell
          index={1}
          align="right"
          className="font-bold text-orange">
          <span>{currency} </span>
          {NumberFormater(amount)}
        </Table.Summary.Cell>
        <Table.Summary.Cell index={2} align="right" className="font-bold">
          --
        </Table.Summary.Cell>
      </Table.Summary.Row>
    </Table.Summary>
  );
}
