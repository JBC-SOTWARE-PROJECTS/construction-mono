package com.backend.gbp.graphqlservices.hrm

import com.backend.gbp.domain.hrm.Schedule
import com.backend.gbp.graphqlservices.projects.ProjectService
import com.backend.gbp.graphqlservices.types.GraphQLResVal
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
import com.backend.gbp.repository.hrm.ScheduleTypeRepository
import com.backend.gbp.security.SecurityUtils
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

@TypeChecked
@Component
@GraphQLApi
class ScheduleService {

    @Autowired
    ScheduleTypeRepository scheduleTypeRepository

    @Autowired
    ProjectService projectService

    @Autowired
    ObjectMapper objectMapper


    //================================Query================================\\

//    @GraphQLQuery(name = "getDepartmentSchedule", description = "get department schedule config")
//    List<Department> getDepartmentSchedule(
//            @GraphQLArgument(name = "id") UUID id
//    ) {
//        if (!id) return departmentRepository.getDepartmentSchedule()
//        else return departmentRepository.getOneDepartmentSchedule(id)
//    }

    @GraphQLQuery(name = "getScheduleTypes", description = "get all schedule type config")
    List<Schedule> getScheduleTypes(
    ) {
        return scheduleTypeRepository.getAllSchedules(SecurityUtils.currentCompanyId())
    }

    //================================Query================================\\

    //===============================Mutation==============================\\

    @GraphQLMutation(name = "upsertScheduleType", description = "create or update schedule config.")
    GraphQLResVal<Schedule> upsertScheduleType(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "fields") Map<String, Object> fields
    ) {
        if (id) {
            Schedule schedule = scheduleTypeRepository.findById(id).get()
            schedule = objectMapper.updateValue(schedule, fields)
            schedule.project = projectService.findOne(UUID.fromString(fields.get('project_id') as String))
            schedule.company = SecurityUtils.currentCompany()
            scheduleTypeRepository.save(schedule)
            return new GraphQLResVal<Schedule>(schedule, true, "Successfully updated department schedule.")
        } else {
            Schedule schedule = objectMapper.convertValue(fields, Schedule)
            schedule.company = SecurityUtils.currentCompany()
            schedule.project = projectService.findOne(UUID.fromString(fields.get('project_id') as String))
            scheduleTypeRepository.save(schedule)
            return new GraphQLResVal<Schedule>(schedule, true, "Successfully created department schedule")
        }
    }

    @GraphQLMutation(name = "deleteDepartmentSchedule", description = "Delete one department schedule config.")
    GraphQLRetVal<String> deleteDepartmentSchedule(
            @GraphQLArgument(name = "id") UUID id
    ) {
        if (!id) return new GraphQLRetVal<String>("ERROR", false, "Failed to delete department schedule config.")
        Schedule schedule = scheduleTypeRepository.findById(id).get()
        scheduleTypeRepository.delete(schedule)
        return new GraphQLRetVal<String>("OK", true, "Successfully deleted department schedule config")
    }

//    @Transactional(rollbackFor = Exception.class)
//    @GraphQLMutation(name = "copyDepartmentSchedule", description = "Copy department schedule from other department")
//    GraphQLRetVal<String> copyDepartmentSchedule(
//            @GraphQLArgument(name = "id") UUID id,
//            @GraphQLArgument(name = "department") UUID department
//    ) {
//        if (!id || !department) return new GraphQLRetVal<String>("ERROR", false, "Failed to copy department schedule.")
//        if (id == department) return new GraphQLRetVal<String>("ERROR", false, "Can't copy department's own schedule")
//
//        Department departmentToCopy = departmentRepository.getOneDepartmentWithSchedule(department)
//        Department selectedDepartment = departmentRepository.getOneDepartmentWithSchedule(id)
//
//        List<Schedule> deleteSchedule = []
//        selectedDepartment.workSchedule.each { deleteSchedule.add(it) }
//        scheduleTypeRepository.deleteAll(deleteSchedule)
//
//        List<Schedule> schedules = []
//        departmentToCopy.workSchedule.each {
//            Schedule schedule = new Schedule()
//            schedule.title = it.title
//            schedule.label = it.label
//            schedule.dateTimeStartRaw = it.dateTimeStartRaw
//            schedule.dateTimeEndRaw = it.dateTimeEndRaw
//            schedule.color = it.color
//            schedule.mealBreakEnd = it.mealBreakEnd
//            schedule.mealBreakStart = it.mealBreakStart
//            schedule.department = selectedDepartment
//            schedules.add(schedule)
//        }
//        scheduleTypeRepository.saveAll(schedules)
//
//
//        return new GraphQLRetVal<String>("OK", true, "Successfully copied department schedule.")
//    }

    @Transactional(rollbackFor = Exception.class)
    @GraphQLMutation(name = "clearSchedule")
    GraphQLRetVal<String> clearSchedule(
            @GraphQLArgument(name = "id") UUID id
    ) {
        if (!id) return new GraphQLRetVal<String>("ERROR", false, "Failed to clear department schedule")

        List<Schedule> schedules = scheduleTypeRepository.getOneSchedule(id)
        scheduleTypeRepository.deleteAll(schedules)

        return new GraphQLRetVal<String>("OK", true, "Successfully cleared department schedule.")
    }


    //===============================Mutation==============================\\
}
