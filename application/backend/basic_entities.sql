# Insertion of companies

INSERT INTO unece_tracking.company (id, company_name, company_code) VALUES
(2,'Cotton GIZA 45','1');
INSERT INTO unece_tracking.company (id, company_name, company_code) VALUES
(3,'Cotton GIZA 86','2');
INSERT INTO unece_tracking.company (id, company_name, company_code) VALUES
(4,'Al Amir Company','4');
INSERT INTO unece_tracking.company (id, company_name, company_code) VALUES
(5,'EGYPT GINNING CO.','5');
INSERT INTO unece_tracking.company (id, company_name, company_code) VALUES
(6,'DELTA DYEING S.A.E.','6');
INSERT INTO unece_tracking.company (id, company_name, company_code) VALUES
(7,'ELVY WEAVING S.A.E.','7');
INSERT INTO unece_tracking.company (id, company_name, company_code) VALUES
(8,'weba Weberei Appenzell AG','8');
INSERT INTO unece_tracking.company (id, company_name, company_code) VALUES
(9,'Cotton GIZA 96','3');
INSERT INTO unece_tracking.company (id, company_name, company_code) VALUES
(10,'Egyyarn ','10');


# insertion of document types (invented)

INSERT INTO unece_tracking.document_name_code (code, name) VALUES ('861', 'GS1L42');
INSERT INTO unece_tracking.document_name_code (code, name) VALUES ('dc5', 'GS43L42');
INSERT INTO unece_tracking.document_name_code (code, name) VALUES ('814', 'GS32L42');
INSERT INTO unece_tracking.document_name_code (code, name) VALUES ('gfg', 'GS45L42');

# insertion of contract trade
INSERT INTO unece_tracking.contract_trade (contractor_reference_number, b2b_level, consignee_date, consignee_email,
                                           consignee_reference_number, contact_email, contact_first_name,
                                           contact_last_name, contact_partner_name, contractor_date, contractor_email,
                                           document_approval, is_subcontracting, notes, process_amount,
                                           process_standard, status, supply_chain_visibility_level, to_be_contacted,
                                           trade_date, valid_from, valid_until, consignee_id, contractor_id,
                                           document_name_code_code, type_id)
VALUES ('lala', null, null, 'supsi@mail.ch', null, null, null, null, null, '2021-02-22 14:37:08', 'user1@mail.ch', null,
        null, 'fdg fghfgdh ', null, null, 0, null, null, null, '2021-02-24 14:37:46', '2021-02-27 14:37:50', 4, 9,
        '861', null);

# insertion of contract position
INSERT INTO unece_tracking.contract_position (amount, external_description, contractor_process_id, unit_code,
                                              contract_trade_contractor_reference_number)
VALUES (10, 'sdg dfsgsdg ', 1, '123', 'lala');

