import CreateShiftModal from "@/components/accounting/cashier/dialog/create-shift";
import { ReceiptType } from "@/graphql/gql/graphql";
import { useDialog } from "@/hooks";
import { gql, useQuery } from "@apollo/client";
import { Spin } from "antd";
import React, {
  createContext,
  ReactNode,
  Suspense,
  use,
  useContext,
  useState,
} from "react";

const GET_ACTIVE_SHIFT = gql`
  query ($receiptType: String) {
    employeeActiveShift(receiptType: $receiptType) {
      id
      shiftNo
      batchId
      terminal {
        id
        terminal_no
        mac_address
      }
      company
      employee {
        id
        fullName
      }
      nextDocNo
      docType
    }
  }
`;

interface PaymentAuthProviderProps {
  children: ReactNode;
}

interface PaymentAuthContextProps {
  loading: boolean;
  terminalId?: string;
  terminalNo?: string;
  shiftId?: string;
  shiftNo?: string;
  macAddress?: string;
  company?: any;
  nextReceiptNo?: string;
  receiptType?: ReceiptType;
  batchId?: string;
}

export const PaymentAuthContext = createContext<PaymentAuthContextProps>({
  loading: false,
});

function PaymentAuth({ children }: PaymentAuthProviderProps) {
  console.log("PaymentAuth start ...");
  const createShift = useDialog(CreateShiftModal);
  const [paymentAuthData, setPaymentAuthData] =
    useState<PaymentAuthContextProps>({
      loading: true,
    });

  const { refetch } = useQuery(GET_ACTIVE_SHIFT, {
    variables: {
      receiptType: "SI",
    },
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      if (!data?.employeeActiveShift) {
        return createShift({}, () => refetch());
      }
      setPaymentAuthData({
        terminalId: data.employeeActiveShift.terminal?.id,
        terminalNo: data.employeeActiveShift.terminal?.terminal_no,
        shiftId: data.employeeActiveShift.id,
        shiftNo: data.employeeActiveShift.shiftNo,
        macAddress: data.employeeActiveShift.terminal?.mac_address,
        nextReceiptNo: data.employeeActiveShift.nextDocNo,
        receiptType: data.employeeActiveShift.docType,
        batchId: data.employeeActiveShift.batchId,
        company: data.employeeActiveShift.company,
        loading: false,
      });
    },
  });

  return paymentAuthData.loading || !paymentAuthData?.shiftId ? (
    <Spin />
  ) : (
    <Suspense fallback={<Spin />}>
      <PaymentAuthContext.Provider value={{ ...paymentAuthData }}>
        {children}
      </PaymentAuthContext.Provider>
    </Suspense>
  );
}

export default PaymentAuth;
