import React, { useState } from "react";
import ConfirmationPasswordHook from "@/hooks/promptPassword";
import { SaveOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Button, Col, Modal, Row, Space, Typography } from "antd";
import _ from "lodash";
import { CheckCard } from "@ant-design/pro-components";
import { UseCompanySelection } from "@/hooks/companySelection";
import { CHANGE_COMPANY } from "@/graphql/company/queries";
import { IUserEmployee } from "@/utility/interfaces";

interface IProps {
  hide: (hideProps: any) => void;
  account: IUserEmployee;
}

export default function ChangeCompanyModal(props: IProps) {
  const { hide, account } = props;
  const [showPasswordConfirmation] = ConfirmationPasswordHook();
  const [company, setCompany] = useState<any>(account?.currentCompany?.id);
  // ===================== Queries ==============================
  const companyList = UseCompanySelection();
  const [upsert, { loading: upsertLoading }] = useMutation(CHANGE_COMPANY, {
    ignoreResults: false,
    onCompleted: (data) => {
      if (data) {
        hide(data);
      }
    },
  });

  //================== functions ====================

  const onSubmit = () => {
    showPasswordConfirmation(() => {
      upsert({
        variables: {
          company: company,
          id: account.id,
        },
      });
    });
  };

  return (
    <Modal
      title={
        <Typography.Title level={4}>
          <Space align="center">Select Company</Space>
        </Typography.Title>
      }
      destroyOnClose={true}
      maskClosable={false}
      open={true}
      width={"100%"}
      style={{ maxWidth: "500px" }}
      onCancel={() => hide(false)}
      footer={
        <Button
          type="primary"
          size="large"
          block
          loading={upsertLoading}
          onClick={onSubmit}
          icon={<SaveOutlined />}
        >
          Change and Reload
        </Button>
      }
    >
      <Row>
        <Col span={24}>
          <CheckCard.Group
            onChange={(value) => {
              setCompany(value);
            }}
            defaultValue={account?.currentCompany?.id}
            className="w-full"
          >
            {(companyList || []).map((obj, index) => (
              <CheckCard
                key={index}
                title={obj.companyName}
                description={obj.companyCode}
                value={obj.id}
                className="w-full"
              />
            ))}
          </CheckCard.Group>
        </Col>
      </Row>
    </Modal>
  );
}
