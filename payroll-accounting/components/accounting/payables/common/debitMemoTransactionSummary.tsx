import React from "react";
import { IDebitMemoDetails } from "@/interface/payables/formInterfaces";
import { currency } from "@/utility/constant";
import { NumberFormater } from "@/utility/helper";
import { Table } from "antd";
import _ from "lodash";

interface IProps {
  dataSource?: IDebitMemoDetails[];
}

export default function DebitMemoTransactionSummaryFooter(props: IProps) {
  const { dataSource } = props;
  return (
    <Table.Summary fixed>
      <Table.Summary.Row>
        <Table.Summary.Cell index={0} colSpan={5} className="font-bold">
          Grand Totals
        </Table.Summary.Cell>
        <Table.Summary.Cell index={5} align="right" className="font-bold">
          <span>{currency} </span>
          {NumberFormater(_.sumBy(dataSource, "amount"))}
        </Table.Summary.Cell>
        <Table.Summary.Cell
          index={6}
          align="center"
          className="font-bold"></Table.Summary.Cell>
      </Table.Summary.Row>
    </Table.Summary>
  );
}
