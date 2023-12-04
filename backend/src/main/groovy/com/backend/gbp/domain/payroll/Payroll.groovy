package com.backend.gbp.domain.payroll

import com.backend.gbp.domain.CompanySettings
import com.backend.gbp.domain.accounting.IntegrationDomainEnum
import com.backend.gbp.domain.annotations.UpperCase
import com.backend.gbp.domain.payroll.common.PayrollAuditingEntity
import com.backend.gbp.domain.types.AutoIntegrateable
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.Type

import javax.persistence.*
import java.time.Instant

@Entity
@Table(schema = "payroll", name = "payrolls")
//@SQLDelete(sql = "UPDATE payroll.timekeepings SET deleted = true WHERE id = ?")
//@Where(clause = "deleted <> true or deleted is  null ")
class Payroll extends PayrollAuditingEntity implements Serializable, AutoIntegrateable {


    @GraphQLQuery
    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "uuid")
    @Type(type = "pg-uuid")
    UUID id

    @GraphQLQuery
    @Column(name = "title", columnDefinition = "varchar")
    String title

    @GraphQLQuery
    @Column(name = "description", columnDefinition = "varchar")
    String description


    @GraphQLQuery
    @Column(name = "start_date", columnDefinition = "timestamp")
    Instant dateStart

    @GraphQLQuery
    @Column(name = "end_date", columnDefinition = "timestamp")
    Instant dateEnd

//    @GraphQLQuery
//    @Column(name = "deleted", columnDefinition = "bool")
//    Boolean deleted


    @OneToMany(mappedBy = "payroll", orphanRemoval = true, cascade = CascadeType.ALL)
    List<PayrollEmployee> payrollEmployees = []

    @NotFound(action = NotFoundAction.IGNORE)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company", referencedColumnName = "id")
    CompanySettings company

    @OneToOne(mappedBy = "payroll")
    Timekeeping timekeeping

    @OneToOne(mappedBy = "payroll")
    PayrollLoan loan

    @OneToOne(mappedBy = "payroll")
    PayrollContribution contribution

    @OneToOne(mappedBy = "payroll")
    PayrollAdjustment adjustment

    @OneToOne(mappedBy = "payroll")
    PayrollOtherDeduction otherDeduction

    @OneToOne(mappedBy = "payroll")
    PayrollAllowance allowance

    @GraphQLQuery
    @Column(name = "posted_ledger", columnDefinition = "uuid")
    UUID postedLedger

    @GraphQLQuery
    @Column(name = "posted", columnDefinition = "bool")
    @UpperCase
    Boolean posted

    @GraphQLQuery
    @Column(name = "posted_by", columnDefinition = "varchar")
    @UpperCase
    String postedBy


    @Override
    String getDomain() {
        return IntegrationDomainEnum.PAYROLL.name()
    }

    @Transient
    String flagValue

    @Override
    Map<String, String> getDetails() {
        return [:]
    }

    @Transient
    BigDecimal salariesPayableTotalCredit

    @Transient
    BigDecimal salariesPayableTotalDebit


}
