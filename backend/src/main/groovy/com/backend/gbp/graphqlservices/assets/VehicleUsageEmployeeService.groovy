package com.backend.gbp.graphqlservices.assets

import com.backend.gbp.domain.assets.VehicleUsageEmployee
import com.backend.gbp.domain.assets.VehicleUsageMonitoring
import com.backend.gbp.domain.hrm.Allowance
import com.backend.gbp.domain.hrm.AllowanceItem
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.repository.asset.VehicleUsageEmployeeRepository
import com.backend.gbp.repository.hrm.AllowanceItemRepository
import com.backend.gbp.security.SecurityUtils
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.stereotype.Component

import javax.transaction.Transactional

@Component
@GraphQLApi
@TypeChecked
class VehicleUsageEmployeeService extends AbstractDaoService<VehicleUsageEmployee> {
    VehicleUsageEmployeeService() {
        super(VehicleUsageEmployee.class)
    }

    @Autowired
    VehicleUsageEmployeeRepository vehicleUsageEmployeeRepository

    @GraphQLMutation(name = "upsertVehicleUsageEmployee")
    @Transactional
    VehicleUsageEmployee upsertVehicleUsageEmployee(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "id") UUID id
    ){
        def company = SecurityUtils.currentCompanyId()
        def project = upsertFromMap(id, fields, { VehicleUsageEmployee entity, boolean forInsert ->
            entity.company = company
        })

        return project
    }

    @GraphQLMutation(name = "upsertMultiVehicleUsageEmployee")
    @Transactional
    List<VehicleUsageEmployee> upsertMultiVehicleUsageEmployee(
            @GraphQLArgument(name ="employeeList") List<VehicleUsageEmployee> employeeList,
            @GraphQLArgument(name = "usageId") UUID usageId
    ){
        List<VehicleUsageEmployee> vehicleUsageEmployees = new ArrayList<VehicleUsageEmployee>()
//        def company = SecurityUtils.currentCompanyId()
//        def project = upsertFromMap(id, fields, { VehicleUsageEmployee entity, boolean forInsert ->
//            entity.company = company
//        })

        vehicleUsageEmployees = vehicleUsageEmployeeRepository.saveAll(employeeList);

        return vehicleUsageEmployees
    }


    @GraphQLQuery(name = "vehicleUsageEmployeeListPageable")
    Page<VehicleUsageEmployee> vehicleUsageEmployeeListPageable(
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size,
            @GraphQLArgument(name = "asset") UUID asset
    ) {

        String query = '''Select p from VehicleUsageEmployee p where p.asset.id = :asset AND
						lower(concat(p.designation)) like lower(concat('%',:filter,'%'))'''

        String countQuery = '''Select count(p) from VehicleUsageEmployee p where p.asset.id = :asset AND
							lower(concat(p.designation)) like lower(concat('%',:filter,'%'))'''

        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)
        params.put('asset', asset)

        query += ''' ORDER BY p.designation DESC'''

        Page<VehicleUsageEmployee> result = getPageable(query, countQuery, page, size, params)
        return result
    }
}
