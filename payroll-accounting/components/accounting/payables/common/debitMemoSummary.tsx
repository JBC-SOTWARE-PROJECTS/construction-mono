import { currency } from "@/utility/constant";
import { NumberFormater } from "@/utility/helper";
import { Table } from "antd";
import React from "react";

interface IProps {
  type: string;
  memoAmount: number;
  appliedAmount: number;
  balance: number;
}

export default function DebitMemoSummaryFooter(props: IProps) {
  return (
    <Table.Summary fixed>
      <Table.Summary.Row>
        <Table.Summary.Cell index={0} className="font-bold">
          {props.type === "DEBIT_MEMO" ? "Applied Amount" : "Memo Amount"}
        </Table.Summary.Cell>
        <Table.Summary.Cell
          index={1}
          align="right"
          className="font-bold text-green">
          <span>{currency} </span>
          {props.type === "DEBIT_MEMO"
            ? NumberFormater(props.appliedAmount)
            : NumberFormater(props.memoAmount)}
        </Table.Summary.Cell>
        <Table.Summary.Cell index={1} align="right" className="font-bold">
          --
        </Table.Summary.Cell>
      </Table.Summary.Row>
      <Table.Summary.Row>
        <Table.Summary.Cell index={0} className="font-bold">
          {props.type === "DEBIT_MEMO" ? "Memo Amount" : "Applied Amount"}
        </Table.Summary.Cell>
        <Table.Summary.Cell index={1} align="right" className="font-bold">
          --
        </Table.Summary.Cell>
        <Table.Summary.Cell
          index={1}
          align="right"
          className="font-bold text-red">
          <span>{currency} </span>
          {props.type === "DEBIT_MEMO"
            ? NumberFormater(props.memoAmount)
            : NumberFormater(props.appliedAmount)}
        </Table.Summary.Cell>
      </Table.Summary.Row>
      {props.type === "DEBIT_MEMO" && (
        <Table.Summary.Row>
          <Table.Summary.Cell index={0} className="font-bold">
            Balance
          </Table.Summary.Cell>
          <Table.Summary.Cell
            index={1}
            align="right"
            className="font-bold text-orange">
            <span>{currency} </span>
            {NumberFormater(props.balance)}
          </Table.Summary.Cell>
          <Table.Summary.Cell index={1} align="right" className="font-bold">
            --
          </Table.Summary.Cell>
        </Table.Summary.Row>
      )}
    </Table.Summary>
  );
}
