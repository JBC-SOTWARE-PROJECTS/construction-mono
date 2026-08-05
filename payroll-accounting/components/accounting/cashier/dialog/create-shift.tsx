import { gql, useMutation } from "@apollo/client";
import { Alert, Button, message, Modal, Space, Spin } from "antd";

const CREATE_SHIFT = gql`
  mutation {
    addShift {
      id
      shiftNo
      terminal {
        id
        terminal_no
        mac_address
      }
      company
    }
  }
`;

interface ModalProps {
  hide: (success: boolean) => void;
}
export default function CreateShiftModal(props: ModalProps) {
  const [createShift, { loading }] = useMutation(CREATE_SHIFT);

  function handleCreateShift() {
    console.log("Create Shift");
    createShift({
      onCompleted: () => {
        message.success("Shift created successfully.");
        props.hide(false);
      },
    });
  }
  return (
    <Modal open footer={null} closable={false}>
      {loading ? (
        <Spin>Please wait ...</Spin>
      ) : (
        <>
          <Alert
            message="🚨 New Shift Required 🚨"
            description={`No active shift detected. Please create a new shift before proceeding with transactions. Click "Create Shift" to start a new shift.`}
            type="warning"
            showIcon
          />
          <Space style={{ width: "100%", marginTop: 10 }} direction="vertical">
            <Button block type="primary" onClick={handleCreateShift}>
              Create Shift
            </Button>
            <Button
              block
              type="primary"
              danger
              onClick={() => props.hide(false)}
            >
              Close
            </Button>
          </Space>
        </>
      )}
    </Modal>
  );
}
