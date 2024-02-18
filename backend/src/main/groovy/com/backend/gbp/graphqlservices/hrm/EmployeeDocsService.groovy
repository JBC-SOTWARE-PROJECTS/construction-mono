package com.backend.gbp.graphqlservices.hrm

import com.backend.gbp.domain.CompanySettings
import com.backend.gbp.domain.assets.AssetRepairMaintenance
import com.backend.gbp.domain.assets.VehicleUsageDocs
import com.backend.gbp.domain.hrm.Allowance
import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.domain.hrm.EmployeeDocs
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
import com.backend.gbp.repository.hrm.AllowanceRepository
import com.backend.gbp.repository.hrm.EmployeeRepository
import com.backend.gbp.security.SecurityUtils
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Component

import javax.transaction.Transactional

@TypeChecked
@Component
@GraphQLApi
class EmployeeDocsService extends AbstractDaoService<EmployeeDocs> {

    EmployeeDocsService() {
        super(EmployeeDocs.class)
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    private EmployeeRepository employeeRepository


    //---------------------- Queries and Mutation ------------------------------------\\

    @GraphQLQuery(name ="fetchAllEmpDocs", description = "get all fetch Emp Docs")
    List<EmployeeDocs>fetchAllEmpDocs(){
        return findAll()
    }

    @GraphQLQuery(name = "employeeDocsListPageable")
    Page<EmployeeDocs> employeeDocsListPageable(
            @GraphQLArgument(name = "employee") UUID employee,
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size

    ) {

        String query = '''Select p from EmployeeDocs p where p.employee.id = :employee '''

        String countQuery = '''Select count(p) from EmployeeDocs p where p.employee.id = :employee '''

        Map<String, Object> params = new HashMap<>()
        //  params.put('filter', filter)
        params.put('employee', employee)

        // query += ''' ORDER BY p.description DESC'''

        Page<EmployeeDocs> result = getPageable(query, countQuery, page, size, params)
        return result
    }

//    @GraphQLQuery(name ="fetchAllowancePageable", description = "get all allowance")
//    Page<Allowance>fetchAllowancePageable(
//            @GraphQLArgument(name ="filter") String filter,
//            @GraphQLArgument(name = 'page') Integer page,
//            @GraphQLArgument(name = 'pageSize') Integer pageSize
//    ){
//        allowanceRepository.getAllowancePageable(filter, PageRequest.of(page, pageSize, Sort.Direction.ASC, 'name'))
//    }


    // ============== Mutation =======================//
    @GraphQLMutation(name = "upsertEmpDocs")
    @Transactional
    EmployeeDocs upsertEmpDocs(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "employee") UUID employee,
            @GraphQLArgument(name = "fields") Map<String, Object> fields

    ){
        Employee employeeDet = employeeRepository.findById(employee).get();
        def company = SecurityUtils.currentCompanyId();
        def project = upsertFromMap(id, fields, { EmployeeDocs entity, boolean forInsert ->
            entity.company = company;
            entity.employee = employeeDet;
        })

        return project
    }


    @GraphQLMutation(name = "deleteEmpDocs", description = "Delete deleteEmpDocs")
    GraphQLRetVal<String> deleteEmpDocs(@GraphQLArgument(name = "id") UUID id) {

        EmployeeDocs employeeDocs = findOne(id);
        delete(employeeDocs);
        return new GraphQLRetVal<String>("OK", true, "Successfully deleted doc.")
    }

}

