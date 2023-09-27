import { currency } from "@/utility/constant";
import { NumberFormater } from "@/utility/helper";
import { Table } from "antd";
import React from "react";

interface IProps {
  amount: number;
}

export default function PayableSummaryFooter(props: IProps) {
  return (
    <Table.Summary fixed>
      <Table.Summary.Row>
        <Table.Summary.Cell index={0} className="font-bold">
          Net Amount
        </Table.Summary.Cell>
        <Table.Summary.Cell index={1} align="right" className="font-bold">
          --
        </Table.Summary.Cell>
        <Table.Summary.Cell index={1} align="right" className="font-bold">
          --
        </Table.Summary.Cell>
        <Table.Summary.Cell
          index={3}
          align="right"
          className="font-bold text-orange"
        >
          <span>{currency} </span>
          {NumberFormater(props.amount)}
        </Table.Summary.Cell>
      </Table.Summary.Row>
    </Table.Summary>
  );
}
