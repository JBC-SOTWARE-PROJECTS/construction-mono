package com.backend.gbp.graphqlservices.accounting

import com.backend.gbp.domain.accounting.HeaderLedgerGroup
import com.backend.gbp.domain.accounting.Integration
import com.backend.gbp.domain.accounting.IntegrationGroup
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.security.SecurityUtils
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@GraphQLApi
class HeaderGroupServices extends AbstractDaoService<HeaderLedgerGroup> {

    HeaderGroupServices(){
        super(HeaderLedgerGroup.class)
    }


}
