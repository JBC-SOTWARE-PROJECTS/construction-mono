import { currency } from "@/utility/constant";
import { NumberFormater } from "@/utility/helper";
import { Table } from "antd";
import React from "react";

interface IProps {
  disAmount: number;
  appliedAmount: number;
  balance: number;
}

export default function DisbursementSummaryFooter(props: IProps) {
  return (
    <Table.Summary fixed>
      <Table.Summary.Row>
        <Table.Summary.Cell index={0} className="font-bold">
          Disbursement Amount
        </Table.Summary.Cell>
        <Table.Summary.Cell
          index={1}
          align="right"
          className="font-bold text-green">
          <span>{currency} </span>
          {NumberFormater(props.disAmount)}
        </Table.Summary.Cell>
        <Table.Summary.Cell index={1} align="right" className="font-bold">
          --
        </Table.Summary.Cell>
        <Table.Summary.Cell index={3} align="right" className="font-bold">
          --
        </Table.Summary.Cell>
      </Table.Summary.Row>
      <Table.Summary.Row>
        <Table.Summary.Cell index={0} className="font-bold">
          Applied Amount
        </Table.Summary.Cell>
        <Table.Summary.Cell index={1} align="right" className="font-bold">
          --
        </Table.Summary.Cell>
        <Table.Summary.Cell
          index={1}
          align="right"
          className="font-bold text-red">
          <span>{currency} </span>
          {NumberFormater(props.appliedAmount)}
        </Table.Summary.Cell>
        <Table.Summary.Cell index={3} align="right" className="font-bold">
          --
        </Table.Summary.Cell>
      </Table.Summary.Row>
      <Table.Summary.Row>
        <Table.Summary.Cell index={0} className="font-bold">
          Balance
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
          className="font-bold text-orange">
          <span>{currency} </span>
          {NumberFormater(props.balance)}
        </Table.Summary.Cell>
      </Table.Summary.Row>
    </Table.Summary>
  );
}
