import React from "react";
import { PettyCashOthersDto } from "@/interface/payables/formInterfaces";
import { currency } from "@/utility/constant";
import { NumberFormater } from "@/utility/helper";
import { Table } from "antd";
import _ from "lodash";

interface IProps {
  dataSource?: PettyCashOthersDto[];
}

export default function PettyCashOthersSummaryFooter(props: IProps) {
  const { dataSource } = props;
  return (
    <Table.Summary fixed>
      <Table.Summary.Row>
        <Table.Summary.Cell index={0} colSpan={3} className="font-bold">
          Grand Totals
        </Table.Summary.Cell>
        <Table.Summary.Cell index={3} align="right" className="font-bold">
          <span>{currency} </span>
          {NumberFormater(_.sumBy(dataSource, "amount"))}
        </Table.Summary.Cell>
        <Table.Summary.Cell
          index={4}
          align="center"
          className="font-bold"></Table.Summary.Cell>
      </Table.Summary.Row>
    </Table.Summary>
  );
}
