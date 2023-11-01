import { gql } from "@apollo/client";

export const GET_OFFICE_RECORDS = gql`
  query ($filter: String!, $company: UUID, $size: Int, $page: Int) {
    officePage(filter: $filter, company: $company, size: $size, page: $page) {
      content {
        id
        company {
          id
          companyName
        }
        officeCode
        officeDescription
        officeType
        telNo
        phoneNo
        emailAdd
        fullAddress
        officeCountry
        officeProvince
        provinceId
        officeMunicipality
        cityId
        officeBarangay
        officeStreet
        officeZipcode
        tinNumber
        officeSecretary
        status
      }
      totalElements
      number
      size
    }
  }
`;

export const GET_RECORDS_ADDRESS = gql`
  query ($provice: UUID, $city: UUID) {
    country: countries {
      value: country
      label: country
    }
    province: provinces {
      id
      value: provinceName
      label: provinceName
    }
    city: cityByProvince(id: $provice) {
      id
      value: cityName
      label: cityName
    }
    barangay: barangayByCity(id: $city) {
      value: barangayName
      label: barangayName
    }
  }
`;

export const UPSER_OFFICE_RECORD = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsertOffice(id: $id, fields: $fields) {
      id
    }
  }
`;
