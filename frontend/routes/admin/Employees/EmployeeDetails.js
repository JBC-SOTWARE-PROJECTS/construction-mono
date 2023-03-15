import React from "react";
import { Col, Row } from "antd";
import About from "../../../app/components/profile/About";
import Biography from "../../../app/components/profile/Biography";
import Contact from "../../../app/components/profile/Contact";
import ProfileHeader from "../../../app/components/profile/ProfileHeader";
import "./social-apps.css";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import _ from "lodash";
import moment from "moment"
import numeral from "numeral";


const GET_RECORDS = gql`
query($id: UUID) {
    emp: employeeById(id: $id) {
        id
        office{
          id
          officeDescription
        }
        position{
          id
          description
        }
        employeeNo
        fullName
        fullAddress
        emailAddress
        nationality
        civilStatus
        gender
        dob
        bloodType
        emergencyContactName
        emergencyContactAddress
        emergencyContactRelationship
        emergencyContactNo
        employeeTelNo
        employeeCelNo
        philhealthNo
        sssNo
        tinNo
        pagIbigId
        employeeType
        basicSalary
        user {
          login
          id
          accessNames
          access
          roles
        }
    }
}`;

const EmployeeDetails = ({ account, id }) => {
  const { data } = useQuery(GET_RECORDS, {
    variables: {
      id: id
    }
  });
  //======================= =================== =================================================//
  const overview = (data) => {
    return [
      {
        id: 1,
        title: 'Birthday',
        icon: 'birthday-new',
        desc: [`${moment(data?.dob).format("MMM, Do YYYY")}`],
        col: { xl: 8, lg: 12, md: 12, sm: 12, xs: 24 }
      },
      {
        id: 2,
        title: 'Gender',
        icon: 'user-o',
        desc: [`${data?.gender}`],
        col: { xl: 8, lg: 12, md: 12, sm: 12, xs: 24 }
      },
      {
        id: 3,
        title: 'Nationality',
        icon: 'map-street-view',
        desc: [`${data?.nationality ? data.nationality : '---'}`],
        col: { xl: 8, lg: 12, md: 12, sm: 12, xs: 24 }
      },
      {
        id: 4,
        title: 'Address',
        icon: 'home',
        desc: [`${data?.fullAddress ? data.fullAddress : '---'}`],
        col: { xl: 24, lg: 24, md: 24, sm: 24, xs: 24 }
      },
    ];

  }

  const work = (data) => {
    return [
      {
        id: 1,
        title: 'Position',
        icon: 'badge',
        desc: [`${data?.position ? data.position?.description : '---'}`],
        col: { xl: 8, lg: 12, md: 12, sm: 12, xs: 24 }
      },
      {
        id: 2,
        title: 'Employement Status',
        icon: 'important',
        desc: [`${data?.employeeType ? data.employeeType : '---'}`],
        col: { xl: 8, lg: 12, md: 12, sm: 12, xs: 24 }
      },
      {
        id: 3,
        title: 'Basic Salary',
        icon: 'revenue-new',
        desc: [`${data?.basicSalary ? numeral(data.basicSalary).format('0,0.00') : '---'}`],
        col: { xl: 8, lg: 12, md: 12, sm: 12, xs: 24 }
      },
    ];
  }

  const others = (data) => {
    return [
      {
        id: 1,
        title: 'Blood Type',
        icon: 'affix',
        desc: [`${data?.bloodType ? data.bloodType : '---'}`],
        col: { xl: 8, lg: 12, md: 12, sm: 12, xs: 24 }
      },
      {
        id: 2,
        title: 'Philhealth #',
        icon: 'star',
        desc: [`${data?.philhealthNo ? data.philhealthNo : '---'}`],
        col: { xl: 8, lg: 12, md: 12, sm: 12, xs: 24 }
      },
      {
        id: 3,
        title: 'SSS #',
        icon: 'star',
        desc: [`${data?.sssNo ? data.sssNo : '---'}`],
        col: { xl: 8, lg: 12, md: 12, sm: 12, xs: 24 }
      },
      {
        id: 3,
        title: 'TIN #',
        icon: 'star',
        desc: [`${data?.tinNo ? data.tinNo : '---'}`],
        col: { xl: 8, lg: 12, md: 12, sm: 12, xs: 24 }
      },
      {
        id: 3,
        title: 'Pag-ibig #',
        icon: 'star',
        desc: [`${data?.pagIbigId ? data.pagIbigId : '---'}`],
        col: { xl: 8, lg: 12, md: 12, sm: 12, xs: 24 }
      },
    ];
  }

  const contact = (data) => {
    return [
      {
        id: 1,
        title: 'Email',
        icon: 'email',
        desc: [<span className="gx-link" key={1}>{data?.emailAddress ? data.emailAddress : '---'}</span>]
      },
      {
        id: 2,
        title: 'Telephone #',
        icon: 'queries',
        desc: [`${data?.employeeTelNo ? data.employeeTelNo : '---'}`]
      }, {
        id: 3,
        title: 'Phone #',
        icon: 'phone',
        desc: [`${data?.employeeCelNo ? data.employeeCelNo : '---'}`]
      },
    ];
  }

  const contactEmergency = (data) => {
    return [
      {
        id: 1,
        title: 'Name',
        icon: 'avatar',
        desc: [`${data?.emergencyContactName ? data.emergencyContactName : '---'}`]
      },
      {
        id: 2,
        title: 'Relationship',
        icon: 'family',
        desc: [`${data?.emergencyContactRelationship ? data.emergencyContactRelationship : '---'}`]
      },
      {
        id: 3,
        title: 'Address',
        icon: 'home',
        desc: [`${data?.emergencyContactAddress ? data.emergencyContactAddress : '---'}`]
      },
      {
        id: 3,
        title: 'Phone #',
        icon: 'phone',
        desc: [`${data?.emergencyContactNo ? data.emergencyContactNo : '---'}`]
      },
    ];
  }

  return (
    <>
      <ProfileHeader data={_.get(data, "emp")} />
      <div className="gx-profile-content">
        <Row>
          <Col xl={16} lg={14} md={14} sm={24} xs={24}>
            <About overview={overview(_.get(data, "emp"))} work={work(_.get(data, "emp"))} others={others(_.get(data, "emp"))} />
            <Biography data={_.get(data, "emp.user")} />
          </Col>

          <Col xl={8} lg={10} md={10} sm={24} xs={24}>
            <Contact contacts={contact(_.get(data, "emp"))} title="Contact" />
            <Row>
              <Col xl={24} lg={24} md={24} sm={12} xs={24}>
                <Contact contacts={contactEmergency(_.get(data, "emp"))} title="Emergeny Contact" />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </>
  );

}

export default EmployeeDetails;


