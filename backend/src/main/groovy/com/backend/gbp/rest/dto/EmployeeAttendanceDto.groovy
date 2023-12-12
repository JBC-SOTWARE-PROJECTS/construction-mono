package com.backend.gbp.rest.dto

import groovy.transform.TupleConstructor

@TupleConstructor
class EmployeeAttendanceDto implements Serializable{
    public UUID id
    public UUID employee
    public UUID project
    public String attendance_time
    public String type
    public String additionalNote
    public String referenceId

    public EmployeeAttendanceDto(){

    }

    public EmployeeAttendanceDto(
            UUID id,
            UUID employee,
            UUID project,
            String attendance_time,
            String type,
            String referenceId
    ){
        this.id = id;
        this.employee = employee;
        this.project = project;
        this.attendance_time = attendance_time;
        this.type = type;
        this.referenceId = referenceId;
    }
}
