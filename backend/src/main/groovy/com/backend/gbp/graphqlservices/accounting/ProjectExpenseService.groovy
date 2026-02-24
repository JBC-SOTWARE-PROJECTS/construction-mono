package com.backend.gbp.graphqlservices.assets

import com.backend.gbp.domain.accounting.ProjectExpenseView
import com.backend.gbp.domain.assets.AssetUpcomingPreventiveMaintenance
import com.backend.gbp.domain.assets.AssetUpcomingPreventiveMaintenanceKms
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.data.domain.Page
import org.springframework.stereotype.Component

@Component
@GraphQLApi
@TypeChecked
class ProjectExpenseService extends AbstractDaoService<ProjectExpenseView> {
    ProjectExpenseService() {
        super(ProjectExpenseView.class)
    }


//    @GraphQLQuery(name = "projectExpenseView")
//    Page<ProjectExpenseView> projectExpenseView(
//            @GraphQLArgument(name = "projectid") String projectId,
//            @GraphQLArgument(name = "filter") String filter,
//            @GraphQLArgument(name = "page") Integer page,
//            @GraphQLArgument(name = "size") Integer size
//    ) {
////        String query = '''
////                SELECT p
////                FROM ProjectExpenseView p
////             ''';
//
////        String query = '''
////                SELECT p
////                FROM ProjectExpenseView p
////                WHERE lower(concat(  p.transTypeDescription)) like lower(concat('%',:filter,'%'))
////             ''';
//   String query = '''
//                SELECT p
//                FROM ProjectExpenseView p
//                WHERE p.transTypeDescription.project.id = '%',:projectId,'%'
//             ''';
//
////        String countQuery = '''
////                SELECT count(p)
////                FROM ProjectExpenseView p
////            ''';
//
//        String countQuery = '''
//                SELECT count(p)
//                FROM ProjectExpenseView p
//                  WHERE p.transTypeDescription.project.id = '%',:projectId,'%'
//            ''';
//
//
//        Map<String, Object> params = new HashMap<>()
//        params.put('projectId', projectId)
//
//        query += ''' ORDER BY p.transTypeDescription ASC'''
//
//        Page<ProjectExpenseView> result = getPageable(query, countQuery, page, size, params)
//        return result;
//
//
//    }

    @GraphQLQuery(name = "projectExpenseView")
    Page<ProjectExpenseView> projectExpenseView(
            @GraphQLArgument(name = "projectId") String projectId,
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size
    ) {
        UUID pid = projectId ? UUID.fromString(projectId) : null

        String query = '''
        SELECT p
        FROM ProjectExpenseView p
        WHERE 1=1
    '''
        String countQuery = '''
        SELECT count(p)
        FROM ProjectExpenseView p
        WHERE 1=1
    '''

        Map<String, Object> params = new HashMap<>()

        if (pid != null) {
            query += ' AND p.id.projectId = :projectId'
            countQuery += ' AND p.id.projectId = :projectId'
            params.put('projectId', pid)
        }

        query += ' ORDER BY p.transTypeDescription ASC'
        return getPageable(query, countQuery, page, size, params)
    }







}
