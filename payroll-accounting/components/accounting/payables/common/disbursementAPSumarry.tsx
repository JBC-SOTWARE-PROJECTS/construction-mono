import React from "react";
import { DisbursementAp } from "@/graphql/gql/graphql";
import { currency } from "@/utility/constant";
import { NumberFormater } from "@/utility/helper";
import { Table } from "antd";
import _ from "lodash";

interface IProps {
  dataSource?: DisbursementAp[];
}

export default function DisbursementAPSummaryFooter(props: IProps) {
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
        <Table.Summary.Cell index={2} align="right" className="font-bold">
          <span>{currency} </span>
          {NumberFormater(_.sumBy(dataSource, "payable.balance"))}
        </Table.Summary.Cell>
        <Table.Summary.Cell index={3} align="right" className="font-bold">
          <span>{currency} </span>
          {NumberFormater(_.sumBy(dataSource, "appliedAmount"))}
        </Table.Summary.Cell>
        <Table.Summary.Cell index={4} align="center" className="font-bold">
          --
        </Table.Summary.Cell>
        <Table.Summary.Cell index={5} align="right" className="font-bold">
          <span>{currency} </span>
          {NumberFormater(_.sumBy(dataSource, "vatAmount"))}
        </Table.Summary.Cell>
        <Table.Summary.Cell index={6} align="center" className="font-bold">
          --
        </Table.Summary.Cell>
        <Table.Summary.Cell index={7} align="center" className="font-bold">
          --
        </Table.Summary.Cell>
        <Table.Summary.Cell index={8} align="right" className="font-bold">
          <span>{currency} </span>
          {NumberFormater(_.sumBy(dataSource, "ewtAmount"))}
        </Table.Summary.Cell>
        <Table.Summary.Cell index={9} align="right" className="font-bold">
          <span>{currency} </span>
          {NumberFormater(_.sumBy(dataSource, "grossAmount"))}
        </Table.Summary.Cell>
        <Table.Summary.Cell index={10} align="right" className="font-bold">
          <span>{currency} </span>
          {NumberFormater(_.sumBy(dataSource, "discount"))}
        </Table.Summary.Cell>
        <Table.Summary.Cell index={11} align="right" className="font-bold">
          <span>{currency} </span>
          {NumberFormater(_.sumBy(dataSource, "netAmount"))}
        </Table.Summary.Cell>
        <Table.Summary.Cell index={12} align="center" className="font-bold">
          --
        </Table.Summary.Cell>
      </Table.Summary.Row>
    </Table.Summary>
  );
}
