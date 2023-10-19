package com.backend.gbp.rest.dto.mobile

import com.backend.gbp.domain.CompanySettings
import com.backend.gbp.domain.Office
import com.backend.gbp.domain.Position

class EmployeeDetailsDto implements Serializable{
    public UUID id
    public UUID officeId
    public UUID companyId
    public UUID positionId
    public String officeName
    public String positionName
    public String companyName
    public String firstName
    public String lastName
    public String employeeType
    public String pinCode

    public EmployeeDetailsDto(){

    }

    public EmployeeDetailsDto(
            UUID id, UUID companyId, String companyName,
            UUID officeId, UUID positionId, String officeName, String positionName,
            String firstName, String lastName, String employeeType, String pinCode
    ) {
        this.id = id;
        this.companyId = companyId;
        this.companyName = companyName;
        this.officeId = officeId;
        this.positionId = positionId;
        this.officeName = officeName;
        this.positionName = positionName;
        this.firstName = firstName;
        this.lastName = lastName;
        this.employeeType = employeeType;
        this.pinCode = pinCode;
    }

    public String setPinCode(String pinCode){
        return this.pinCode = pinCode;
    }
    public String getPinCode(){
        return pinCode;
    }
}
