package com.backend.gbp.rest.accounting

import com.backend.gbp.graphqlservices.accounting.GeneralLedgerServices
import com.backend.gbp.security.SecurityUtils
import org.apache.commons.csv.CSVFormat
import org.apache.commons.csv.CSVPrinter
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.util.LinkedMultiValueMap
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

import java.util.concurrent.Callable

@RestController
@RequestMapping("/general-ledger-reports")
class GeneralLedgerReportsResource {

	@Autowired
	GeneralLedgerServices generalLedgerServices

	@RequestMapping(method = RequestMethod.GET, value = "/summary")
	Callable<ResponseEntity<byte[]>> csvDownloadsGeneralLedgerSummary(
			@RequestParam String startDate,
			@RequestParam String endDate,
			@RequestParam List<String> accounts
	) {
		return new Callable<ResponseEntity<byte[]>>() {
			@Override
			ResponseEntity<byte[]> call() throws Exception {
				def content = generalLedgerServices.generateGeneralLedgerSummary(accounts,startDate,endDate)
				StringBuffer buffer = new StringBuffer()

				CSVPrinter csvPrinter = new CSVPrinter(buffer, CSVFormat.POSTGRESQL_CSV.withHeader(SecurityUtils.currentCompany().companyName))
				csvPrinter.printRecord('GENERAL LEDGER REPORT')
				csvPrinter.printRecord('')

				csvPrinter.printRecord('Code', 'Account', 'Debit','Credit','Net Movement')

				BigDecimal totalDebit = 0.00
				BigDecimal totalCredit = 0.00
				BigDecimal totalNetAmount = 0.00

				content.each {
					String code = it.code as String
					String accountName = it.accountName as String
					BigDecimal debit =  it.debit
					BigDecimal credit =  it.credit
					BigDecimal netAmount =  it.netAmount
					totalDebit += debit
					totalCredit += credit
					totalNetAmount += netAmount
					csvPrinter.printRecord(code,accountName,debit,credit,netAmount)
				}
				csvPrinter.printRecord('TOTAL','',totalDebit,totalCredit,totalNetAmount)

				LinkedMultiValueMap<String, String> extHeaders = new LinkedMultiValueMap<>()
				extHeaders.add("Content-Disposition",
						"attachment;filename=general-ledger-summary-${startDate}-${endDate}.csv".toString())
				return new ResponseEntity(buffer.toString().getBytes(), extHeaders, HttpStatus.OK)
			}
		}
	}


	@RequestMapping(method = RequestMethod.GET, value = "/summary-details")
	Callable<ResponseEntity<byte[]>> csvDownloadsGeneralLedgerSummaryDetails(
			@RequestParam String startDate,
			@RequestParam String endDate,
			@RequestParam String account
	) {
		return new Callable<ResponseEntity<byte[]>>() {
			@Override
			ResponseEntity<byte[]> call() throws Exception {
				def content = generalLedgerServices.generateGeneralLedgerDetailedSummary(account,startDate,endDate)
				StringBuffer buffer = new StringBuffer()

				CSVPrinter csvPrinter = new CSVPrinter(buffer, CSVFormat.POSTGRESQL_CSV.withHeader(SecurityUtils.currentCompany().companyName))
				csvPrinter.printRecord('GENERAL LEDGER SUMMARY DETAILS REPORT')
				csvPrinter.printRecord('')

				csvPrinter.printRecord('Code', 'Account', 'Debit','Credit','Net Movement')

				BigDecimal totalDebit = 0.00
				BigDecimal totalCredit = 0.00
				BigDecimal totalNetAmount = 0.00

				content.each {
					String code = it.code as String
					String accountName = it.accountName as String
					BigDecimal debit =  it.debit
					BigDecimal credit =  it.credit
					BigDecimal netAmount =  it.netAmount
					totalDebit += debit
					totalCredit += credit
					totalNetAmount += netAmount
					csvPrinter.printRecord(code,accountName,debit,credit,netAmount)
				}
				csvPrinter.printRecord('TOTAL','',totalDebit,totalCredit,totalNetAmount)

				LinkedMultiValueMap<String, String> extHeaders = new LinkedMultiValueMap<>()
				extHeaders.add("Content-Disposition",
						"attachment;filename=general-ledger-summary-details-${startDate}-${endDate}.csv".toString())
				return new ResponseEntity(buffer.toString().getBytes(), extHeaders, HttpStatus.OK)
			}
		}
	}

	@RequestMapping(method = RequestMethod.GET, value = "/ledger-details")
	Callable<ResponseEntity<byte[]>> csvDownloadsGeneralLedgerLedgerDetails(
			@RequestParam String startDate,
			@RequestParam String endDate,
			@RequestParam String account
	) {
		return new Callable<ResponseEntity<byte[]>>() {
			@Override
			ResponseEntity<byte[]> call() throws Exception {
				def content = generalLedgerServices.generateGeneralLedgerDetails('',account,startDate,endDate)
				StringBuffer buffer = new StringBuffer()

				CSVPrinter csvPrinter = new CSVPrinter(buffer, CSVFormat.POSTGRESQL_CSV.withHeader(SecurityUtils.currentCompany().companyName))
				csvPrinter.printRecord('GENERAL LEDGER REPORT')
				csvPrinter.printRecord('')
				csvPrinter.printRecord('Date','Entity Name', 'Description', 'Transaction No', 'Transaction Type', 'Reference No', 'Reference Type', 'Debit','Credit','Running Balance')

				BigDecimal totalDebit = 0.00
				BigDecimal totalCredit = 0.00
				BigDecimal totalRunningBalance = 0.00

				content.each {
					String code = it.code as String
					String accountName = it.account as String
					csvPrinter.printRecord(code,accountName)

					it.content.each {
						jsn ->
						String date =  jsn['transaction_date']
						String entity =  jsn['entity']
						String description =  jsn['description']
						String transactionNo =  jsn['transactionNo']
						String transactionType =  jsn['transactionType']
						String referenceNo =  jsn['referenceNo']
						String referenceType =  jsn['referenceType']
//						String reference =  jsn['reference']
						BigDecimal debit =  jsn['debit']
						BigDecimal credit =  jsn['credit']
						BigDecimal runningBalance =  jsn['running_balance']
						totalDebit += debit
						totalCredit += credit
						totalRunningBalance += runningBalance
						csvPrinter.printRecord(date,entity,description,transactionNo,transactionType,referenceNo,referenceType,debit,credit,runningBalance)
					}
				}

				LinkedMultiValueMap<String, String> extHeaders = new LinkedMultiValueMap<>()
				extHeaders.add("Content-Disposition",
						"attachment;filename=general-ledger-ledger-details-${startDate}-${endDate}.csv".toString())
				return new ResponseEntity(buffer.toString().getBytes(), extHeaders, HttpStatus.OK)
			}
		}
	}
}
