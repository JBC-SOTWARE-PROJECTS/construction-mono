package com.backend.gbp.graphqlservices.assets

import com.backend.gbp.domain.assets.VehicleUsageEmployee
import com.backend.gbp.domain.assets.VehicleUsageMonitoring
import com.backend.gbp.domain.hrm.Allowance
import com.backend.gbp.domain.hrm.AllowanceItem
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.graphqlservices.hrm.EmployeeService
import com.backend.gbp.graphqlservices.inventory.ItemService
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
import com.backend.gbp.repository.asset.VehicleUsageEmployeeRepository
import com.backend.gbp.repository.hrm.AllowanceItemRepository
import com.backend.gbp.repository.hrm.EmployeeRepository
import com.backend.gbp.rest.dto.AssetRepairMaintenanceItemDto
import com.backend.gbp.rest.dto.VehicleUsageEmployeeDto
import com.backend.gbp.security.SecurityUtils
import com.fasterxml.jackson.databind.ObjectMapper
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
    ObjectMapper objectMapper

    @Autowired
    VehicleUsageMonitoringService vehicleUsageMonitoringService

    @Autowired
    private EmployeeRepository employeeRepository

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
    GraphQLRetVal<String> upsertMultiVehicleUsageEmployee(
            @GraphQLArgument(name ="employeeList") ArrayList<Map<String, Object>> employeeList,
            @GraphQLArgument(name = "usageID") UUID usageID,
            @GraphQLArgument(name = "toDelete")  List<UUID> toDelete
    ){
        List<VehicleUsageEmployee> vehicleUsageEmployees = new ArrayList<VehicleUsageEmployee>()


//        def company = SecurityUtils.currentCompanyId()
//        def project = upsertFromMap(id, fields, { VehicleUsageEmployee entity, boolean forInsert ->
//            entity.company = company
//        })

   //     vehicleUsageEmployees = vehicleUsageEmployeeRepository.saveAll(employeeList);


        try{
            if(toDelete.size() > 0) {
                toDelete.each{
                    deleteById(it);
                }
            }


            if(employeeList.size() > 0 ){
                employeeList.each{
                    def empItem = objectMapper.convertValue(it, VehicleUsageEmployeeDto.class)
                    def usage = vehicleUsageMonitoringService.findOne(usageID );

                    def upsert = new VehicleUsageEmployee();
                    if(empItem.id != null){
                        upsert = findOne(empItem.id as UUID)
                    }

                    upsert.designation = empItem.designation;
                    upsert.laborCost = empItem.laborCost;
                    upsert.remarks = empItem.remarks;
                    upsert.timeRenderedEnd = empItem.timeRenderedEnd;
                    upsert.timeRenderedStart = empItem.timeRenderedStart;
                    upsert.item = usage.item;
                    upsert.asset = usage.asset;
                    upsert.vehicleUsage = usage;
                    upsert.company = usage.company;
                    upsert.employee = employeeRepository.findById(empItem.employee  ).get()

                    save(upsert);
                }
            }


        }catch( Exception e){
            throw new Exception("Something was Wrong : " + e)
        }

        return new GraphQLRetVal<String>("success", true , "Successfully Saved!")
    }


    @GraphQLQuery(name = "vehicleUsageEmployeeListPageable")
    Page<VehicleUsageEmployee> vehicleUsageEmployeeListPageable(
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size,
            @GraphQLArgument(name = "usageID") UUID usageID
    ) {

        String query = '''Select p from VehicleUsageEmployee p where p.vehicleUsage.id = :usageID AND
						lower(concat(p.designation)) like lower(concat('%',:filter,'%'))'''

        String countQuery = '''Select count(p) from VehicleUsageEmployee p where p.vehicleUsage.id = :usageID AND
							lower(concat(p.designation)) like lower(concat('%',:filter,'%'))'''

        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)
        params.put('usageID', usageID)

        query += ''' ORDER BY p.designation DESC'''

        Page<VehicleUsageEmployee> result = getPageable(query, countQuery, page, size, params)
        return result
    }
}
