package com.backend.gbp.graphqlservices.cashier

import com.backend.gbp.domain.accounting.ARPaymentPosting
import com.backend.gbp.domain.cashier.PaymentItem
import com.backend.gbp.graphqlservices.base.AbstractDaoCompanyService
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.stereotype.Component

@Component
@GraphQLApi
class PaymentItemService extends AbstractDaoCompanyService<PaymentItem> {

    PaymentItemService(){
        super(PaymentItem.class)
    }
}
