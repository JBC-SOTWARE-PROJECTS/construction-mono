import classNames from "classnames";
import ResizeObserver from "rc-resize-observer";
import React, { useEffect, useRef, useState } from "react";
import { VariableSizeGrid as Grid } from "react-window";
import { Table, theme } from "antd";
import type { TableProps } from "antd";
import _ from "lodash";
import { ChartOfAccountGenerate } from "@/graphql/gql/graphql";

interface IProps {
  onRowClicked: (e?: any) => void;
  selected: any;
}
const VirtualTable = <RecordType extends object>(
  props: TableProps<RecordType> & IProps
) => {
  const { columns, scroll, onRowClicked, selected } = props;
  const [tableWidth, setTableWidth] = useState(0);
  const { token } = theme.useToken();

  const widthColumnCount = columns!.filter(({ width }) => !width).length;
  const widthColumnValue = columns!.map(({ width }) => width ?? 0);
  const totalWidthValue = _.sum(widthColumnValue);
  const mergedColumns = columns!.map((column) => {
    if (column.width) {
      return column;
    }

    return {
      ...column,
      width: Math.floor((tableWidth - totalWidthValue) / widthColumnCount),
    };
  });

  const gridRef = useRef<any>();
  const [connectObject] = useState<any>(() => {
    const obj = {};
    Object.defineProperty(obj, "scrollLeft", {
      get: () => {
        if (gridRef.current) {
          return gridRef.current?.state?.scrollLeft;
        }
        return null;
      },
      set: (scrollLeft: number) => {
        if (gridRef.current) {
          gridRef.current.scrollTo({ scrollLeft });
        }
      },
    });

    return obj;
  });

  const resetVirtualGrid = () => {
    gridRef.current?.resetAfterIndices({
      columnIndex: 0,
      shouldForceUpdate: true,
    });
  };

  useEffect(() => resetVirtualGrid, [tableWidth]);

  const onSelectCoa = (record?: ChartOfAccountGenerate) => {
    if (!_.isEmpty(record)) {
      onRowClicked(record);
    }
  };

  // const renderVirtualList = (
  //   rawData: readonly object[],
  //   { scrollbarSize, ref, onScroll }: any
  // ) => {
  //   ref.current = connectObject;
  //   const totalHeight = rawData.length * 34;

  //   return (
  //     <Grid
  //       ref={gridRef}
  //       className="virtual-grid"
  //       columnCount={mergedColumns.length}
  //       columnWidth={(index: number) => {
  //         const { width } = mergedColumns[index];
  //         return totalHeight > (scroll?.y as number) &&
  //           index === mergedColumns.length - 1
  //           ? (width as number) - scrollbarSize - 1
  //           : (width as number);
  //       }}
  //       height={scroll!.y as number}
  //       rowCount={rawData.length}
  //       rowHeight={() => 34}
  //       width={tableWidth}
  //       onScroll={({ scrollLeft }: { scrollLeft: number }) => {
  //         onScroll({ scrollLeft });
  //       }}>
  //       {({
  //         columnIndex,
  //         rowIndex,
  //         style,
  //       }: {
  //         columnIndex: number;
  //         rowIndex: number;
  //         style: React.CSSProperties;
  //       }) => {
  //         let color = token.colorBgContainer;
  //         let check = false;
  //         if (rowIndex >= 0) {
  //           let rowData: any = rawData[rowIndex];
  //           if (rowData && selected[rowData.code]) {
  //             color = "beige";
  //             check = true;
  //           }
  //         }

  //         return (
  //           <div
  //             className={classNames("virtual-table-cell", {
  //               "virtual-table-cell-last":
  //                 columnIndex === mergedColumns.length - 1,
  //             })}
  //             onClick={() => onSelectCoa(rawData[rowIndex])}
  //             style={{
  //               ...style,
  //               cursor: "pointer",
  //               boxSizing: "border-box",
  //               display: "flex",
  //               alignItems: "center",
  //               paddingLeft: token.padding - 10,
  //               justifyContent:
  //                 (mergedColumns as any)[columnIndex].align === "center"
  //                   ? "center"
  //                   : "start",
  //               borderBottom: `${token.lineWidth}px ${token.lineType} ${token.colorSplit}`,
  //               background: color,
  //             }}>
  //             {(mergedColumns as any)[columnIndex]?.render
  //               ? (mergedColumns as any)[columnIndex]?.render(
  //                   check,
  //                   rawData[rowIndex],
  //                   rowIndex
  //                 )
  //               : (rawData[rowIndex] as any)[
  //                   (mergedColumns as any)[columnIndex].dataIndex
  //                 ]}
  //           </div>
  //         );
  //       }}
  //     </Grid>
  //   );
  // };

  return (
    <ResizeObserver
      onResize={({ width }) => {
        setTableWidth(width);
      }}>
      <Table
        {...props}
        className="virtual-table"
        columns={mergedColumns}
        pagination={false}
        // components={{
        //   body: renderVirtualList,
        // }}
      />
    </ResizeObserver>
  );
};

export default VirtualTable;
