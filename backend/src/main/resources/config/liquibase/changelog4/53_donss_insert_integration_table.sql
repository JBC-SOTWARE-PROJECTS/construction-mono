INSERT INTO accounting.integration
(
    id,
    company_id,
    description,
    flag_property,
    flag_value,
    order_priority,
    created_by,
    created_date,
    last_modified_by,
    last_modified_date,
    deleted,
    "domain",
    integration_group
)
SELECT
    'e3d26e18-4a1e-4b35-ae1b-bb5e2cddf6cb'::uuid,
    '82295af0-928e-4c6a-a1a8-f6df2c0fdfd0'::uuid,
    'AR CREDIT NOTE',
    NULL,
    'AR_CREDIT_NOTE',
    0,
    'admin',
    '2023-11-22 13:01:27.116',
    'admin',
    '2023-11-22 13:01:27.116',
    NULL,
    'CREDIT_NOTE',
    'cfc60042-596d-47da-b02d-11d00968bbc3'::uuid
WHERE NOT EXISTS (
    SELECT 1 FROM accounting.integration WHERE id = 'e3d26e18-4a1e-4b35-ae1b-bb5e2cddf6cb'::uuid
);

INSERT INTO accounting.integration
(
    id,
    company_id,
    description,
    flag_property,
    flag_value,
    order_priority,
    created_by,
    created_date,
    last_modified_by,
    last_modified_date,
    deleted,
    "domain",
    integration_group
)
SELECT
    'b5338eaf-8ade-4cd4-a11c-f6c8092c854b'::uuid,
    '82295af0-928e-4c6a-a1a8-f6df2c0fdfd0'::uuid,
    'AR INVOICE',
    NULL,
    'AR_REGULAR_INVOICE',
    0,
    'admin',
    '2023-11-23 09:09:26.437',
    'admin',
    '2023-11-23 09:09:26.437',
    NULL,
    'INVOICE',
    'cfc60042-596d-47da-b02d-11d00968bbc3'::uuid
WHERE NOT EXISTS (
    SELECT 1 FROM accounting.integration WHERE id = 'b5338eaf-8ade-4cd4-a11c-f6c8092c854b'::uuid
);
INSERT INTO accounting.integration
(
    id,
    company_id,
    description,
    flag_property,
    flag_value,
    order_priority,
    created_by,
    created_date,
    last_modified_by,
    last_modified_date,
    deleted,
    "domain",
    integration_group
)
SELECT
    '105cd07c-3fbb-4888-ac87-427b01b654e9'::uuid,
    '82295af0-928e-4c6a-a1a8-f6df2c0fdfd0'::uuid,
    'AR CLIENTS PAYMENT',
    NULL,
    'AR_CLIENTS_PAYMENT',
    0,
    'admin',
    '2023-11-22 10:25:49.440',
    'admin',
    '2023-11-22 10:25:49.440',
    NULL,
    'PAYMENT',
    'cfc60042-596d-47da-b02d-11d00968bbc3'::uuid
WHERE NOT EXISTS (
    SELECT 1 FROM accounting.integration WHERE id = '105cd07c-3fbb-4888-ac87-427b01b654e9'::uuid
);



INSERT INTO accounting.integration_items
(
    id,
    integration,
    company_id,
    journal_account,
    disabled_property,
    disabled_value,
    value_property,
    created_by,
    created_date,
    last_modified_by,
    last_modified_date,
    deleted,
    source_column,
    multiple
)
SELECT
    '7eb26c75-6545-4001-8421-1527382e6468'::uuid,
    '105cd07c-3fbb-4888-ac87-427b01b654e9'::uuid,
    '82295af0-928e-4c6a-a1a8-f6df2c0fdfd0'::uuid,
    '{"code": "111-01-0000", "subAccount": {"id": "ace4ea7f-edea-4654-82a1-951a4e661753", "code": "01", "domain": "", "normalSide": null, "accountName": "CASH ON HAND", "accountType": null, "accountCategory": null}, "accountName": "CASH AND CASH EQUIVALENTS-CASH ON HAND", "motherAccount": {"id": "1a2cf00f-559b-40c5-90b4-0988b5c55d5b", "code": "111", "domain": "com.backend.gbp.domain.accounting.ParentAccount", "normalSide": "DEBIT", "accountName": "CASH AND CASH EQUIVALENTS", "accountType": null, "accountCategory": null}, "subSubAccount": {"id": null, "code": null, "domain": null, "normalSide": null, "accountName": null, "accountType": null, "accountCategory": null}, "subAccountName": "CASH ON HAND", "subAccountSetupId": "ace4ea7f-edea-4654-82a1-951a4e661753"}'::jsonb,
    NULL,
    NULL,
    NULL,
    'admin',
    '2023-11-22 10:26:22.492',
    'admin',
    '2023-11-22 10:26:41.057',
    NULL,
    'totalCash',
    NULL
WHERE NOT EXISTS (
    SELECT 1 FROM accounting.integration_items WHERE id = '7eb26c75-6545-4001-8421-1527382e6468'::uuid
);
INSERT INTO accounting.integration_items
(
    id,
    integration,
    company_id,
    journal_account,
    disabled_property,
    disabled_value,
    value_property,
    created_by,
    created_date,
    last_modified_by,
    last_modified_date,
    deleted,
    source_column,
    multiple
)
SELECT
    '188c1bf7-aecb-45ec-9f48-f3f2e5efc4e3'::uuid,
    '105cd07c-3fbb-4888-ac87-427b01b654e9'::uuid,
    '82295af0-928e-4c6a-a1a8-f6df2c0fdfd0'::uuid,
    '{"code": "111-03-0000", "subAccount": {"id": "ed108c49-3068-4059-9660-d099610edaae", "code": "03", "domain": "", "normalSide": null, "accountName": "CHECK ON HAND", "accountType": null, "accountCategory": null}, "accountName": "CASH AND CASH EQUIVALENTS-CHECK ON HAND", "motherAccount": {"id": "1a2cf00f-559b-40c5-90b4-0988b5c55d5b", "code": "111", "domain": "com.backend.gbp.domain.accounting.ParentAccount", "normalSide": "DEBIT", "accountName": "CASH AND CASH EQUIVALENTS", "accountType": null, "accountCategory": null}, "subSubAccount": {"id": null, "code": null, "domain": null, "normalSide": null, "accountName": null, "accountType": null, "accountCategory": null}, "subAccountName": "CHECK ON HAND", "subAccountSetupId": "ed108c49-3068-4059-9660-d099610edaae"}'::jsonb,
    NULL,
    NULL,
    NULL,
    'admin',
    '2023-11-22 10:28:44.466',
    'admin',
    '2023-11-22 10:28:53.681',
    NULL,
    'totalCheck',
    NULL
WHERE NOT EXISTS (
    SELECT 1 FROM accounting.integration_items WHERE id = '188c1bf7-aecb-45ec-9f48-f3f2e5efc4e3'::uuid
);

INSERT INTO accounting.integration_items
(
    id,
    integration,
    company_id,
    journal_account,
    disabled_property,
    disabled_value,
    value_property,
    created_by,
    created_date,
    last_modified_by,
    last_modified_date,
    deleted,
    source_column,
    multiple
)
SELECT
    '539f0a3b-25b7-4beb-a65d-bf7ac1b570c3'::uuid,
    '105cd07c-3fbb-4888-ac87-427b01b654e9'::uuid,
    '82295af0-928e-4c6a-a1a8-f6df2c0fdfd0'::uuid,
    '{"code": "111-02-####", "subAccount": {"id": "2729ba76-f729-4215-8d35-368cda65fa91", "code": "02", "domain": "", "normalSide": null, "accountName": "CASH IN BANK", "accountType": null, "accountCategory": null}, "accountName": "CASH AND CASH EQUIVALENTS-CASH IN BANK-CASH ON BANK - BANK", "motherAccount": {"id": "1a2cf00f-559b-40c5-90b4-0988b5c55d5b", "code": "111", "domain": "com.backend.gbp.domain.accounting.ParentAccount", "normalSide": "DEBIT", "accountName": "CASH AND CASH EQUIVALENTS", "accountType": null, "accountCategory": null}, "subSubAccount": {"id": "4f94f98e-10b9-4378-a778-3ab8f51616db", "code": "####", "domain": "com.backend.gbp.domain.accounting.Bank", "normalSide": null, "accountName": "CASH ON BANK - BANK", "accountType": null, "accountCategory": null}, "subAccountName": "CASH ON BANK - BANK", "subAccountSetupId": "96b2f3d7-9bb4-4239-ac10-8f0afb985520"}'::jsonb,
    NULL,
    NULL,
    NULL,
    'admin',
    '2023-11-22 10:29:06.105',
    'admin',
    '2023-11-22 10:29:40.522',
    NULL,
    'amountForCashDeposit',
    true
WHERE NOT EXISTS (
    SELECT 1 FROM accounting.integration_items WHERE id = '539f0a3b-25b7-4beb-a65d-bf7ac1b570c3'::uuid
);
INSERT INTO accounting.integration_items
(
    id,
    integration,
    company_id,
    journal_account,
    disabled_property,
    disabled_value,
    value_property,
    created_by,
    created_date,
    last_modified_by,
    last_modified_date,
    deleted,
    source_column,
    multiple
)
SELECT
    '0351e402-642a-4a02-b805-49995ad97545'::uuid,
    'e3d26e18-4a1e-4b35-ae1b-bb5e2cddf6cb'::uuid,
    '82295af0-928e-4c6a-a1a8-f6df2c0fdfd0'::uuid,
    '{"code": "216-01-0000", "subAccount": {"id": "95dae3d7-562e-4c42-affd-c860c665b212", "code": "01", "domain": "", "normalSide": null, "accountName": "WITHHOLDING TAX PAYABLE - CWT", "accountType": null, "accountCategory": null}, "accountName": "ACCRUED TAXES-WITHHOLDING TAX PAYABLE - CWT", "motherAccount": {"id": "70f899c1-2919-440c-a6d0-9c281b35fa6a", "code": "216", "domain": "com.backend.gbp.domain.accounting.ParentAccount", "normalSide": "CREDIT", "accountName": "ACCRUED TAXES", "accountType": null, "accountCategory": null}, "subSubAccount": {"id": null, "code": null, "domain": null, "normalSide": null, "accountName": null, "accountType": null, "accountCategory": null}, "subAccountName": "WITHHOLDING TAX PAYABLE - CWT", "subAccountSetupId": "95dae3d7-562e-4c42-affd-c860c665b212"}'::jsonb,
    NULL,
    NULL,
    NULL,
    'admin',
    '2023-11-23 06:49:17.005',
    'admin',
    '2023-11-23 06:49:44.900',
    NULL,
    'negativeVatAmount',
    NULL
WHERE NOT EXISTS (
    SELECT 1 FROM accounting.integration_items WHERE id = '0351e402-642a-4a02-b805-49995ad97545'::uuid
);

INSERT INTO accounting.integration_items
(
    id,
    integration,
    company_id,
    journal_account,
    disabled_property,
    disabled_value,
    value_property,
    created_by,
    created_date,
    last_modified_by,
    last_modified_date,
    deleted,
    source_column,
    multiple
)
SELECT
    '647a8025-0b94-4470-8393-b668f09fc7d8'::uuid,
    'e3d26e18-4a1e-4b35-ae1b-bb5e2cddf6cb'::uuid,
    '82295af0-928e-4c6a-a1a8-f6df2c0fdfd0'::uuid,
    '{"code": "216-99-0000", "subAccount": {"id": "52e8771c-a27a-44b8-8444-340de8ef4efb", "code": "99", "domain": "", "normalSide": null, "accountName": "OUTPUT VAT", "accountType": null, "accountCategory": null}, "accountName": "ACCRUED TAXES-OUTPUT VAT", "motherAccount": {"id": "70f899c1-2919-440c-a6d0-9c281b35fa6a", "code": "216", "domain": "com.backend.gbp.domain.accounting.ParentAccount", "normalSide": "CREDIT", "accountName": "ACCRUED TAXES", "accountType": null, "accountCategory": null}, "subSubAccount": {"id": null, "code": null, "domain": null, "normalSide": null, "accountName": null, "accountType": null, "accountCategory": null}, "subAccountName": "OUTPUT VAT", "subAccountSetupId": "52e8771c-a27a-44b8-8444-340de8ef4efb"}'::jsonb,
    NULL,
    NULL,
    NULL,
    'admin',
    '2023-11-23 06:49:29.826',
    'admin',
    '2023-11-23 06:49:56.188',
    NULL,
    'negativeCwtAmount',
    NULL
WHERE NOT EXISTS (
    SELECT 1 FROM accounting.integration_items WHERE id = '647a8025-0b94-4470-8393-b668f09fc7d8'::uuid
);

INSERT INTO accounting.integration_items
(
    id,
    integration,
    company_id,
    journal_account,
    disabled_property,
    disabled_value,
    value_property,
    created_by,
    created_date,
    last_modified_by,
    last_modified_date,
    deleted,
    source_column,
    multiple
)
SELECT
    'f5feb5d7-d309-4b3d-a4f9-a76698dfb904'::uuid,
    'b5338eaf-8ade-4cd4-a11c-f6c8092c854b'::uuid,
    '82295af0-928e-4c6a-a1a8-f6df2c0fdfd0'::uuid,
    '{"code": "216-99-0000", "subAccount": {"id": "52e8771c-a27a-44b8-8444-340de8ef4efb", "code": "99", "domain": "", "normalSide": null, "accountName": "OUTPUT VAT", "accountType": null, "accountCategory": null}, "accountName": "ACCRUED TAXES-OUTPUT VAT", "motherAccount": {"id": "70f899c1-2919-440c-a6d0-9c281b35fa6a", "code": "216", "domain": "com.backend.gbp.domain.accounting.ParentAccount", "normalSide": "CREDIT", "accountName": "ACCRUED TAXES", "accountType": null, "accountCategory": null}, "subSubAccount": {"id": null, "code": null, "domain": null, "normalSide": null, "accountName": null, "accountType": null, "accountCategory": null}, "subAccountName": "OUTPUT VAT", "subAccountSetupId": "52e8771c-a27a-44b8-8444-340de8ef4efb"}'::jsonb,
    NULL,
    NULL,
    NULL,
    'admin',
    '2023-11-23 09:09:41.701',
    'admin',
    '2023-11-23 09:09:58.370',
    NULL,
    'vatAmount',
    NULL
WHERE NOT EXISTS (
    SELECT 1 FROM accounting.integration_items WHERE id = 'f5feb5d7-d309-4b3d-a4f9-a76698dfb904'::uuid
);

INSERT INTO accounting.integration_items
(
    id,
    integration,
    company_id,
    journal_account,
    disabled_property,
    disabled_value,
    value_property,
    created_by,
    created_date,
    last_modified_by,
    last_modified_date,
    deleted,
    source_column,
    multiple
)
SELECT
    '5abb4b3f-4952-4606-a0ba-04ace14cb87b'::uuid,
    'b5338eaf-8ade-4cd4-a11c-f6c8092c854b'::uuid,
    '82295af0-928e-4c6a-a1a8-f6df2c0fdfd0'::uuid,
    '{"code": "216-01-0000", "subAccount": {"id": "95dae3d7-562e-4c42-affd-c860c665b212", "code": "01", "domain": "", "normalSide": null, "accountName": "WITHHOLDING TAX PAYABLE - CWT", "accountType": null, "accountCategory": null}, "accountName": "ACCRUED TAXES-WITHHOLDING TAX PAYABLE - CWT", "motherAccount": {"id": "70f899c1-2919-440c-a6d0-9c281b35fa6a", "code": "216", "domain": "com.backend.gbp.domain.accounting.ParentAccount", "normalSide": "CREDIT", "accountName": "ACCRUED TAXES", "accountType": null, "accountCategory": null}, "subSubAccount": {"id": null, "code": null, "domain": null, "normalSide": null, "accountName": null, "accountType": null, "accountCategory": null}, "subAccountName": "WITHHOLDING TAX PAYABLE - CWT", "subAccountSetupId": "95dae3d7-562e-4c42-affd-c860c665b212"}'::jsonb,
    NULL,
    NULL,
    NULL,
    'admin',
    '2023-11-23 09:09:46.449',
    'admin',
    '2023-11-23 09:10:38.861',
    NULL,
    'cwtAmount',
    NULL
WHERE NOT EXISTS (
    SELECT 1 FROM accounting.integration_items WHERE id = '5abb4b3f-4952-4606-a0ba-04ace14cb87b'::uuid
);
