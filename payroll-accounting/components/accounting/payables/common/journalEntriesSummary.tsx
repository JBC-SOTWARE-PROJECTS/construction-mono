import { JournalEntryViewDto } from "@/graphql/gql/graphql";
import { currency } from "@/utility/constant";
import { NumberFormater, decimalRound2 } from "@/utility/helper";
import { Table } from "antd";
import Alert from "antd/es/alert/Alert";
import _ from "lodash";
import React, { useMemo } from "react";

interface IProps {
  dataSource?: JournalEntryViewDto[];
}

export default function JournalEntriesSummary(props: IProps) {
  const { dataSource } = props;
  const debit = _.sumBy(dataSource, "debit");
  const credit = _.sumBy(dataSource, "credit");

  const warning = useMemo(() => {
    const debit = decimalRound2(_.sumBy(dataSource, "debit"));
    const credit = decimalRound2(_.sumBy(dataSource, "credit"));
    const sum = decimalRound2(debit - credit);
    console.log("sum", sum);
    return sum !== 0;
  }, [dataSource]);

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
          {NumberFormater(debit)}
        </Table.Summary.Cell>
        <Table.Summary.Cell index={3} align="right" className="font-bold">
          <span>{currency} </span>
          {NumberFormater(credit)}
        </Table.Summary.Cell>
        <Table.Summary.Cell
          index={4}
          className="font-bold"></Table.Summary.Cell>
      </Table.Summary.Row>
      {warning && (
        <Table.Summary.Row>
          <Table.Summary.Cell index={0} colSpan={5}>
            <Alert
              showIcon
              type="warning"
              message={`Journal Entry Accounts totals are not balance. Please make sure that the journal entries are balance before posting. Difference of Php ${NumberFormater(
                debit - credit
              )}`}
            />
          </Table.Summary.Cell>
        </Table.Summary.Row>
      )}
    </Table.Summary>
  );
}
