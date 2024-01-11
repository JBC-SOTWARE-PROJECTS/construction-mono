package com.backend.gbp.graphqlservices.projects

import com.backend.gbp.domain.projects.ProjectWorkAccomplish
import com.backend.gbp.graphqlservices.base.AbstractDaoCompanyService
import com.backend.gbp.graphqlservices.types.GraphQLResVal
import com.backend.gbp.services.GeneratorService
import com.backend.gbp.services.GeneratorType
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.apache.commons.lang3.StringUtils
import org.springframework.stereotype.Component

import javax.transaction.Transactional


@Component
@GraphQLApi
@TypeChecked
class ProjectWorkAccomplishService extends AbstractDaoCompanyService<ProjectWorkAccomplish> {

    ProjectWorkAccomplishService() {
        super(ProjectWorkAccomplish.class)
    }

    @Autowired
    ProjectWorkAccomplishItemsService accomplishItemsService

    @Autowired
    ProjectCostService projectCostService

    @Autowired
    GeneratorService generatorService


    @Transactional
    @GraphQLMutation(name='upsertProjectWorkAccomplish')
    GraphQLResVal<ProjectWorkAccomplish> upsertProjectWorkAccomplish(
            @GraphQLArgument(name='id') UUID id,
            @GraphQLArgument(name='fields') Map<String,Object> fields,
            @GraphQLArgument(name='itemFields') List<Map<String,Object>> itemFields
    ){
        if(id){
            def existing = findOne(id)
            def lists = getOpenProjectWorkAccomplishPageByProject(id,existing.project) ?: []

            if((existing?.status?:'').equalsIgnoreCase('LOCKED'))
                return new GraphQLResVal<ProjectWorkAccomplish>(existing, false , "Cannot update ${existing?.recordNo?:''}. It's currently locked. Please unlock the record to proceed with updates..")

            if(lists.size()>0){
                return new GraphQLResVal<ProjectWorkAccomplish>(existing, false , "Cannot update ${existing?.recordNo?:''}. A record is currently open, preventing the transaction. Please close the open record and try again.")
            }

        }
        def workAccomplish = upsertFromMap(id,fields, { ProjectWorkAccomplish entity, boolean forInsert ->
            if (forInsert) {
                entity.status = 'OPEN'
                entity.recordNo = generatorService.getNextValue(GeneratorType.WORK_ACCOMPLISH, {
                    return StringUtils.leftPad(it.toString(), 6, "0")
                })

                def lists = getAllOpenProjectWorkAccomplishPageByProject(entity.project)
                lists.each {
                    it.status = 'LOCKED'
                    save(it)
                }
            }
        })

        workAccomplish.totalAmount = 0.00
        workAccomplish.totalPrevAmount = 0.00
        workAccomplish.totalPeriodAmount = 0.00
        workAccomplish.totalBalanceAmount = 0.00
        workAccomplish.totalPercentage = 0.00

        if(workAccomplish){
            itemFields.each {
                items ->
                    items['periodStart'] = workAccomplish.periodStart
                    items['periodEnd'] = workAccomplish.periodEnd
                    items['projectWorkAccomplishId'] = workAccomplish.id

                UUID itemId = id ? items['id'] ? UUID.fromString(items['id'] as String) : null : null
                def workAccomplishItems =  accomplishItemsService.upsertFromMap(itemId,items)

                def projectCost = projectCostService.findOne(workAccomplishItems.projectCost)
                projectCost.billedQty = (workAccomplishItems?.prevQty ?: 0) + (workAccomplishItems?.thisPeriodQty ?: 0)
                projectCostService.save(projectCost)

                workAccomplish.totalAmount = workAccomplish.totalAmount + ((workAccomplishItems?.qty ?: 0.00) * (workAccomplishItems?.cost ?: 0.00))
                workAccomplish.totalPrevAmount = workAccomplish.totalPrevAmount + workAccomplishItems?.prevAmount ?: 0.00
                workAccomplish.totalPeriodAmount = workAccomplish.totalPeriodAmount + workAccomplishItems?.thisPeriodAmount ?: 0.00
                workAccomplish.totalBalanceAmount = workAccomplish.totalBalanceAmount + workAccomplishItems?.balanceAmount ?: 0.00
                workAccomplish.totalPercentage = workAccomplish.totalPercentage + workAccomplishItems?.percentage ?: 0.00

            }
        }

        save(workAccomplish)
        return new GraphQLResVal<ProjectWorkAccomplish>(workAccomplish, true , "Successfully saved.")
    }

    @GraphQLQuery(name='getProjectWorkAccomplishPageByProject')
    List<ProjectWorkAccomplish> getProjectWorkAccomplishPageByProject(
            @GraphQLArgument(name='id') UUID id
    ){
        createQuery("""
            Select p from ProjectWorkAccomplish p
            where p.project = :id
            order by p.recordNo desc
        """)
            .setParameter('id',id)
            .getResultList()
    }

    @GraphQLQuery(name='getOpenProjectWorkAccomplishPageByProject')
    List<ProjectWorkAccomplish> getOpenProjectWorkAccomplishPageByProject(
            @GraphQLArgument(name='id') UUID id,
            @GraphQLArgument(name='projectId') UUID projectId
    ){
        createQuery("""
            Select p from ProjectWorkAccomplish p
            where p.project = :projectId and p.status = 'OPEN' and p.id != :id
        """)
                .setParameter('id',id)
                .setParameter('projectId',projectId)
                .getResultList()
    }

    @GraphQLQuery(name='getAllOpenProjectWorkAccomplishPageByProject')
    List<ProjectWorkAccomplish> getAllOpenProjectWorkAccomplishPageByProject(
            @GraphQLArgument(name='projectId') UUID projectId
    ){
        createQuery("""
            Select p from ProjectWorkAccomplish p
            where p.project = :projectId and p.status = 'OPEN'
        """)
                .setParameter('projectId',projectId)
                .getResultList()
    }

    @GraphQLQuery(name='findOneProjectWorkAccomplish')
    ProjectWorkAccomplish findOneProjectWorkAccomplish(
            @GraphQLArgument(name='id') UUID id
    ){
        createQuery("""
            Select p from ProjectWorkAccomplish p
            where p.id = :id
        """)
                .setParameter('id',id)
                .singleResult
    }

    @GraphQLMutation(name='projectWorkAccomplishToggleLock')
    ProjectWorkAccomplish projectWorkAccomplishToggleLock(
            @GraphQLArgument(name='id') UUID id
    ){
        def workAccomplishment = findOne(id)
        workAccomplishment.status = workAccomplishment.status == 'LOCKED' ? 'OPEN' : 'LOCKED'
        if(workAccomplishment.status == 'OPEN'){
            def lists = getOpenProjectWorkAccomplishPageByProject(workAccomplishment.id,workAccomplishment.project)
            lists.each {
                it.status = 'LOCKED'
                save(it)
            }
        }

        return  save(workAccomplishment)
    }
}
