import { Pagination, Table, TableProps } from "antd";
import _ from "lodash";

interface IProps extends TableProps<any> {
  total: number;
  pageSize: number;
  onChangePagination?: (page: number, pageSize: number) => void;
  current: number;
}

const TablePaginated = ({
  total,
  pageSize,
  onChangePagination,
  current,
  ...props
}: IProps) => {
  return (
    <>
      <div
        style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}
      >
        <Pagination
          defaultCurrent={1}
          total={total}
          pageSize={pageSize}
          onChange={onChangePagination}
          current={current}
        />
      </div>
      <Table {...props} pagination={false} />
      <div
        style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}
      >
        <Pagination
          defaultCurrent={1}
          total={total}
          pageSize={pageSize}
          onChange={onChangePagination}
          current={current}
        />
      </div>
    </>
  );
};

export default TablePaginated;
