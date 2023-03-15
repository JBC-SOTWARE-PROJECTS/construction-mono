import React, { useState } from "react";
import { Col, Row, Button, Form, Divider, Checkbox, Radio } from "antd";
import CModal from "../../../app/components/common/CModal";
import FormInput from "../../../util/customForms/formInput";
import MyForm from "../../../util/customForms/myForm";
import { col3, endorsement } from "../../../shared/constant";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import moment from "moment";
import { getUrlPrefix } from "../../../shared/global";

const UPSERT_RECORD = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsert: upsertJob(id: $id, fields: $fields) {
      id
    }
  }
`;

const EndorsementForm = ({ visible, hide, ...props }) => {
  const [formError, setFormError] = useState({});
  const [form] = Form.useForm();
  const [endorse, setEndorse] = useState(
    props?.endorsement ? props.endorsement : endorsement
  );

  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.upsert?.id)) {
          if (props?.id) {
            hide("Endorsement Information Updated");
          }
        }
      },
    }
  );

  const onSubmit = (data) => {
    let payload = _.clone(props);
    delete payload.id;
    payload.customerComplain = data?.customerComplain;
    payload.repairHistory = data?.repairHistory;
    payload.otherFindings = data?.otherFindings;
    payload.endorsement = endorse;
    if (data?.dateReleased) {
      payload.dateReleased = data?.dateReleased;
    } else {
      payload.dateReleased = null;
    }

    upsertRecord({
      variables: {
        id: props?.id,
        fields: payload,
      },
    });
  };

  const onChange = (value, name) => {
    setEndorse((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <CModal
      allowFullScreen={true}
      title={"Endorsement Form"}
      visible={visible}
      footer={[
        <Button key="back" onClick={() => hide()} type="danger">
          Return
        </Button>,
        <Button
          form="endorsement"
          key="submit"
          htmlType="submit"
          type="primary"
          loading={upsertLoading}
        >
          Save Endorsement
        </Button>,
        <Button
          key="print"
          onClick={() =>
            window.open(
              `${getUrlPrefix()}/reports/billing/print/endorsement/${props?.id}`
            )
          }
          type="primary"
        >
          Print Edorsement
        </Button>,
      ]}
    >
      <MyForm
        form={form}
        name="endorsement"
        id="endorsement"
        error={formError}
        onFinish={onSubmit}
        className="form-card"
      >
        <Row>
          <Col span={24}>
            <FormInput
              description={"Customer Complains"}
              type="textarea"
              name="customerComplain"
              initialValue={props?.customerComplain}
              placeholder="Customer Complains"
            />
          </Col>
          <Col span={24}>
            <FormInput
              description={
                "Vehicle Repair History (pangutana sa customer kanus-a katapusan nag pa change oil, dis-a nga shop nagpatrabaho ug unsay problema)"
              }
              type="textarea"
              name="repairHistory"
              initialValue={props?.repairHistory}
              placeholder="Vehicle Repair History"
            />
          </Col>
          <Divider>{`Endorsement (Below would show if the following are [/] functional/Available or [x] damages/dented/scratched/None)`}</Divider>
          <Col span={24}>
            <Checkbox
              checked={endorse.fieldFindings}
              onChange={(e) => onChange(e.target.checked, "fieldFindings")}
            >
              Field Findings
            </Checkbox>
            <Checkbox
              checked={endorse.shopFindings}
              onChange={(e) => onChange(e.target.checked, "shopFindings")}
            >
              Shop Findings
            </Checkbox>
          </Col>
          <Col {...col3}>
            <div className="w-full">
              <span className="margin-r-10">Fuel Gauge:</span>
              <Radio.Group
                onChange={(e) => onChange(e.target.value, "fuelGauge")}
                value={endorse.fuelGauge}
              >
                <Radio value={"full"}>Full</Radio>
                <Radio value={"3/4"}>3/4</Radio>
                <Radio value={"1/2"}>1/2</Radio>
                <Radio value={"1/4"}>1/4</Radio>
                <Radio value={"alsmost"}>Almost Empty</Radio>
                <Radio value={"empty"}>Empty</Radio>
              </Radio.Group>
            </div>
            <div className="w-full">
              <span className="margin-r-10">Aircon:</span>
              <Radio.Group
                onChange={(e) => onChange(e.target.value, "aircon")}
                value={endorse.aircon}
              >
                <Radio value={"available"}>Available</Radio>
                <Radio value={"none"}>None</Radio>
              </Radio.Group>
            </div>
            <div className="w-full">
              <span className="margin-r-10">Lighter:</span>
              <Radio.Group
                onChange={(e) => onChange(e.target.value, "lighter")}
                value={endorse.lighter}
              >
                <Radio value={"available"}>Available</Radio>
                <Radio value={"none"}>None</Radio>
              </Radio.Group>
            </div>
            <div className="w-full">
              <span className="margin-r-10">Headrest:</span>
              <Radio.Group
                onChange={(e) => onChange(e.target.value, "headrest")}
                value={endorse.headrest}
              >
                <Radio value={"available"}>Available</Radio>
                <Radio value={"none"}>None</Radio>
              </Radio.Group>
            </div>
            <div className="w-full">
              <span className="margin-r-10">Horn:</span>
              <Radio.Group
                onChange={(e) => onChange(e.target.value, "horn")}
                value={endorse.horn}
              >
                <Radio value={"available"}>Available</Radio>
                <Radio value={"none"}>None</Radio>
              </Radio.Group>
            </div>
            <div className="w-full">
              <span className="margin-r-10">Wiper:</span>
              <Checkbox
                checked={endorse.wiperRH}
                onChange={(e) => onChange(e.target.checked, "wiperRH")}
              >
                RH
              </Checkbox>
              <Checkbox
                checked={endorse.wiperLH}
                onChange={(e) => onChange(e.target.checked, "wiperLH")}
              >
                LH
              </Checkbox>
            </div>
            <div className="w-full">
              <span className="margin-r-10">Wind Shield:</span>
              <Checkbox
                checked={endorse.windShieldFront}
                onChange={(e) => onChange(e.target.checked, "windShieldFront")}
              >
                Front
              </Checkbox>
              <Checkbox
                checked={endorse.windShieldRear}
                onChange={(e) => onChange(e.target.checked, "windShieldRear")}
              >
                Rear
              </Checkbox>
            </div>
            <div className="w-full">
              <span className="margin-r-10">Running Board:</span>
              <Checkbox
                checked={endorse.runningBoardRH}
                onChange={(e) => onChange(e.target.checked, "runningBoardRH")}
              >
                RH
              </Checkbox>
              <Checkbox
                checked={endorse.runningBoardLH}
                onChange={(e) => onChange(e.target.checked, "runningBoardLH")}
              >
                LH
              </Checkbox>
            </div>
            <div className="w-full">
              <span className="margin-r-10">Spare Tire:</span>
              <Radio.Group
                onChange={(e) => onChange(e.target.value, "spareTire")}
                value={endorse.spareTire}
              >
                <Radio value={"available"}>Available</Radio>
                <Radio value={"none"}>None</Radio>
              </Radio.Group>
            </div>
            <div className="w-full">
              <span className="margin-r-10">Hoodstand:</span>
              <Radio.Group
                onChange={(e) => onChange(e.target.value, "hoodStand")}
                value={endorse.hoodStand}
              >
                <Radio value={"available"}>Available</Radio>
                <Radio value={"none"}>None</Radio>
              </Radio.Group>
            </div>
            <div className="w-full">
              <span className="margin-r-10">Oil Cap:</span>
              <Radio.Group
                onChange={(e) => onChange(e.target.value, "oilCap")}
                value={endorse.oilCap}
              >
                <Radio value={"available"}>Available</Radio>
                <Radio value={"none"}>None</Radio>
              </Radio.Group>
            </div>
            <div className="w-full">
              <span className="margin-r-10">Engine Oil Filter/Cap:</span>
              <Radio.Group
                onChange={(e) => onChange(e.target.value, "engineOilFilter")}
                value={endorse.engineOilFilter}
              >
                <Radio value={"available"}>Available</Radio>
                <Radio value={"none"}>None</Radio>
              </Radio.Group>
            </div>
            <div className="w-full">
              <span className="margin-r-10">Headlight:</span>
              <Checkbox
                checked={endorse.headlightLH}
                onChange={(e) => onChange(e.target.checked, "headlightLH")}
              >
                RH
              </Checkbox>
              <Checkbox
                checked={endorse.headlightRH}
                onChange={(e) => onChange(e.target.checked, "headlightRH")}
              >
                LH
              </Checkbox>
            </div>
            <div className="w-full">
              <span className="margin-r-10">
                Car key turned over to JH Motors:
              </span>
              <Checkbox
                checked={endorse.carkey}
                onChange={(e) => onChange(e.target.checked, "carkey")}
              />
            </div>
          </Col>
          {/*  */}
          <Col {...col3}>
            <div className="w-full">
              <span className="margin-r-10">Car Stereo:</span>
              <Radio.Group
                onChange={(e) => onChange(e.target.value, "carStereo")}
                value={endorse.carStereo}
              >
                <Radio value={"available"}>Available</Radio>
                <Radio value={"none"}>None</Radio>
              </Radio.Group>
            </div>
            <div className="w-full">
              <span className="margin-r-10">Sun Visor:</span>
              <Radio.Group
                onChange={(e) => onChange(e.target.value, "sunVisor")}
                value={endorse.sunVisor}
              >
                <Radio value={"available"}>Available</Radio>
                <Radio value={"none"}>None</Radio>
              </Radio.Group>
            </div>
            <div className="w-full">
              <span className="margin-r-10">Dome Light:</span>
              <Radio.Group
                onChange={(e) => onChange(e.target.value, "domeLight")}
                value={endorse.domeLight}
              >
                <Radio value={"available"}>Available</Radio>
                <Radio value={"none"}>None</Radio>
              </Radio.Group>
            </div>
            <div className="w-full">
              <span className="margin-r-10">Side Mirror:</span>
              <Checkbox
                checked={endorse.sideMirrorRH}
                onChange={(e) => onChange(e.target.checked, "sideMirrorRH")}
              >
                RH
              </Checkbox>
              <Checkbox
                checked={endorse.sideMirrorLH}
                onChange={(e) => onChange(e.target.checked, "sideMirrorLH")}
              >
                LH
              </Checkbox>
            </div>
            <div className="w-full">
              <span className="margin-r-10">Logo:</span>
              <Checkbox
                checked={endorse.logoFront}
                onChange={(e) => onChange(e.target.checked, "logoFront")}
              >
                Front
              </Checkbox>
              <Checkbox
                checked={endorse.logoRear}
                onChange={(e) => onChange(e.target.checked, "logoRear")}
              >
                Rear
              </Checkbox>
            </div>
            <div className="w-full">
              <span className="margin-r-10">Windows:</span>
              <Checkbox
                checked={endorse.windowsRH}
                onChange={(e) => onChange(e.target.checked, "windowsRH")}
              >
                RH
              </Checkbox>
              <Checkbox
                checked={endorse.windowsLH}
                onChange={(e) => onChange(e.target.checked, "windowsLH")}
              >
                LH
              </Checkbox>
            </div>
            <div className="w-full">
              <span className="margin-r-10">Antenna:</span>
              <Radio.Group
                onChange={(e) => onChange(e.target.value, "antenna")}
                value={endorse.antenna}
              >
                <Radio value={"available"}>Available</Radio>
                <Radio value={"none"}>None</Radio>
              </Radio.Group>
            </div>
            <div className="w-full">
              <span className="margin-r-10">Jack:</span>
              <Radio.Group
                onChange={(e) => onChange(e.target.value, "jack")}
                value={endorse.jack}
              >
                <Radio value={"available"}>Available</Radio>
                <Radio value={"none"}>None</Radio>
              </Radio.Group>
            </div>
            <div className="w-full">
              <span className="margin-r-10">Radiator:</span>
              <Radio.Group
                onChange={(e) => onChange(e.target.value, "radiator")}
                value={endorse.radiator}
              >
                <Radio value={"available"}>Available</Radio>
                <Radio value={"none"}>None</Radio>
              </Radio.Group>
            </div>
            <div className="w-full">
              <span className="margin-r-10">Dip Stick:</span>
              <Radio.Group
                onChange={(e) => onChange(e.target.value, "dipStick")}
                value={endorse.dipStick}
              >
                <Radio value={"available"}>Available</Radio>
                <Radio value={"none"}>None</Radio>
              </Radio.Group>
            </div>
            <div className="w-full">
              <span className="margin-r-10">Hub Cup:</span>
              <Checkbox
                checked={endorse.hubCupRHft}
                onChange={(e) => onChange(e.target.checked, "hubCupRHft")}
              >
                RH Ft.
              </Checkbox>
              <Checkbox
                checked={endorse.hubCupRHRr}
                onChange={(e) => onChange(e.target.checked, "hubCupRHRr")}
              >
                RH Rr.
              </Checkbox>
              <Checkbox
                checked={endorse.hubCupLHft}
                onChange={(e) => onChange(e.target.checked, "hubCupLHft")}
              >
                LH Ft.
              </Checkbox>
              <Checkbox
                checked={endorse.hubCupLHRr}
                onChange={(e) => onChange(e.target.checked, "hubCupLHRr")}
              >
                LH Rr.
              </Checkbox>
            </div>
            <div className="w-full">
              <span className="margin-r-10">Mud Guard:</span>
              <Checkbox
                checked={endorse.mudGuardRHft}
                onChange={(e) => onChange(e.target.checked, "mudGuardRHft")}
              >
                RH Ft.
              </Checkbox>
              <Checkbox
                checked={endorse.mudGuardRHRr}
                onChange={(e) => onChange(e.target.checked, "mudGuardRHRr")}
              >
                RH Rr.
              </Checkbox>
              <Checkbox
                checked={endorse.mudGuardLHft}
                onChange={(e) => onChange(e.target.checked, "mudGuardLHft")}
              >
                LH Ft.
              </Checkbox>
              <Checkbox
                checked={endorse.mudGuardLHRr}
                onChange={(e) => onChange(e.target.checked, "mudGuardLHRr")}
              >
                LH Rr.
              </Checkbox>
            </div>
          </Col>
          {/*  */}
          <Col {...col3}>
            <div className="w-full">
              <span className="margin-r-10">Speaker:</span>
              <Radio.Group
                onChange={(e) => onChange(e.target.value, "speaker")}
                value={endorse.speaker}
              >
                <Radio value={"available"}>Available</Radio>
                <Radio value={"none"}>None</Radio>
              </Radio.Group>
            </div>
            <div className="w-full">
              <span className="margin-r-10">Rear View Mirror:</span>
              <Radio.Group
                onChange={(e) => onChange(e.target.value, "rearViewMirror")}
                value={endorse.rearViewMirror}
              >
                <Radio value={"available"}>Available</Radio>
                <Radio value={"none"}>None</Radio>
              </Radio.Group>
            </div>
            <div className="w-full">
              <span className="margin-r-10">Registration Papers:</span>
              <Radio.Group
                onChange={(e) => onChange(e.target.value, "registrationPapers")}
                value={endorse.registrationPapers}
              >
                <Radio value={"available"}>Available</Radio>
                <Radio value={"none"}>None</Radio>
              </Radio.Group>
            </div>
            <div className="w-full">
              <span className="margin-r-10">Plate Number:</span>
              <Checkbox
                checked={endorse.plateNumberFront}
                onChange={(e) => onChange(e.target.checked, "plateNumberFront")}
              >
                Front
              </Checkbox>
              <Checkbox
                checked={endorse.plateNumberRear}
                onChange={(e) => onChange(e.target.checked, "plateNumberRear")}
              >
                Rear
              </Checkbox>
            </div>
            <div className="w-full">
              <span className="margin-r-10">Bumper:</span>
              <Checkbox
                checked={endorse.bumperFront}
                onChange={(e) => onChange(e.target.checked, "bumperFront")}
              >
                Front
              </Checkbox>
              <Checkbox
                checked={endorse.bumperRear}
                onChange={(e) => onChange(e.target.checked, "bumperRear")}
              >
                Rear
              </Checkbox>
            </div>
            <div className="w-full">
              <span className="margin-r-10">Tie Wrench:</span>
              <Radio.Group
                onChange={(e) => onChange(e.target.value, "tieWrench")}
                value={endorse.tieWrench}
              >
                <Radio value={"available"}>Available</Radio>
                <Radio value={"none"}>None</Radio>
              </Radio.Group>
            </div>
            <div className="w-full">
              <span className="margin-r-10">Washer Tank:</span>
              <Radio.Group
                onChange={(e) => onChange(e.target.value, "washerTank")}
                value={endorse.washerTank}
              >
                <Radio value={"available"}>Available</Radio>
                <Radio value={"none"}>None</Radio>
              </Radio.Group>
            </div>
            <div className="w-full">
              <span className="margin-r-10">Clutch Cap:</span>
              <Radio.Group
                onChange={(e) => onChange(e.target.value, "clutchCap")}
                value={endorse.clutchCap}
              >
                <Radio value={"available"}>Available</Radio>
                <Radio value={"none"}>None</Radio>
              </Radio.Group>
            </div>
            <div className="w-full">
              <span className="margin-r-10">Break Master/Cap:</span>
              <Radio.Group
                onChange={(e) => onChange(e.target.value, "breakMaster")}
                value={endorse.breakMaster}
              >
                <Radio value={"available"}>Available</Radio>
                <Radio value={"none"}>None</Radio>
              </Radio.Group>
            </div>
            <div className="w-full">
              <span className="margin-r-10">Tail Light:</span>
              <Checkbox
                checked={endorse.tailLightRH}
                onChange={(e) => onChange(e.target.checked, "tailLightRH")}
              >
                RH
              </Checkbox>
              <Checkbox
                checked={endorse.tailLightLH}
                onChange={(e) => onChange(e.target.checked, "tailLightLH")}
              >
                LH
              </Checkbox>
            </div>
          </Col>
          <Col span={24} style={{ marginTop: 10 }}>
            <FormInput
              description={"Other Findings, specify"}
              type="textarea"
              name="otherFindings"
              initialValue={props?.otherFindings}
              placeholder="Other Findings, specify"
            />
          </Col>
          <Divider>{`Date Release`}</Divider>
          <Col span={24}>
            <FormInput
              description={"Date Release/Completed"}
              initialValue={
                props?.dateReleased ? moment(props?.dateReleased) : null
              }
              name="dateReleased"
              type="datepicker"
              placeholder="Date Release/Completed"
            />
          </Col>
        </Row>
      </MyForm>
    </CModal>
  );
};

export default EndorsementForm;
