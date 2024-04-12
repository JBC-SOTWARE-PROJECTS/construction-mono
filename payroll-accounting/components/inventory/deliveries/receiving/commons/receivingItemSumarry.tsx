import { JournalEntryViewDto } from "@/graphql/gql/graphql";
import { currency } from "@/utility/constant";
import { NumberFormater, decimalRound2 } from "@/utility/helper";
import { StockReceivingReportExtended } from "@/utility/inventory-helper";
import { Table } from "antd";
import Alert from "antd/es/alert/Alert";
import _ from "lodash";
import React, { useMemo } from "react";

interface IProps {
  dataSource?: StockReceivingReportExtended[];
}

export default function ReceivingItemSummary(props: IProps) {
  const { dataSource } = props;

  return (
    <Table.Summary fixed>
      <Table.Summary.Row>
        <Table.Summary.Cell
          index={0}
          className="font-bold"></Table.Summary.Cell>
        <Table.Summary.Cell index={1} className="font-bold">
          Grand Totals
        </Table.Summary.Cell>
        <Table.Summary.Cell
          index={2}
          className="font-bold"></Table.Summary.Cell>
        <Table.Summary.Cell
          index={3}
          className="font-bold"></Table.Summary.Cell>
        {/* unitcost */}
        <Table.Summary.Cell
          index={4}
          align="right"
          className="font-bold"></Table.Summary.Cell>
        {/* unitcost */}
        <Table.Summary.Cell
          index={5}
          align="right"
          className="font-bold"></Table.Summary.Cell>
        {/* grossAmount */}
        <Table.Summary.Cell index={6} align="right" className="font-bold">
          <span>{currency} </span>
          {NumberFormater(_.sumBy(dataSource, "totalAmount"))}
        </Table.Summary.Cell>
        {/* discountRate */}
        <Table.Summary.Cell index={7} align="right" className="font-bold">
          <span>{currency} </span>
          {NumberFormater(_.sumBy(dataSource, "discountRate"))}
        </Table.Summary.Cell>
        {/* discountCost */}
        <Table.Summary.Cell index={8} align="right" className="font-bold">
          <span>{currency} </span>
          {NumberFormater(_.sumBy(dataSource, "receiveDiscountCost"))}
        </Table.Summary.Cell>
        {/* netAmount */}
        <Table.Summary.Cell index={9} align="right" className="font-bold">
          <span>{currency} </span>
          {NumberFormater(_.sumBy(dataSource, "netAmount"))}
        </Table.Summary.Cell>
        <Table.Summary.Cell
          index={10}
          align="right"
          className="font-bold"></Table.Summary.Cell>
        {/* inputTax */}
        <Table.Summary.Cell index={11} align="right" className="font-bold">
          <span>{currency} </span>
          {NumberFormater(_.sumBy(dataSource, "inputTax"))}
        </Table.Summary.Cell>
        <Table.Summary.Cell
          index={12}
          align="right"
          className="font-bold"></Table.Summary.Cell>
        <Table.Summary.Cell
          index={13}
          align="right"
          className="font-bold"></Table.Summary.Cell>
        <Table.Summary.Cell
          index={14}
          align="right"
          className="font-bold"></Table.Summary.Cell>
        <Table.Summary.Cell
          index={15}
          align="right"
          className="font-bold"></Table.Summary.Cell>
        <Table.Summary.Cell
          index={16}
          align="right"
          className="font-bold"></Table.Summary.Cell>
        <Table.Summary.Cell
          index={17}
          align="right"
          className="font-bold"></Table.Summary.Cell>
      </Table.Summary.Row>
    </Table.Summary>
  );
}
