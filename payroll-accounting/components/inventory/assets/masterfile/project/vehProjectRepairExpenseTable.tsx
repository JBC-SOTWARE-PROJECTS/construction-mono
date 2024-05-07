import React from "react";
import { EditOutlined } from "@ant-design/icons";
import { Row, Col, Table, Pagination,  Button } from "antd";
import { ColumnsType } from "antd/es/table";
import { RentalRates } from "@/graphql/gql/graphql";
import { useRouter } from "next/router";

type Props = {}

function VehProjectRepairExpenseTable({}: Props) {
  
    const columns: ColumnsType<RentalRates> = [
        {
          title: "Type",
          dataIndex: "rentType",
          key: "rentType",
          width: 100,
        },
        {
          title: "Description",
          dataIndex: "description",
          key: "desc",
          width: 100,
        },
        {
          title: "Unit Measurement",
          dataIndex: "measurement",
          key: "measurement",
          width: 100,
        },
        {
          title: "Action",
          dataIndex: "brand",
          key: "brand",
          width: 30,
          fixed: "right",
          render: (_, record) => {
            return (
                  <Button
                    icon={<EditOutlined />}
                    type="primary"
                    onClick={() => {
                    
                    }}
                  />
               
            );
          },
        }
        
        
      ];
  
  
    return (
    <div>
        <Col span={24}>
        <Table
          rowKey="id"
          size="small"
          columns={columns}
          dataSource={[]}
          pagination={false}
          loading={false}
          footer={() => (
            <Pagination
              showSizeChanger={false}
              pageSize={10}
              responsive={true}
              total={0}
                onChange={(e) => {
                
                }}
            />
          )}
        />
      </Col>
    </div>
  )
}

export default VehProjectRepairExpenseTable