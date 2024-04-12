import { AccountsPayableDetails } from "@/graphql/gql/graphql";
import { currency } from "@/utility/constant";
import { NumberFormater } from "@/utility/helper";
import { Table } from "antd";
import _ from "lodash";
import React from "react";

interface IProps {
  dataSource?: AccountsPayableDetails[];
}

export default function APDetailsTransactionSummaryFooter(props: IProps) {
  const { dataSource } = props;
  return (
    <Table.Summary fixed>
      <Table.Summary.Row>
        <Table.Summary.Cell index={0} className="font-bold">
          Grand Totals
        </Table.Summary.Cell>
        <Table.Summary.Cell
          index={1}
          className="font-bold"></Table.Summary.Cell>
        <Table.Summary.Cell
          index={2}
          className="font-bold"></Table.Summary.Cell>
        <Table.Summary.Cell
          index={3}
          className="font-bold"></Table.Summary.Cell>
        <Table.Summary.Cell index={4} align="right" className="font-bold">
          <span>{currency} </span>
          {NumberFormater(_.sumBy(dataSource, "amount"))}
        </Table.Summary.Cell>
        <Table.Summary.Cell index={5} align="center" className="font-bold">
          --
        </Table.Summary.Cell>
        <Table.Summary.Cell index={6} align="right" className="font-bold">
          <span>{currency} </span>
          {NumberFormater(_.sumBy(dataSource, "discAmount"))}
        </Table.Summary.Cell>
        <Table.Summary.Cell index={7} align="center" className="font-bold">
          --
        </Table.Summary.Cell>
        <Table.Summary.Cell index={8} align="center" className="font-bold">
          --
        </Table.Summary.Cell>
        <Table.Summary.Cell index={9} align="center" className="font-bold">
          --
        </Table.Summary.Cell>
        <Table.Summary.Cell index={10} align="center" className="font-bold">
          --
        </Table.Summary.Cell>
        <Table.Summary.Cell index={11} align="right" className="font-bold">
          <span>{currency} </span>
          {NumberFormater(_.sumBy(dataSource, "vatAmount"))}
        </Table.Summary.Cell>
        <Table.Summary.Cell index={12} align="center" className="font-bold">
          --
        </Table.Summary.Cell>
        <Table.Summary.Cell index={13} align="right" className="font-bold">
          <span>{currency} </span>
          {NumberFormater(_.sumBy(dataSource, "ewtAmount"))}
        </Table.Summary.Cell>
        <Table.Summary.Cell index={14} align="right" className="font-bold">
          <span>{currency} </span>
          {NumberFormater(_.sumBy(dataSource, "netAmount"))}
        </Table.Summary.Cell>
        <Table.Summary.Cell
          index={15}
          align="right"
          className="font-bold"></Table.Summary.Cell>
      </Table.Summary.Row>
    </Table.Summary>
  );
}
