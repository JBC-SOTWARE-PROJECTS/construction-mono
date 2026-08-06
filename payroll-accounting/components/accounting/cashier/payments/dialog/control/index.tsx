import { Button, Col, Modal, Row, Space } from "antd"

interface ModalProps {
  hide: (param?: string) => void
}
export default function ActionControl(props: ModalProps) {
  const onClickPrint = () => {
    props.hide("print")
  }

  const onClickNew = () => {
    props.hide("new")
  }

  const onClickClose = () => {
    props.hide("close")
  }

  return (
    <Modal title="" open footer={null} closable={false}>
      <Row align="middle" gutter={[8, 8]}>
        <Col flex="100%">
          <Button
            size="large"
            block
            style={{ height: 50 }}
            type="default"
            onClick={onClickPrint}
          >
            Print
          </Button>
        </Col>
        <Col flex="100%">
          <Button
            size="large"
            block
            style={{ height: 50, background: "#399b53" }}
            type="primary"
            onClick={onClickNew}
          >
            New
          </Button>
        </Col>
        <Col flex="100%">
          <Button
            size="large"
            block
            style={{ height: 50 }}
            type="primary"
            danger
            onClick={onClickClose}
          >
            Close
          </Button>
        </Col>
      </Row>
    </Modal>
  )
}
