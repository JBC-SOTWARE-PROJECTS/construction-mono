package com.backend.gbp.graphqlservices.cashier

import com.backend.gbp.domain.billing.DiscountDetails
import com.backend.gbp.domain.cashier.Payment
import com.backend.gbp.domain.cashier.PaymentItem
import com.backend.gbp.services.cashiering.FolioTransactionService
import com.backend.gbp.graphqlservices.types.GraphQLResVal
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

import javax.transaction.Transactional

@Component
@GraphQLApi
class PaymentTransactionService {

    @Autowired
    FolioTransactionService folioTransactionService

    @Transactional(rollbackOn = Exception)
    @GraphQLMutation(name="processPayment")
    GraphQLResVal<Payment> processPayment(
            @GraphQLArgument(name="type") String type,
            @GraphQLArgument(name="tendered") List<Map<String, Object>> tendered = [],
            @GraphQLArgument(name="items") List<Map<String, Object>> items = [] ,
            @GraphQLArgument(name="fields") Map<String,Object> fields = [:]
    ){
//        try{
            def paymentTracker = new Payment()
            switch (type){
                case "project-payments":
                    paymentTracker = folioTransactionService.processFolioPayment(paymentTracker,tendered,items,fields)
                    break
                default:
                break
            }

            return  new GraphQLResVal<Payment>(paymentTracker,true,"Payment processed successfully")
//        }catch (e){
//            return  new GraphQLResVal<PaymentTracker>(null,false,e.message)
//        }
    }


    @GraphQLQuery(name = "getDefaultPaymentItems")
    List<PaymentItem> getDefaultPaymentItems(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "type") String type
    ) {
            List<PaymentItem> items = []
            switch (type){
               case "project-payments":
                    items = folioTransactionService.getFolioBalanceItems(id)
                    break
               default:
                    items =  []
                    break
            }
            return items
    }


}
