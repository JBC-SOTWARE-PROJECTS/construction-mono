package com.backend.gbp.rest.accounting

import com.backend.gbp.domain.accounting.NormalSide
import com.backend.gbp.domain.accounting.ReportsLayoutItem
import com.backend.gbp.domain.accounting.SavedAccounts
import com.backend.gbp.graphqlservices.accounting.FinancialReportDto
import com.backend.gbp.graphqlservices.accounting.RemapDto
import com.backend.gbp.graphqlservices.accounting.ReportsLayoutItemServices
import com.backend.gbp.graphqlservices.accounting.ReportsLayoutServices
import com.backend.gbp.graphqlservices.accounting.SavedAccountsServices
import com.backend.gbp.security.SecurityUtils
import com.google.gson.Gson
import org.apache.commons.beanutils.BeanUtils
import org.apache.poi.ss.usermodel.*
import org.apache.poi.xssf.usermodel.XSSFWorkbook
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.concurrent.Callable

@RestController
@RequestMapping('accounting/reports/financial-report/')
class FinancialReportResource {


    @Autowired
    SavedAccountsServices savedAccountsServices

    @Autowired
    ReportsLayoutItemServices reportsLayoutItemServices

    @Autowired
    ReportsLayoutServices reportsLayoutServices

    static String replaceSpecialCharToUnderScore(String text){
       return  text.replaceAll(/[\s,()-]+/, '_')
    }

    static def mapAmount (BigDecimal amount, String normalSide){
        if (normalSide == 'DEBIT') {
            return amount
        } else {
            if (amount < 0) return amount.abs()
            return amount.negate()
        }
    }


    RemapDto remapReportExtract(List<ReportsLayoutItem> data, Map<String, SavedAccounts> accountsMapped, Sheet sheet,
                                CellStyle groupTitleFont, CellStyle cellTitleFont, CellStyle totalTitleFont, CellStyle formulaStyle, Integer startingRow, Integer startingCol, Integer currentCol, short numberFormat, Boolean isHide = false, Boolean isChild = false) {
        RemapDto remapDto = new RemapDto()
        remapDto.mapTotal = [:]
        remapDto.list = []
        remapDto.total = 0.00
        remapDto.order = startingRow
        remapDto.col = currentCol

        data.findAll {
            isChild ? it.reportLayoutItemsParent != null : it.reportLayoutItemsParent == null
        }.sort {it.createdDate}.eachWithIndex { node, index ->
            def newNode = new FinancialReportDto(
                    order: index,
                    id: node.id,
                    title: node?.account?.accountName ?: node.title,
                    normalSide: node?.normalSide,
                    isGroup: node?.isGroup,
                    isChild: node?.account ? true : false,
                    isFormula: node?.isFormula,
            )

            if(newNode.isGroup && !node.config.hideGroupAccounts){
                // Create the headers
                remapDto.order = remapDto.order + 1
                Row headerRow = sheet.createRow(remapDto.order);
                Cell headerCell = headerRow.createCell(remapDto.col+0);
                headerCell.setCellValue(newNode.title);
                headerCell.setCellStyle(groupTitleFont);

                Integer columnsLeft = startingCol+2-remapDto.col
                for (Integer i = 1; i < columnsLeft; i++) {
                    Cell headerCell4 = headerRow.createCell(remapDto.col+i);
                    headerCell4.setCellStyle(groupTitleFont);
                }
            }

            if(node?.account){
                String normalSide = NormalSide.DEBIT.name()
                if(node.reportLayoutItemsParent){
                    if(node.reportLayoutItemsParent.normalSide.name() != accountsMapped[node?.account?.code]?.normalSide)
                        normalSide = node.reportLayoutItemsParent.normalSide.name()
                }
                newNode.amount =  mapAmount(accountsMapped[node?.account?.code]?.balance ?: 0.00,normalSide)
                remapDto.total += newNode.amount

                if(!isHide) {
                    remapDto.order = remapDto.order + 1
                    Row dataRow = sheet.createRow(remapDto.order);
                    Cell categoryCell = dataRow.createCell(startingCol);
                    categoryCell.setCellValue(newNode.title);
                    categoryCell.setCellStyle(cellTitleFont);

                    Cell amountCell = dataRow.createCell(startingCol + 1);
                    amountCell.setCellValue(newNode.amount);
                    amountCell.setCellStyle(cellTitleFont);
                    def amountCellStyle = amountCell.getCellStyle()
                    amountCellStyle.setDataFormat(numberFormat)
                }
            }

            def children = []

            if (node.reportsChild) {
                def remap = remapReportExtract(node.reportsChild, accountsMapped,sheet, groupTitleFont, cellTitleFont, totalTitleFont, formulaStyle, remapDto.order,startingCol,remapDto.col+1,numberFormat,node?.config?.hideGroupAccounts,true)
                remapDto.order = remap.order

                children = remap.list

                remapDto.order = remapDto.order + 1
                Row totalRow = sheet.createRow(remapDto.order);

                if(node.config.hideGroupAccounts){
                    Cell totalCell = totalRow.createCell(startingCol);
                    totalCell.setCellValue(node.title);
                    totalCell.setCellStyle(cellTitleFont);

                    Cell amountCell = totalRow.createCell(startingCol + 1);
                    amountCell.setCellValue(remap.total);
                    amountCell.setCellStyle(cellTitleFont);
                    def amountCellStyle = amountCell.getCellStyle()
                    amountCellStyle.setDataFormat(numberFormat)
                }else{
                    Cell totalCell = totalRow.createCell(remapDto.col);
                    totalCell.setCellValue(node.title);
                    totalCell.setCellStyle(cellTitleFont);
                    totalCell.setCellValue(node?.config?.totalLabel ?: "Total ${node.title}");
                    totalCell.setCellStyle(totalTitleFont);
                    Integer totalColumnsLeft = startingCol+2-remapDto.col
                    for (Integer i = 1; i < totalColumnsLeft; i++) {
                        if(i==totalColumnsLeft-1){
                            Cell totalCell3 = totalRow.createCell(remapDto.col+i);
                            totalCell3.setCellValue(remap.total);
                            totalCell3.setCellStyle(totalTitleFont);
                            def totalAmountCellStyle = totalCell3.getCellStyle()
                            totalAmountCellStyle.setDataFormat(numberFormat)
                        }
                        else {
                            Cell totalCell2 = totalRow.createCell(remapDto.col+i);
                            totalCell2.setCellStyle(totalTitleFont);
                        }
                    }
                }

                remapDto.mapTotal[node.id] = new FinancialReportDto(
                        id: node.id,
                        title: node?.account?.accountName ?: node.title,
                        normalSide: node?.normalSide,
                        amount: remap.total,
                )

                if(node.isGroup){
                    remapDto.total += remap.total
                }
            }

            newNode.rows = new Gson().toJson(children)

            if(node.isFormula){
                BigDecimal amount = 0.00
                node.formulaGroups.eachWithIndex{
                    operands, opIndex ->
                        FinancialReportDto finOperand = remapDto.mapTotal[UUID.fromString(operands)]
                        BigDecimal operandAmount = finOperand?.amount ?: 0.00
                        if(node.itemType.equalsIgnoreCase('+')){
                            amount += operandAmount
                        }
                        if(node.itemType.equalsIgnoreCase('-')){
                            if(opIndex == 0)
                                amount = operandAmount
                            else
                                amount -= operandAmount
                        }
                }
                newNode.amount = amount

                remapDto.mapTotal[node.id] = new FinancialReportDto(
                        id: node.id,
                        title: node.title,
                        normalSide: 'DEBIT',
                        amount: amount
                )

                remapDto.order = remapDto.order + 1
                Row totalRow = sheet.createRow(remapDto.order);
                Cell totalCell = totalRow.createCell(remapDto.col+0);
                totalCell.setCellValue(node.title);
                totalCell.setCellStyle(formulaStyle);

                Integer totalColumnsLeft = startingCol+2-remapDto.col
                for (Integer i = 1; i < totalColumnsLeft; i++) {
                    if(i==totalColumnsLeft-1){
                        Cell totalCell3 = totalRow.createCell(remapDto.col+i);
                        totalCell3.setCellValue(amount);
                        totalCell3.setCellStyle(formulaStyle);
                        def totalAmountCellStyle = totalCell3.getCellStyle()
                        totalAmountCellStyle.setDataFormat(numberFormat)
                    }
                    else {
                        Cell totalCell2 = totalRow.createCell(remapDto.col+i);
                        totalCell2.setCellStyle(formulaStyle);
                    }
                }
                // MARGIN BOTTOM
                remapDto.order = remapDto.order + 1
                sheet.createRow(remapDto.order);
            }

            if(newNode.isGroup && startingRow == 5){
                // MARGIN BOTTOM FOR MAIN GROUPS
                remapDto.order = remapDto.order + 1
                sheet.createRow(remapDto.order)
            }

            if(isHide) {
                remapDto.list << newNode
            }
        }
        return remapDto
    }

    @RequestMapping(method = RequestMethod.GET, value = "/profitandloss")
    Callable<ResponseEntity<byte[]>> profitAndLoss(
            @RequestParam String reportLayoutId,
            @RequestParam String start,
            @RequestParam String end
    ) {
        return new Callable<ResponseEntity<byte[]>>() {
            @Override
            ResponseEntity<byte[]> call() throws Exception {
                def reportLayout = reportsLayoutServices.findOne(UUID.fromString(reportLayoutId))
                if (!reportLayout)
                    return []
                def reportLayoutMainGroup = reportsLayoutItemServices.getReportItemsByReportType(reportLayout.id)
                if (!reportLayoutMainGroup)
                    return []

                def trialBalance = savedAccountsServices.getSaveAccountsMother(start, end)
                Map<String, SavedAccounts> accountsMapped = [:]
                trialBalance.each {
                    tb ->
                        // update this to tb.code later on
                        accountsMapped[tb.account] = tb
                }

                Workbook workbook = new XSSFWorkbook();

                Sheet sheet = workbook.createSheet("Financial Report");
                sheet.setDisplayGridlines(false)


                // Create a Font for bold text
                def headerCellBFont = workbook.createFont()
                short headerFont = 10
                headerCellBFont.setFontHeightInPoints(headerFont)
                headerCellBFont.setFontName("Arial")
                headerCellBFont.setBold(true);
                CellStyle groupTitleFont = workbook.createCellStyle();
                groupTitleFont.setFont(headerCellBFont);
                groupTitleFont.setBorderBottom(BorderStyle.THIN);
                groupTitleFont.setBottomBorderColor(IndexedColors.BLACK.getIndex());

                // Create a CellStyle for text with light grey bottom border
                def cellBFont = workbook.createFont()
                short font = 9
                cellBFont.setFontHeightInPoints(font)
                cellBFont.setFontName("Arial")
                CellStyle cellTitleFont = workbook.createCellStyle();
                cellTitleFont.setBorderBottom(BorderStyle.THIN);
                cellTitleFont.setBottomBorderColor(IndexedColors.GREY_25_PERCENT.getIndex());
                cellTitleFont.setFont(cellBFont)

                def totalCellBFont = workbook.createFont()
                short totalFont = 10
                totalCellBFont.setFontHeightInPoints(totalFont)
                totalCellBFont.setFontName("Arial")
                totalCellBFont.setBold(true);
                CellStyle totalTitleFont = workbook.createCellStyle();
                totalTitleFont.setFont(totalCellBFont);

                def formulaCellBFont = workbook.createFont()
                short formulaFont = 10
                formulaCellBFont.setFontHeightInPoints(formulaFont)
                formulaCellBFont.setFontName("Arial")
                formulaCellBFont.setBold(true);
                formulaCellBFont.setColor(IndexedColors.WHITE.getIndex())
                CellStyle formulaStyle = workbook.createCellStyle();
                formulaStyle.setFont(formulaCellBFont);
                formulaStyle.setBorderBottom(BorderStyle.THIN);
                formulaStyle.setBottomBorderColor(IndexedColors.BLACK.getIndex());
                formulaStyle.setBorderTop(BorderStyle.THIN);
                formulaStyle.setTopBorderColor(IndexedColors.BLACK.getIndex());
                formulaStyle.setFillForegroundColor(IndexedColors.TEAL.getIndex()); // You can change the color
                formulaStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

                def numberFormat = workbook.createDataFormat().getFormat("#,##0.00;(#,##0.00)")

                def titleCellBFont = workbook.createFont()
                short titleFont = 14
                titleCellBFont.setFontHeightInPoints(titleFont)
                titleCellBFont.setFontName("Arial")
                titleCellBFont.setBold(true);
                titleCellBFont.setColor(IndexedColors.TEAL.getIndex())
                CellStyle reportTitleFont = workbook.createCellStyle();
                reportTitleFont.setFont(titleCellBFont);

                Row headerRow = sheet.createRow(0);
                Cell headerCell = headerRow.createCell(0);
                headerCell.setCellValue('Profit and Loss');
                headerCell.setCellStyle(reportTitleFont);

                def subTitleCellBFont = workbook.createFont()
                short subTitleFont = 12
                subTitleCellBFont.setFontHeightInPoints(subTitleFont)
                subTitleCellBFont.setFontName("Arial")
                subTitleCellBFont.setBold(false);
                subTitleCellBFont.setColor(IndexedColors.TEAL.getIndex())
                CellStyle reportSubTitleFont = workbook.createCellStyle();
                reportSubTitleFont.setFont(subTitleCellBFont);

                def company = SecurityUtils.currentCompany()
                Row hospitalName = sheet.createRow(1);
                Cell hospitalNameCell = hospitalName.createCell(0);
                hospitalNameCell.setCellValue(company.companyName);
                hospitalNameCell.setCellStyle(reportSubTitleFont);

                Integer maximumChild = reportLayout?.config?.maximumChild + 1

                Row tableHeaderName = sheet.createRow(3);


                for (Integer i = 0; i < maximumChild; i++) {
                    Cell tableHeaderBlankCell = tableHeaderName.createCell(i);
                    tableHeaderBlankCell.setCellStyle(groupTitleFont);
                    if(i==maximumChild-1){
                        Cell tableHeaderNameCell = tableHeaderName.createCell(i+1);
                        tableHeaderNameCell.setCellValue('Account');
                        tableHeaderNameCell.setCellStyle(groupTitleFont);

                        DateTimeFormatter dayFormat = DateTimeFormatter.ofPattern("yyyy-MM-dd")
                        DateTimeFormatter yearFormat = DateTimeFormatter.ofPattern("yyyy")
                        DateTimeFormatter monthFormat = DateTimeFormatter.ofPattern("MMM")
                        DateTimeFormatter monthYearFormat = DateTimeFormatter.ofPattern("MMM yyyy")

                        String amountLabel = ""
                        LocalDate startDate = LocalDate.parse(start, dayFormat);
                        LocalDate endDate = LocalDate.parse(end, dayFormat);

                        String startYear = startDate.format(yearFormat);
                        String endYear = endDate.format(yearFormat);

                        String startMonth = startDate.format(monthFormat);
                        String endMonth = endDate.format(monthFormat);

                        String startMonthYear = startDate.format(monthYearFormat);
                        String endMonthYear = endDate.format(monthYearFormat);

                        if(startYear != endYear){
                            amountLabel = "${startMonthYear} - ${endMonthYear}"
                        }else {
                            if(startMonth == endMonth){
                                amountLabel = startMonthYear
                            }
                            else {
                                amountLabel = "${startMonth} - ${endMonthYear}"
                            }
                        }

                        Cell amountTableHeaderNameCell = tableHeaderName.createCell(i+2);
                        amountTableHeaderNameCell.setCellValue(amountLabel);
                        amountTableHeaderNameCell.setCellStyle(groupTitleFont);
                    }
                }




                remapProfitAndLoss(reportLayoutMainGroup, accountsMapped, sheet, groupTitleFont, cellTitleFont, totalTitleFont, formulaStyle,4, maximumChild,0,numberFormat, false)

                for (Integer i = 0; i < maximumChild; i++) {
                    sheet.setColumnWidth(i, 4 * 256)
                    if(i==maximumChild-1){
                        sheet.autoSizeColumn(i+1)
                        sheet.autoSizeColumn(i+2)
                    }
                }


                // Write the workbook to a ByteArrayOutputStream
                ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
                workbook.write(outputStream);
                outputStream.close();

                // Set the response headers
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
                headers.setContentDispositionFormData("attachment", "financial_report.xlsx");

                // Return the Excel file as a response
                return new ResponseEntity<>(outputStream.toByteArray(), headers, HttpStatus.OK);
            }
        }
    }


    @RequestMapping(method = RequestMethod.GET, value = "/reportExtract")
    Callable<ResponseEntity<byte[]>> reportExtract(
            @RequestParam String reportLayoutId,
            @RequestParam String durationType,
            @RequestParam String end
    ) {
        return new Callable<ResponseEntity<byte[]>>() {
            @Override
            ResponseEntity<byte[]> call() throws Exception {
                def reportLayout = reportsLayoutServices.findOne(UUID.fromString(reportLayoutId))
                if (!reportLayout)
                    return []
                def reportLayoutMainGroup = reportsLayoutItemServices.getReportItemsByReportId(reportLayout.id)
                if (!reportLayoutMainGroup)
                    return []

                def reportData = []
                if(durationType.equalsIgnoreCase('MONTH')) {
                    reportData = savedAccountsServices.saveAccountSummaryMonth(end)
                }
                else {
                    reportData = savedAccountsServices.saveAccountSummary(end)
                }
                Map<String, SavedAccounts> accountsMapped = [:]
                reportData.each {
                    tb ->
                        // update this to tb.code later on
                    if(accountsMapped["${tb.motherCode}-0000-0000"]){
                        accountsMapped["${tb.motherCode}-0000-0000"].debit += tb.debit
                        accountsMapped["${tb.motherCode}-0000-0000"].credit += tb.credit
                        accountsMapped["${tb.motherCode}-0000-0000"].balance += tb.balance
                    }
                    else {
                        def mother = new SavedAccounts()
                        BeanUtils.copyProperties(mother, tb);
                        mother.id = null
                        mother.subCode = null
                        mother.subAccount = null
                        accountsMapped["${tb.motherCode}-0000-0000"] = mother
                    }

                    if(tb.subCode) {
                        if (accountsMapped["${tb.motherCode}-${tb.subCode}-0000"]) {
                            accountsMapped["${tb.motherCode}-${tb.subCode}-0000"].debit += tb.debit
                            accountsMapped["${tb.motherCode}-${tb.subCode}-0000"].credit += tb.credit
                            accountsMapped["${tb.motherCode}-${tb.subCode}-0000"].balance += tb.balance
                        } else {
                            def sub = new SavedAccounts()
                            BeanUtils.copyProperties(sub, tb);
                            sub.id = null
                            sub.subSubCode = null
                            sub.subSubAccount = null
                            accountsMapped["${tb.motherCode}-${tb.subCode}-0000"] = sub
                        }
                    }

                    accountsMapped[tb.code] = tb
                }

                Workbook workbook = new XSSFWorkbook();

                Sheet sheet = workbook.createSheet("Financial Report");
                sheet.setDisplayGridlines(false)


                // Create a Font for bold text
                def headerCellBFont = workbook.createFont()
                short headerFont = 10
                headerCellBFont.setFontHeightInPoints(headerFont)
                headerCellBFont.setFontName("Arial")
                headerCellBFont.setBold(true);
                CellStyle groupTitleFont = workbook.createCellStyle();
                groupTitleFont.setFont(headerCellBFont);
                groupTitleFont.setBorderBottom(BorderStyle.THIN);
                groupTitleFont.setBottomBorderColor(IndexedColors.BLACK.getIndex());

                // Create a CellStyle for text with light grey bottom border
                def cellBFont = workbook.createFont()
                short font = 9
                cellBFont.setFontHeightInPoints(font)
                cellBFont.setFontName("Arial")
                CellStyle cellTitleFont = workbook.createCellStyle();
                cellTitleFont.setBorderBottom(BorderStyle.THIN);
                cellTitleFont.setBottomBorderColor(IndexedColors.GREY_25_PERCENT.getIndex());
                cellTitleFont.setFont(cellBFont)

                def totalCellBFont = workbook.createFont()
                short totalFont = 10
                totalCellBFont.setFontHeightInPoints(totalFont)
                totalCellBFont.setFontName("Arial")
                totalCellBFont.setBold(true);
                CellStyle totalTitleFont = workbook.createCellStyle();
                totalTitleFont.setFont(totalCellBFont);

                def formulaCellBFont = workbook.createFont()
                short formulaFont = 10
                formulaCellBFont.setFontHeightInPoints(formulaFont)
                formulaCellBFont.setFontName("Arial")
                formulaCellBFont.setBold(true);
                formulaCellBFont.setColor(IndexedColors.WHITE.getIndex())
                CellStyle formulaStyle = workbook.createCellStyle();
                formulaStyle.setFont(formulaCellBFont);
                formulaStyle.setBorderBottom(BorderStyle.THIN);
                formulaStyle.setBottomBorderColor(IndexedColors.BLACK.getIndex());
                formulaStyle.setBorderTop(BorderStyle.THIN);
                formulaStyle.setTopBorderColor(IndexedColors.BLACK.getIndex());
                formulaStyle.setFillForegroundColor(IndexedColors.TEAL.getIndex()); // You can change the color
                formulaStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

                def numberFormat = workbook.createDataFormat().getFormat("#,##0.00;(#,##0.00)")

                def titleCellBFont = workbook.createFont()
                short titleFont = 14
                titleCellBFont.setFontHeightInPoints(titleFont)
                titleCellBFont.setFontName("Arial")
                titleCellBFont.setBold(true);
                titleCellBFont.setColor(IndexedColors.TEAL.getIndex())
                CellStyle reportTitleFont = workbook.createCellStyle();
                reportTitleFont.setFont(titleCellBFont);

                Row headerRow = sheet.createRow(0);
                Cell headerCell = headerRow.createCell(0);
                headerCell.setCellValue(reportLayout.title);
                headerCell.setCellStyle(reportTitleFont);

                def subTitleCellBFont = workbook.createFont()
                short subTitleFont = 12
                subTitleCellBFont.setFontHeightInPoints(subTitleFont)
                subTitleCellBFont.setFontName("Arial")
                subTitleCellBFont.setBold(false);
                subTitleCellBFont.setColor(IndexedColors.TEAL.getIndex())
                CellStyle reportSubTitleFont = workbook.createCellStyle();
                reportSubTitleFont.setFont(subTitleCellBFont);

                def company = SecurityUtils.currentCompany()
                Row hospitalName = sheet.createRow(1);
                Cell hospitalNameCell = hospitalName.createCell(0);
                hospitalNameCell.setCellValue(company.companyName);
                hospitalNameCell.setCellStyle(reportSubTitleFont);

                DateTimeFormatter dayFormat = DateTimeFormatter.ofPattern("yyyy-MM-dd")
                DateTimeFormatter monthYearFormat = DateTimeFormatter.ofPattern("dd MMM yyyy")

                LocalDate endDate = LocalDate.parse(end, dayFormat);
                String endMonthYear = endDate.format(monthYearFormat);

                Row dateSummary = sheet.createRow(2);
                Cell dateSummaryCell = dateSummary.createCell(0);
                dateSummaryCell.setCellValue("As at ${endMonthYear}");
                dateSummaryCell.setCellStyle(reportSubTitleFont);

                CellStyle dateSummaryFont = workbook.createCellStyle();
                dateSummaryFont.setBorderBottom(BorderStyle.THIN);
                dateSummaryFont.setBottomBorderColor(IndexedColors.BLACK.getIndex());
                dateSummaryFont.setFont(headerCellBFont)
                dateSummaryFont.setAlignment(HorizontalAlignment.RIGHT);


                Integer maximumChild = (reportLayout?.config?.maximumChild?:0) + 1

                Row tableHeaderName = sheet.createRow(4);




                for (Integer i = 0; i < maximumChild; i++) {
                    Cell tableHeaderBlankCell = tableHeaderName.createCell(i);
                    tableHeaderBlankCell.setCellStyle(groupTitleFont);
                    if(i==maximumChild-1){
                        Cell tableHeaderNameCell = tableHeaderName.createCell(i+1);
                        tableHeaderNameCell.setCellValue('Account');
                        tableHeaderNameCell.setCellStyle(groupTitleFont);


                        String amountLabel = "${endMonthYear}"


                        Cell amountTableHeaderNameCell = tableHeaderName.createCell(i+2);
                        amountTableHeaderNameCell.setCellValue(amountLabel);
                        amountTableHeaderNameCell.setCellStyle(dateSummaryFont);
                    }
                }




                remapReportExtract(reportLayoutMainGroup, accountsMapped, sheet, groupTitleFont, cellTitleFont, totalTitleFont, formulaStyle,5, maximumChild,0,numberFormat,false, false)

                for (Integer i = 0; i < maximumChild; i++) {
                    sheet.setColumnWidth(i, 2 * 256)
                    if(i==maximumChild-1){
                        sheet.autoSizeColumn(i+1)
                        sheet.autoSizeColumn(i+2)
                    }
                }

                // Write the workbook to a ByteArrayOutputStream
                ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
                workbook.write(outputStream);
                outputStream.close();

                // Set the response headers
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
                headers.setContentDispositionFormData("attachment", "${replaceSpecialCharToUnderScore(company.companyName)}_${replaceSpecialCharToUnderScore(reportLayout.title)}.xlsx");

                // Return the Excel file as a response
                return new ResponseEntity<>(outputStream.toByteArray(), headers, HttpStatus.OK);
            }
        }
    }

}
