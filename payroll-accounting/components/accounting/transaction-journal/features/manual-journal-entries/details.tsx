import { Collapse, Descriptions } from "antd"
import { ManualJournalEntriesContextProps } from "."
import type { CollapseProps } from "antd"

const Details = () => {
  return (
    <Descriptions bordered layout="vertical" column={3} size="small">
      <Descriptions.Item label={<b>Patient</b>}>
        GRACIOSA, JEHORAM BALIO
      </Descriptions.Item>
      <Descriptions.Item label={<b>Admission Date</b>}>
        01/26/2024 to N/A
      </Descriptions.Item>
      <Descriptions.Item label={<b>Folio</b>}>338853</Descriptions.Item>
      <Descriptions.Item label={<b>Current Room</b>}>
        ICU 1- 1
      </Descriptions.Item>
      <Descriptions.Item label={<b>Transaction No.</b>}>
        4101422
      </Descriptions.Item>
      <Descriptions.Item label={<b>Charged By</b>}>whinacay</Descriptions.Item>
    </Descriptions>
  )
}

export default function MJEDetails(props: ManualJournalEntriesContextProps) {
  const items: CollapseProps["items"] = [
    {
      key: 1,
      label: "Transaction details",
      children: <Details />,
    },
  ]

  return (
    <Collapse items={items} bordered={false} style={{ marginBottom: 10 }} />
  )
}
