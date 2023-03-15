package com.backend.gbp.graphqlservices.hrm


import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component


@Component
@GraphQLApi
@TypeChecked
class EmployeeFilterService extends AbstractDaoService<Employee> {

    EmployeeFilterService() {
        super(Employee.class)
    }

    @Autowired
    ObjectMapper objectMapper

//    @GraphQLQuery(name = "inventoryListPageable")
//    Page<Inventory> findByFilters(
//            @GraphQLArgument(name = "filter") String filter,
//            @GraphQLArgument(name = "group") UUID group,
//            @GraphQLArgument(name = "category") List<UUID> category,
//            @GraphQLArgument(name = "page") Integer page,
//            @GraphQLArgument(name = "size") Integer size
//    ) {
//
//        User user = userRepository.findOneByLogin(SecurityUtils.currentLogin())
//        Employee employee = employeeRepository.findOneByUser(user)
//
//        String query = '''Select inv from Inventory inv where
//						lower(concat(inv.descLong,inv.sku)) like lower(concat('%',:filter,'%'))
//						and inv.depId=:departmentid and
//						inv.active = true'''
//
//        String countQuery = '''Select count(inv) from Inventory inv where
//							lower(concat(inv.descLong,inv.sku)) like lower(concat('%',:filter,'%'))
//							and inv.depId=:departmentid and
//							inv.active = true'''
//
//        Map<String, Object> params = new HashMap<>()
//        params.put('departmentid', employee.departmentOfDuty.id)
//        params.put('filter', filter)
//
//        if (group) {
//            query += ''' and (inv.item.item_group.id = :group)'''
//            countQuery += ''' and (inv.item.item_group.id = :group)'''
//            params.put("group", group)
//        }
//
//        if (category) {
//            query += ''' and (inv.item.item_category.id IN (:category))'''
//            countQuery += ''' and (inv.item.item_category.id IN (:category))'''
//            params.put("category", category)
//        }
//
//        query += ''' ORDER BY inv.descLong ASC'''
//
//        Page<Inventory> result = getPageable(query, countQuery, page, size, params)
//        return result
//    }

    @GraphQLQuery(name = "employeeByFilter")
    List<Employee> employeeByFilter(
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "status") Boolean status,
            @GraphQLArgument(name = "office") UUID office,
            @GraphQLArgument(name = "position") UUID position
    ) {

        String query = '''Select e from Employee e where lower(e.fullName) like lower(concat('%',:filter,'%'))'''
        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)

        if (status != null) {
            query += ''' and (e.isActive = :status)'''
            params.put("status", status)
        }

        if (office) {
            query += ''' and (e.office.id = :office)'''
            params.put("office", office)
        }
        if (position) {
            query += ''' and (e.position.id = :position)'''
            params.put("position", position)
        }

        createQuery(query, params).resultList.sort { it.lastName }
    }

}
