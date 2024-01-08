package com.backend.gbp.graphqlservices.payroll

import com.backend.gbp.domain.hrm.dto.HoursLog
import com.backend.gbp.domain.payroll.AdjustmentCategory
import com.backend.gbp.graphqlservices.types.GraphQLResVal
import com.backend.gbp.repository.payroll.AdjustmentCategoryRepository
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
@Transactional(rollbackFor = Exception.class)
class TimekeepingUtilityService {

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    AdjustmentCategoryRepository adjustmentCategoryRepository


    static void consolidateProjectBreakdown(HashMap<String, HoursLog> breakdownMap, HoursLog it) {
        HoursLog breakdown = breakdownMap.get(it.project as String)
        if (!breakdown) breakdown = new HoursLog()
        breakdown.project = it.project
        breakdown.projectName = it.projectName
        breakdown.late += it.late
        breakdown.underTime += it.underTime
        breakdown.absent += it.absent
        breakdown.regular += it.regular
        breakdown.overtime += it.overtime
        breakdown.regularHoliday += it.regularHoliday
        breakdown.overtimeHoliday += it.overtimeHoliday
        breakdown.regularDoubleHoliday += it.regularDoubleHoliday
        breakdown.overtimeDoubleHoliday += it.overtimeDoubleHoliday
        breakdown.regularSpecialHoliday += it.regularSpecialHoliday
        breakdown.overtimeSpecialHoliday += it.overtimeSpecialHoliday
//                            if (breakdown) {
        breakdownMap.put(it.project as String, breakdown)
//                            }
    }
}
