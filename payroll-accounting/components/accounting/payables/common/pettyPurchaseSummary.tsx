import React from "react";
import { currency } from "@/utility/constant";
import { NumberFormater } from "@/utility/helper";
import { Table } from "antd";
import _ from "lodash";
import { PettyCashItemDto } from "@/interface/payables/formInterfaces";
import numeral from "numeral";

interface IProps {
  dataSource?: PettyCashItemDto[];
}

export default function PettyPurchaseSummaryFooter(props: IProps) {
  const { dataSource } = props;

  return (
    <Table.Summary fixed>
      <Table.Summary.Row>
        <Table.Summary.Cell index={0} colSpan={4} className="font-bold">
          Grand Totals
        </Table.Summary.Cell>
        <Table.Summary.Cell index={4} align="right" className="font-bold">
          {numeral(_.sumBy(dataSource, "qty")).format("0,0")}
        </Table.Summary.Cell>
        <Table.Summary.Cell index={5} align="right" className="font-bold">
          <span>{currency} </span>
          {NumberFormater(_.sumBy(dataSource, "unitCost"))}
        </Table.Summary.Cell>
        <Table.Summary.Cell index={6} align="right" className="font-bold">
          <span>{currency} </span>
          {NumberFormater(_.sumBy(dataSource, "inventoryCost"))}
        </Table.Summary.Cell>
        <Table.Summary.Cell index={7} align="right" className="font-bold">
          <span>{currency} </span>
          {NumberFormater(_.sumBy(dataSource, "grossAmount"))}
        </Table.Summary.Cell>
        <Table.Summary.Cell index={8} align="right" className="font-bold">
          {NumberFormater(_.sumBy(dataSource, "discRate"))}
        </Table.Summary.Cell>
        <Table.Summary.Cell index={9} align="right" className="font-bold">
          <span>{currency} </span>
          {NumberFormater(_.sumBy(dataSource, "discAmount"))}
        </Table.Summary.Cell>
        <Table.Summary.Cell index={10} align="right" className="font-bold">
          <span>{currency} </span>
          {NumberFormater(_.sumBy(dataSource, "netDiscount"))}
        </Table.Summary.Cell>
        <Table.Summary.Cell
          index={11}
          align="right"
          className="font-bold"></Table.Summary.Cell>
        <Table.Summary.Cell
          index={12}
          align="right"
          className="font-bold"></Table.Summary.Cell>
        <Table.Summary.Cell
          index={13}
          align="right"
          className="font-bold"></Table.Summary.Cell>
        <Table.Summary.Cell index={14} align="right" className="font-bold">
          <span>{currency} </span>
          {NumberFormater(_.sumBy(dataSource, "vatAmount"))}
        </Table.Summary.Cell>
        <Table.Summary.Cell index={15} align="right" className="font-bold">
          <span>{currency} </span>
          {NumberFormater(_.sumBy(dataSource, "netAmount"))}
        </Table.Summary.Cell>
        <Table.Summary.Cell
          index={16}
          align="right"
          className="font-bold"></Table.Summary.Cell>
      </Table.Summary.Row>
    </Table.Summary>
  );
}
