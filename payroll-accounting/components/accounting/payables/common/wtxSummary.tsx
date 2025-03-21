import React from "react";
import { IDisbursementWTX } from "@/interface/payables/formInterfaces";
import { currency } from "@/utility/constant";
import { NumberFormater } from "@/utility/helper";
import { Table } from "antd";
import _ from "lodash";

interface IProps {
  dataSource?: IDisbursementWTX[];
}

export default function WTXSummaryFooter(props: IProps) {
  const { dataSource } = props;
  return (
    <Table.Summary fixed>
      <Table.Summary.Row>
        <Table.Summary.Cell index={0} colSpan={2} className="font-bold">
          Grand Totals
        </Table.Summary.Cell>
        <Table.Summary.Cell index={2} align="right" className="font-bold">
          <span>{currency} </span>
          {NumberFormater(_.sumBy(dataSource, "ewtAmount"))}
        </Table.Summary.Cell>
        <Table.Summary.Cell
          index={3}
          align="center"
          className="font-bold"></Table.Summary.Cell>
      </Table.Summary.Row>
    </Table.Summary>
  );
}
