import { useModal } from "react-modal-hook";

import React, { useState, useContext, useRef, useEffect } from "react";
import bcryptjs from "bcryptjs";
import { Col, Input, Modal, Row, Form, message, InputRef } from "antd";
import { AccountContext } from "@/components/accessControl/AccountContext";
import Image from "next/image";
import { LockOutlined } from "@ant-design/icons";
import { devpassword } from "@/shared/devsettings";

const PromptPassword = ({
  account,
  hide,
  onSuccess,
}: {
  account: any;
  hide: () => void;
  onSuccess: (e?: string) => void;
}) => {
  const [form] = Form.useForm();
  const inputRef = useRef<InputRef>(null);

  const onFinish = (values: any) => {
    bcryptjs.compare(
      values.passwordAuth,
      account.user.password,
      function (error: Error, success: boolean) {
        if (success) {
          message.success("Successfully authenticated!");

          if (hide) hide();
          if (onSuccess) onSuccess(values.passwordAuth);
        } else {
          message.error("Wrong password authentication!");
          form.setFields([
            {
              name: "passwordAuth",
              errors: ["Wrong password authentication!"],
            },
          ]);
        }
      }
    );
  };

  useEffect(() => {
    inputRef.current!.focus({
      cursor: "all",
    });
  }, [inputRef]);

  return (
    <Modal
      title="Password Confirmation"
      centered
      open={true}
      width={700}
      onCancel={hide}
      // bodyStyle={}
      styles={{
        body: {
          background: "#3fc59d",
          borderRadius: "0.5rem",
          boxShadow:
            "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        },
      }}
      closeIcon={false}
      footer={[
        <Form
          key={"form-password-confirm"}
          form={form}
          name="controlHooks"
          onFinish={onFinish}>
          <Form.Item
            name="passwordAuth"
            label=""
            initialValue={devpassword}
            rules={[
              { required: true, message: "Wrong password authentication!" },
            ]}>
            <Input
              key={"password-input"}
              size="large"
              autoFocus={true}
              prefix={<LockOutlined />}
              type="password"
              ref={inputRef}
            />
          </Form.Item>
        </Form>,
      ]}>
      <Row>
        <Col span={8}>
          <Image
            width={100}
            height={200}
            src={"/images/rfid.png"}
            style={{ width: "100%", height: "auto" }}
            alt=""
          />
        </Col>
        <Col span={8}>
          <Image
            width={100}
            height={200}
            src={"/images/line.png"}
            style={{ width: "100%", height: "auto" }}
            alt=""
          />
        </Col>
        <Col span={8}>
          <Image
            width={100}
            height={200}
            src={"/images/password.png"}
            style={{ width: "100%", height: "auto" }}
            alt=""
          />
        </Col>
      </Row>
    </Modal>
  );
};

const ConfirmationPasswordHook = () => {
  const accountContext = useContext(AccountContext);
  const [successCallback, setSuccessCallback] = useState({
    callback: (e?: string) => {
      alert("Please specify Success Callback");
    },
  });

  const [showPasswordConfirmation, hidePasswordConfirmation] = useModal(
    () => (
      <PromptPassword
        hide={hidePasswordConfirmation}
        onSuccess={(e?: string) => successCallback.callback(e)}
        account={accountContext}
      />
    ),
    [successCallback]
  );

  return [
    (onSuccess: (e?: string) => void) => {
      if (onSuccess)
        setSuccessCallback({
          callback: (e?: string) => {
            onSuccess(e);
          },
        });
      showPasswordConfirmation();
    },
  ];
};

export default ConfirmationPasswordHook;
