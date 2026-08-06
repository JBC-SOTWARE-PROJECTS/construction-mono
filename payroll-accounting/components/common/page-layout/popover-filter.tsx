import { FilterOutlined } from "@ant-design/icons";
import { Button, Card, Col, Popover, Row } from "antd";
import { CSSProperties, ReactNode, useState } from "react";
import styled from "styled-components";

interface PopoverFilterI {
  children: ReactNode;
  open?: boolean;
  title?: string;
  label?: string;
  button?: ReactNode;
  onApply?: (params?: any) => void;
  onClear?: (params?: any) => void;
  style?: CSSProperties;
}

export default function PopoverFilter(props: PopoverFilterI) {
  const [open, setOpen] = useState(props?.open ?? false);

  const onApply = () => {
    props?.onApply ? props?.onApply() : null;
    setOpen(false);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const onClear = () => {
    props?.onClear ? props?.onClear() : null;
  };

  return (
    <Popover
      open={open}
      trigger="click"
      placement="bottomRight"
      title={""}
      onOpenChange={handleOpenChange}
      content={
        <CardStyle>
          <Card
            title={props?.title ?? "Filter"}
            extra={
              <Button type="link" onClick={onClear}>
                Reset
              </Button>
            }
            size="small"
            bordered={false}
            style={{ width: "250px", ...(props?.style ?? {}) }}
            actions={[
              <Row key={0} gutter={[8, 8]}>
                <Col span={12}>
                  <Button block onClick={onClose}>
                    Close
                  </Button>
                </Col>
                <Col span={12}>
                  <Button type="primary" block onClick={onApply}>
                    Apply
                  </Button>
                </Col>
              </Row>,
            ]}
          >
            {props?.children}
          </Card>
        </CardStyle>
      }
    >
      {props?.button ?? (
        <Button type="primary" icon={<FilterOutlined />}>
          {props?.label ?? "Customize"}
        </Button>
      )}
    </Popover>
  );
}

const CardStyle = styled.div`
  .ant-card .ant-card-actions > li {
    margin: 6px 5px !important;
    box-shadow: none;
  }

  :where(.css-dev-only-do-not-override-r29jb3).ant-card: not(
    .ant-card-bordered
  ) {
    box-shadow: none;
  }
`;
