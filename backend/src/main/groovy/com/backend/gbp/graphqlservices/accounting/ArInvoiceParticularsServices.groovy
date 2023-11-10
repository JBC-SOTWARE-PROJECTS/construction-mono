package com.backend.gbp.graphqlservices.accounting

import com.backend.gbp.domain.accounting.ArInvoiceParticulars
import com.backend.gbp.graphqlservices.types.GraphQLResVal
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.data.domain.Page
import org.springframework.stereotype.Service

import javax.transaction.Transactional

@Service
@GraphQLApi
@Transactional(rollbackOn = Exception.class)
class ArInvoiceParticularsServices extends  ArAbstractFormulaHelper<ArInvoiceParticulars> {

    ArInvoiceParticularsServices(){
        super(ArInvoiceParticulars.class)
    }


    @GraphQLQuery(name="findOneArInvoiceParticulars")
    ArInvoiceParticulars findOneArInvoiceParticulars(
            @GraphQLArgument(name = "id") UUID id
    ){
        findOne(id)
    }

    @GraphQLMutation(name="addArInvoiceParticulars")
    GraphQLResVal<ArInvoiceParticulars> addArInvoiceParticulars(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "fields") Map<String,Object> fields
    ){
        try{

            def particulars = upsertFromMap(id, fields)
            return new GraphQLResVal<ArInvoiceParticulars>(particulars, true, 'Products/Services has been successfully saved. ')
        }
        catch (ignore){
            if(id){
                ArInvoiceParticulars particulars = findOne(id)
                return new GraphQLResVal<ArInvoiceParticulars>(particulars, false, 'Unable to save Products/Services. Please contact support for assistance.')
            }
            return new GraphQLResVal<ArInvoiceParticulars>(null, false, 'Unable to save Products/Services. Please contact support for assistance.')
        }
    }

    @GraphQLQuery(name="findAllInvoiceParticulars")
    Page<ArInvoiceParticulars> findAllInvoiceParticulars(
            @GraphQLArgument(name = "search") String search,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size
    ){
        Map<String,Object> params = [:]
        params['search'] = search

        getPageable(
                """ Select c from ArInvoiceParticulars c where ( lower(c.itemCode) like lower(concat('%',:search,'%')) or lower(c.itemName) like lower(concat('%',:search,'%')) ) order by c.itemName desc""",
                """ Select COUNT(c) from ArInvoiceParticulars c where ( lower(c.itemCode) like lower(concat('%',:search,'%')) or lower(c.itemName) like lower(concat('%',:search,'%')) )""",
                page,
                size,
                params
        )
    }



}
