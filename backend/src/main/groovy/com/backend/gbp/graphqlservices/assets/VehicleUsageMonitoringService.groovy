package com.backend.gbp.graphqlservices.assets

import com.backend.gbp.domain.assets.AssetMaintenanceTypes
import com.backend.gbp.domain.assets.VehicleUsageMonitoring
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.repository.asset.AssetsRepository
import com.backend.gbp.repository.asset.VehicleUsageEmployeeRepository
import com.backend.gbp.repository.asset.VehicleUsageExpenseRepository
import com.backend.gbp.repository.asset.VehicleUsageRepository
import com.backend.gbp.security.SecurityUtils
import groovy.transform.Canonical
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.stereotype.Component

import javax.transaction.Transactional

@Canonical
class AssetDashboardSummary {
    @GraphQLQuery
    BigDecimal totalExpenses

    @GraphQLQuery
    BigDecimal totalLaborCost

    @GraphQLQuery
    BigDecimal totalRentalFee

    @GraphQLQuery
    BigDecimal grossRentalSales

    @GraphQLQuery
    BigDecimal netSales
}

@Component
@GraphQLApi
@TypeChecked
class VehicleUsageMonitoringService extends AbstractDaoService<VehicleUsageMonitoring> {
    VehicleUsageMonitoringService() {
        super(VehicleUsageMonitoring.class)
    }

    @Autowired
    VehicleUsageRepository vehicleUsageRepository

    @Autowired
    VehicleUsageExpenseService vehicleUsageExpenseService

    @Autowired
    VehicleUsageExpenseRepository vehicleUsageExpenseRepository

    @Autowired
    VehicleUsageEmployeeRepository vehicleUsageEmployeeRepository

    @Autowired
    AssetsRepository assetsRepository

    @GraphQLMutation(name = "upsertVehicleUsageMonitoring")
    @Transactional
    VehicleUsageMonitoring upserVehicleUsageMonitoring(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "id") UUID id
    ){
        UUID company = SecurityUtils.currentCompanyId()
        VehicleUsageMonitoring project

        if (id) {
            project = vehicleUsageRepository.findByIdAndCompany(id, company)
                    .orElseThrow { new IllegalArgumentException("Vehicle usage was not found.") }
            updateFromMap(project, fields)
            validateCompanyAssociations(project, company)
            project.company = company
            project = save(project)
        } else {
            project = upsertFromMap(id, fields, { VehicleUsageMonitoring entity, boolean forInsert ->
                validateCompanyAssociations(entity, company)
                entity.company = company
            })
        }

        return project
    }

    @GraphQLMutation(name = "upsertVehicleUsageWithExpenses")
    @Transactional
    VehicleUsageMonitoring upsertVehicleUsageWithExpenses(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "expenses") List<Map<String, Object>> expenses,
            @GraphQLArgument(name = "expensesToDelete") List<UUID> expensesToDelete
    ) {
        VehicleUsageMonitoring usage = upserVehicleUsageMonitoring(fields, id)
        vehicleUsageExpenseService.upsertVehicleUsageExpenses(usage.id, expenses, expensesToDelete)
        usage
    }

    private static void validateCompanyAssociations(VehicleUsageMonitoring usage, UUID company) {
        if (usage.asset != null && usage.asset.company != company) {
            throw new IllegalArgumentException("The selected asset was not found.")
        }
        if (usage.item != null && usage.item.company != company) {
            throw new IllegalArgumentException("The selected item was not found.")
        }
        if (usage.project != null && usage.project.company != company) {
            throw new IllegalArgumentException("The selected project was not found.")
        }
        if (usage.rentalBasis != null && usage.rentalBasis.company != company) {
            throw new IllegalArgumentException("The selected rental basis was not found.")
        }
    }

    @GraphQLQuery(name = "assetDashboardSummary")
    AssetDashboardSummary assetDashboardSummary(
            @GraphQLArgument(name = "asset") UUID asset
    ) {
        UUID company = SecurityUtils.currentCompanyId()
        if (asset == null || company == null) {
            return emptyDashboardSummary()
        }

        assetsRepository.findByIdAndCompany(asset, company)
                .orElseThrow { new IllegalArgumentException("Asset was not found.") }

        BigDecimal totalExpenses = vehicleUsageExpenseRepository
                .sumAmountByAssetAndCompany(asset, company) ?: BigDecimal.ZERO
        BigDecimal totalLaborCost = vehicleUsageEmployeeRepository
                .sumLaborCostByAssetAndCompany(asset, company) ?: BigDecimal.ZERO
        BigDecimal totalRentalFee = vehicleUsageRepository
                .sumCalculatedRentalFeeByAssetAndCompany(asset, company) ?: BigDecimal.ZERO

        // The calculated rental fee is the recorded gross sale for each asset usage.
        BigDecimal grossRentalSales = totalRentalFee
        BigDecimal netSales = grossRentalSales.subtract(totalExpenses).subtract(totalLaborCost)

        new AssetDashboardSummary(
                totalExpenses,
                totalLaborCost,
                totalRentalFee,
                grossRentalSales,
                netSales
        )
    }

    private static AssetDashboardSummary emptyDashboardSummary() {
        new AssetDashboardSummary(
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                BigDecimal.ZERO
        )
    }

    @GraphQLQuery(name = "vehicleUsageMonitoringPageable")
    Page<VehicleUsageMonitoring> vehicleUsageMonitoringListPageable(
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size,
            @GraphQLArgument(name = "asset") UUID asset
    ) {

        String query = '''Select p from VehicleUsageMonitoring p where p.asset.id = :asset AND
						lower(concat(p.usagePurpose,p.route)) like lower(concat('%',:filter,'%'))'''

        String countQuery = '''Select count(p) from VehicleUsageMonitoring p where p.asset.id = :asset AND
							lower(concat(p.usagePurpose,p.route)) like lower(concat('%',:filter,'%'))'''

        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)
        params.put('asset', asset)

        query += ''' ORDER BY p.startDatetime DESC'''

        Page<VehicleUsageMonitoring> result = getPageable(query, countQuery, page, size, params)
        return result
    }


    @GraphQLQuery(name = "vehicleUsageMonitoringProjectPageable")
    Page<VehicleUsageMonitoring> vehicleUsageMonitoringListProjectPageable(
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size,
            @GraphQLArgument(name = "project") UUID project
    ) {

        String query = '''Select p from VehicleUsageMonitoring p where p.project.id = :project AND
						lower(concat(p.usagePurpose,p.route)) like lower(concat('%',:filter,'%'))'''

        String countQuery = '''Select count(p) from VehicleUsageMonitoring p where p.project.id = :project AND
							lower(concat(p.usagePurpose,p.route)) like lower(concat('%',:filter,'%'))'''

        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)
        params.put('project', project)

        query += ''' ORDER BY p.startDatetime DESC'''

        Page<VehicleUsageMonitoring> result = getPageable(query, countQuery, page, size, params)
        return result
    }

    @GraphQLQuery(name = "vehicleUsageMonitoringLatest")
    VehicleUsageMonitoring vehicleUsageMonitoringLatest(
            @GraphQLArgument(name = "asset") UUID asset
    ) {

        List<VehicleUsageMonitoring> vehList = vehicleUsageRepository.findByAsset(asset);

        VehicleUsageMonitoring result = vehList[0]
        return result
    }

    @GraphQLQuery(name = "vehicleUsageMonitoringProjectLatest")
    VehicleUsageMonitoring vehicleUsageMonitoringProjectLatest(
            @GraphQLArgument(name = "project") UUID project
    ) {

        List<VehicleUsageMonitoring> vehList = vehicleUsageRepository.findByAsset(project);

        VehicleUsageMonitoring result = vehList[0]
        return result
    }
}
