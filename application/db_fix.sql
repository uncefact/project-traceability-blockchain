DROP PROCEDURE IF EXISTS STRUCTURE_DB_FIX_BEFORE_DATA;
DROP PROCEDURE IF EXISTS CLEAN_USELESS_DATA;
DROP PROCEDURE IF EXISTS FIX_COMPANY;
DROP PROCEDURE IF EXISTS STRUCTURE_DB_FIX_AFTER_DATA;
DROP PROCEDURE IF EXISTS INSERT_MISSING_VALUES;


DELIMITER ;;

CREATE PROCEDURE STRUCTURE_DB_FIX_BEFORE_DATA()
BEGIN
    ALTER TABLE certification_transaction
        DROP INDEX FKschtoji6cddtauphcmtui90ua,
        DROP INDEX FK70m12pab36149q9n2uhj5loen,
        DROP INDEX FKs4hc4mtsnu6a78ep344ois1nk,
        DROP INDEX FK7gop0vjyfqm68banb7r6m6jog,
        DROP INDEX FKaxwlq9lrs4uwjduxi7tx1ld0k,
        DROP INDEX FKt0amf38c0k7jptee6rkeo48yu,
        DROP INDEX FKiyuudgebjrj6u2xl08c4i9dby,
        DROP INDEX FK3rfw84nhrulsppkgrimg4x8q1,
        DROP INDEX FK3x5cvmn19b83rnkw6snc2g0ry;
    ALTER TABLE certification_transaction
        ADD CONSTRAINT certification_transaction_assessment_type_id_fk FOREIGN KEY (assessment_type_id) REFERENCES un_assessment_type(id) ON DELETE CASCADE,
        ADD CONSTRAINT certification_transaction_approver_company_name_fk FOREIGN KEY (approver_company_name) REFERENCES company(company_name) ON DELETE CASCADE,
        ADD CONSTRAINT certification_transaction_consignee_company_name_fk FOREIGN KEY (consignee_company_name) REFERENCES company(company_name) ON DELETE CASCADE,
        ADD CONSTRAINT certification_transaction_contractor_company_name_fk FOREIGN KEY (contractor_company_name) REFERENCES company(company_name) ON DELETE CASCADE,
        ADD CONSTRAINT certification_transaction_document_id_fk FOREIGN KEY (document_id) REFERENCES document(id) ON DELETE CASCADE,
        ADD CONSTRAINT certification_transaction_document_type_code_fk FOREIGN KEY (document_type_code) REFERENCES un_document_type(code) ON DELETE CASCADE,
        ADD CONSTRAINT certification_transaction_processing_standard_name_fk FOREIGN KEY (processing_standard_name) REFERENCES un_processing_standard(name) ON DELETE CASCADE,
        ADD CONSTRAINT certification_transaction_material_id_fk FOREIGN KEY (material_id) REFERENCES material(id) ON DELETE CASCADE;

    ALTER TABLE certification_transaction_process_type
        DROP INDEX FKftpju6k73eumoa3fkl6wc9m2q,
        DROP INDEX FK6wl7cadua268y8wl5scvls7lq;
    ALTER TABLE certification_transaction_process_type
        ADD CONSTRAINT certification_transaction_process_type_proc_id_fk FOREIGN KEY (process_type_id) REFERENCES un_process_type(code) ON DELETE CASCADE,
        ADD CONSTRAINT certification_transaction_process_type_cert_id_fk FOREIGN KEY (certification_transaction_id) REFERENCES certification_transaction(id) ON DELETE CASCADE;

    ALTER TABLE certification_transaction_product_category
        DROP INDEX FKjc0jdn6ugielq91l7jqxxatmq,
        DROP INDEX FKpijcx0pqi8150wnf8cyahao72;
    ALTER TABLE certification_transaction_product_category
        ADD CONSTRAINT certification_transaction_product_category_cert_id_fk FOREIGN KEY (certification_transaction_id) REFERENCES certification_transaction(id) ON DELETE CASCADE,
        ADD CONSTRAINT certification_transaction_product_category_prod_id_fk FOREIGN KEY (product_category_id) REFERENCES un_product_category(code) ON DELETE CASCADE;

    ALTER TABLE company
        DROP INDEX FKqb9bfwe2gdgckh4cnhh82dplh,
        DROP INDEX FKjf6veiqjdxvn9xjw0wuc3ujtl,
        DROP INDEX FK27tnm9syimr1a401q1x6ysha2,
        DROP INDEX FKecdu76mq5ws6ymi5d3w2u8ay1,
        DROP INDEX FKn78rtmutvy0t3q8233tbnbmeg;
    ALTER TABLE company
        ADD CONSTRAINT company_head_company_name_fk FOREIGN KEY (company_head_company_name) REFERENCES company(company_name) ON DELETE CASCADE,
        ADD CONSTRAINT company_company_industry_name_fk FOREIGN KEY (company_industry_name) REFERENCES company_industry(name) ON DELETE CASCADE,
        ADD CONSTRAINT company_country_code_fk FOREIGN KEY (country_code) REFERENCES un_country(code) ON DELETE CASCADE,
        ADD CONSTRAINT company_custodial_wallet_credentials_id_fk FOREIGN KEY (custodial_wallet_credentials_id) REFERENCES custodial_wallet_credentials(id) ON DELETE CASCADE,
        ADD CONSTRAINT company_partner_type_name_fk FOREIGN KEY (partner_type_name) REFERENCES un_role(name) ON DELETE CASCADE;

    ALTER TABLE company_knows_company
        DROP INDEX FKnxtkp4wywf7kff173xxbjp2cp;
    ALTER TABLE company_knows_company
        ADD CONSTRAINT companyaname_fk FOREIGN KEY (companyaname) REFERENCES company(company_name) ON DELETE CASCADE,
        ADD CONSTRAINT companybname_fk FOREIGN KEY (companybname) REFERENCES company(company_name) ON DELETE CASCADE;

    ALTER TABLE contract_position
        DROP INDEX FKlnbelpj85ubk202yptv4gkj1l,
        DROP INDEX FKobcfwuk2m8b6nrd09glsqhhwl,
        DROP INDEX FK99saktkmioxxtfrt4gem0kayt,
        DROP INDEX FK5h28hccnoscrckhi6ohiqq9a9;
    ALTER TABLE contract_position
        ADD CONSTRAINT contract_position_consignee_material_id_fk FOREIGN KEY (consignee_material_id) REFERENCES material(id) ON DELETE CASCADE,
        ADD CONSTRAINT contract_position_contractor_material_id_fk FOREIGN KEY (contractor_material_id) REFERENCES material(id) ON DELETE CASCADE,
        ADD CONSTRAINT contract_position_unit_code_fk FOREIGN KEY (unit_code) REFERENCES un_unit(code) ON DELETE CASCADE,
        ADD CONSTRAINT contract_position_contract_trade_id_fk FOREIGN KEY (contract_trade_id) REFERENCES contract_trade(id) ON DELETE CASCADE;

    ALTER TABLE contract_trade
        DROP INDEX FK5n9ubj4u6gspd3ju6uvgfg20g,
        DROP INDEX FKhraqaj01fdpdny0oa6cynr3wx,
        DROP INDEX FKjp2fm7w69rqpayaa42h24chda,
        DROP INDEX FKkrw96092ejwmk7fq6r4i4n1hy,
        DROP INDEX FKswfo7ie6aa445r7x2iyib4o4k,
        DROP INDEX FK880pu6vtdj3fbwipadgdytx,
        DROP INDEX FK77b19gv7n323hiu4b7y99b66g,
        DROP INDEX FKaef8a6nq6x9e3yj4w8uj61j54;
    ALTER TABLE contract_trade
        #         non so type_id a quale entità si riferisca, presumo a process type
#     ADD CONSTRAINT contract_trade_type_id_fk FOREIGN KEY (type_id) REFERENCES un_process_type(code) ON DELETE CASCADE,
        ADD CONSTRAINT contract_trade_approver_company_name_fk FOREIGN KEY (approver_company_name) REFERENCES company(company_name) ON DELETE CASCADE,
        ADD CONSTRAINT contract_trade_consignee_company_name_fk FOREIGN KEY (consignee_company_name) REFERENCES company(company_name) ON DELETE CASCADE,
        ADD CONSTRAINT contract_trade_contractor_company_name_fk FOREIGN KEY (contractor_company_name) REFERENCES company(company_name) ON DELETE CASCADE,
        ADD CONSTRAINT contract_trade_document_id_fk FOREIGN KEY (document_id) REFERENCES document(id) ON DELETE CASCADE,
        ADD CONSTRAINT contract_trade_document_type_code_fk FOREIGN KEY (document_type_code) REFERENCES un_document_type(code) ON DELETE CASCADE,
        ADD CONSTRAINT contract_trade_processing_standard_name_fk FOREIGN KEY (processing_standard_name) REFERENCES un_processing_standard(name) ON DELETE CASCADE,
        ADD CONSTRAINT contract_trade_certification_transaction_id_fk FOREIGN KEY (certification_transaction_id) REFERENCES certification_transaction(id) ON DELETE CASCADE;

    ALTER TABLE input_type
        DROP INDEX FKo8c0db8ffm3bgwcegpxh0sdty;
    ALTER TABLE input_type
        ADD CONSTRAINT input_type_document_type_code_fk FOREIGN KEY (document_type_code) REFERENCES un_document_type(code) ON DELETE CASCADE;

    ALTER TABLE login
        DROP INDEX FKsexd26fyaqojrk8474esxwagj;
    ALTER TABLE login
        ADD CONSTRAINT login_user_email_fk FOREIGN KEY (user_email) REFERENCES user(email) ON DELETE CASCADE;

    ALTER TABLE material
        DROP INDEX FK2vx2oaljp97had67t7fbdnx0k,
        DROP INDEX FK1legfelt54hc8m59kt2ve6n0u;
    ALTER TABLE material
        ADD CONSTRAINT material_company_id_fk FOREIGN KEY (company_id) REFERENCES company(company_name) ON DELETE CASCADE,
        ADD CONSTRAINT material_process_type_code_fk FOREIGN KEY (process_type_code) REFERENCES un_process_type(code) ON DELETE CASCADE;

    ALTER TABLE order_position
        DROP INDEX FKeevf4kbxmj9xwlrps5l6g5v7r,
        DROP INDEX FKs1wlq1m0rdc5kk33o063mgk7g,
        DROP INDEX FK4orcdmp9ar45wvegjajdpan1l,
        DROP INDEX FK9t5fpx3r04wnktg96tvrm28hk,
        DROP INDEX FKjxcsghonuhwycg088l5h1yq90;
    ALTER TABLE order_position
        ADD CONSTRAINT order_position_consignee_material_id_fk FOREIGN KEY (consignee_material_id) REFERENCES material(id) ON DELETE CASCADE,
        ADD CONSTRAINT order_position_contractor_material_id_fk FOREIGN KEY (contractor_material_id) REFERENCES material(id) ON DELETE CASCADE,
        ADD CONSTRAINT order_position_unit_code_fk FOREIGN KEY (unit_code) REFERENCES un_unit(code) ON DELETE CASCADE,
        ADD CONSTRAINT order_position_contract_position_id_fk FOREIGN KEY (contract_position_id) REFERENCES contract_position(id) ON DELETE CASCADE,
        ADD CONSTRAINT order_position_order_trade_id_fk FOREIGN KEY (order_trade_id) REFERENCES order_trade(id) ON DELETE CASCADE;

    ALTER TABLE order_trade
        DROP INDEX FKrdp84juuam98vevuup3c7vua4,
        DROP INDEX FKkbcoy5espvkaumgh6x4hq5pgf,
        DROP INDEX FKn24d9p3tlcq36khx2bxh66g5c,
        DROP INDEX FKmqh0ttgfx8eq3bteb1ioom2wl,
        DROP INDEX FK2l40s6qkdwrrl5nfvcn43u8do,
        DROP INDEX FK5anwl06neo33jisompi3d9nnh,
        DROP INDEX FKq8y9wrjiex9a3g42xc6ry7pk7,
        DROP INDEX FK5onitca61ocr6nk7cwwe5upk5,
        DROP INDEX FKbdwyutpgva030etsy9doqpsgl;
    ALTER TABLE order_trade
#     ADD CONSTRAINT order_trade_type_id_fk FOREIGN KEY (type_id) REFERENCES un_process_type(code) ON DELETE CASCADE,
        ADD CONSTRAINT order_trade_approver_company_name_fk FOREIGN KEY (approver_company_name) REFERENCES company(company_name) ON DELETE CASCADE,
        ADD CONSTRAINT order_trade_consignee_company_name_fk FOREIGN KEY (consignee_company_name) REFERENCES company(company_name) ON DELETE CASCADE,
        ADD CONSTRAINT order_trade_contractor_company_name_fk FOREIGN KEY (contractor_company_name) REFERENCES company(company_name) ON DELETE CASCADE,
        ADD CONSTRAINT order_trade_document_id_fk FOREIGN KEY (document_id) REFERENCES document(id) ON DELETE CASCADE,
        ADD CONSTRAINT order_trade_document_type_code_fk FOREIGN KEY (document_type_code) REFERENCES un_document_type(code) ON DELETE CASCADE,
        ADD CONSTRAINT order_trade_processing_standard_name_fk FOREIGN KEY (processing_standard_name) REFERENCES un_processing_standard(name) ON DELETE CASCADE,
        ADD CONSTRAINT order_trade_certification_transaction_id_fk FOREIGN KEY (certification_transaction_id) REFERENCES certification_transaction(id) ON DELETE CASCADE,
        ADD CONSTRAINT order_trade_contractor_root_reference_id_fk FOREIGN KEY (contractor_root_reference_id) REFERENCES contract_trade(id) ON DELETE CASCADE;

    ALTER TABLE role_business_step_type
        DROP INDEX FK2qoeet8nx6pp0hfsjwepbqy72,
        DROP INDEX FK8h90sdldu8kuwidh2g0qlfj2n;
    ALTER TABLE role_business_step_type
        ADD CONSTRAINT role_business_step_type_business_step_type_id_fk FOREIGN KEY (business_step_type_id) REFERENCES business_step_type(id) ON DELETE CASCADE;

    ALTER TABLE shipping_position
        DROP INDEX FKtaty7bcrk5c7k1ya91hg9jomr,
        DROP INDEX FKobjw40j6awywhbnyr8dnnjwky,
        DROP INDEX FKj47utu9ebgxtundt1yytjky1s,
        DROP INDEX FK3v72ve1pl61qp3bho5fvmtgum,
        DROP INDEX FKkt1tgjdfgkxqplmi3km8n8op3;
    ALTER TABLE shipping_position
        ADD CONSTRAINT shipping_position_consignee_material_id_fk FOREIGN KEY (consignee_material_id) REFERENCES material(id) ON DELETE CASCADE,
        ADD CONSTRAINT shipping_position_contractor_material_id_fk FOREIGN KEY (contractor_material_id) REFERENCES material(id) ON DELETE CASCADE,
        ADD CONSTRAINT shipping_position_unit_code_fk FOREIGN KEY (unit_code) REFERENCES un_unit(code) ON DELETE CASCADE,
        ADD CONSTRAINT shipping_position_order_position_id_fk FOREIGN KEY (order_position_id) REFERENCES order_position(id) ON DELETE CASCADE,
        ADD CONSTRAINT shipping_position_shipping_trade_id_fk FOREIGN KEY (shipping_trade_id) REFERENCES shipping_trade(id) ON DELETE CASCADE;

    ALTER TABLE shipping_trade
        DROP INDEX FKqrb092sdtlg71paoe1f4twx3v,
        DROP INDEX FKsvay5eo8ye2gdivkimunw7yr8,
        DROP INDEX FKqq8nlhq9b2n2j6devomkte9t2,
        DROP INDEX FKgvs9wfg74wqrb5fetuvb82wvj,
        DROP INDEX FKhlxnta2bmswvj4ghr0d0u8gpf,
        DROP INDEX FK4uuvtvtgimd2n93hamuh58exh,
        DROP INDEX FKsjn0ax4ih1afoklpj2r8vjorq,
        DROP INDEX FKqi230v0i7da959dydu4lhaisn,
        DROP INDEX FKn4oxy36okvm86j76wgv4x0vqp;
    ALTER TABLE shipping_trade
#     ADD CONSTRAINT shipping_trade_type_id_fk FOREIGN KEY (type_id) REFERENCES un_process_type(code) ON DELETE CASCADE,
        ADD CONSTRAINT shipping_trade_approver_company_name_fk FOREIGN KEY (approver_company_name) REFERENCES company(company_name) ON DELETE CASCADE,
        ADD CONSTRAINT shipping_trade_consignee_company_name_fk FOREIGN KEY (consignee_company_name) REFERENCES company(company_name) ON DELETE CASCADE,
        ADD CONSTRAINT shipping_trade_contractor_company_name_fk FOREIGN KEY (contractor_company_name) REFERENCES company(company_name) ON DELETE CASCADE,
        ADD CONSTRAINT shipping_trade_document_id_fk FOREIGN KEY (document_id) REFERENCES document(id) ON DELETE CASCADE,
        ADD CONSTRAINT shipping_trade_document_type_code_fk FOREIGN KEY (document_type_code) REFERENCES un_document_type(code) ON DELETE CASCADE,
        ADD CONSTRAINT shipping_trade_processing_standard_name_fk FOREIGN KEY (processing_standard_name) REFERENCES un_processing_standard(name) ON DELETE CASCADE,
        ADD CONSTRAINT shipping_trade_certification_transaction_id_fk FOREIGN KEY (certification_transaction_id) REFERENCES certification_transaction(id) ON DELETE CASCADE,
        ADD CONSTRAINT shipping_trade_contractor_root_reference_id_fk FOREIGN KEY (contractor_parent_reference_id) REFERENCES order_trade(id) ON DELETE CASCADE;

    ALTER TABLE transformation_plan
        DROP INDEX FKs8akf2oq828n748hm7nvu6eis,
        DROP INDEX FKdfscg88evf1fpf75clb9c6ego,
        DROP INDEX FKqiuy43lo1452s1wmqnkcha0jy,
        DROP INDEX FK613pjmkg3ew95n1ec31ca1dsf,
        DROP INDEX FKok3nhe6ytlscbk78wx7m8kk4d,
        DROP INDEX FKqbtlpa2pv0a6rhhiio81thvri;
    ALTER TABLE transformation_plan
        ADD CONSTRAINT transformation_plan_document_id_fk FOREIGN KEY (document_id) REFERENCES document(id) ON DELETE CASCADE,
        ADD CONSTRAINT transformation_plan_processing_standard_name_fk FOREIGN KEY (processing_standard_name) REFERENCES un_processing_standard(name) ON DELETE CASCADE,
        ADD CONSTRAINT transformation_plan_company_company_name_fk FOREIGN KEY (company_company_name) REFERENCES company(company_name) ON DELETE CASCADE,
        ADD CONSTRAINT transformation_plan_document_type_code_fk FOREIGN KEY (document_type_code) REFERENCES un_document_type(code) ON DELETE CASCADE,
        ADD CONSTRAINT transformation_plan_traceability_level_name_fk FOREIGN KEY (traceability_level_name) REFERENCES un_traceability_level(name) ON DELETE CASCADE,
        ADD CONSTRAINT transformation_plan_transparency_level_name_fk FOREIGN KEY (transparency_level_name) REFERENCES un_transparency_level(name) ON DELETE CASCADE;

    ALTER TABLE transformation_plan_position
        DROP INDEX FKaqqgobq2si8fafq1cahwfg0nc,
        DROP INDEX FKqc8skxwrlidqlym6m9frfsy6b,
        DROP INDEX FKnx8k7q5g65dgywl70qee2ip03,
        DROP INDEX FKd52udma3u29e5rw6n642n1e4h;
    ALTER TABLE transformation_plan_position
        ADD CONSTRAINT transformation_plan_position_consignee_material_id_fk FOREIGN KEY (consignee_material_id) REFERENCES material(id) ON DELETE CASCADE,
        ADD CONSTRAINT transformation_plan_position_contractor_material_id_fk FOREIGN KEY (contractor_material_id) REFERENCES material(id) ON DELETE CASCADE,
        ADD CONSTRAINT transformation_plan_position_unit_code_fk FOREIGN KEY (unit_code) REFERENCES un_unit(code) ON DELETE CASCADE,
        ADD CONSTRAINT transformation_plan_position_transformation_plan_id_fk FOREIGN KEY (transformation_plan_id) REFERENCES transformation_plan(id) ON DELETE CASCADE;

    ALTER TABLE transformation_plan_process_type
        DROP INDEX FK9v240p5p4jvt4mcx0rc81s90q,
        DROP INDEX FKskrldxhki79ti1er9u4p5v2ss;
    ALTER TABLE transformation_plan_process_type
        ADD CONSTRAINT transformation_plan_process_type_process_type_code_fk FOREIGN KEY (process_type_code) REFERENCES un_process_type(code) ON DELETE CASCADE,
        ADD CONSTRAINT transformation_plan_process_type_transformation_plan_id_fk FOREIGN KEY (transformation_plan_id) REFERENCES transformation_plan(id) ON DELETE CASCADE;

    ALTER TABLE transformation_plan_processing_standard
        DROP INDEX FKq3t3ujc23ugw7roqbdqa3f3s3,
        DROP INDEX FK7gb4hcxyc5c5j6f6sq27ya3hj;
    ALTER TABLE transformation_plan_processing_standard
        ADD CONSTRAINT transformation_plan_processing_standard_proc_standard_id_fk FOREIGN KEY (processing_standard_id) REFERENCES un_processing_standard(name) ON DELETE CASCADE,
        ADD CONSTRAINT transformation_plan_processing_standard_trans_plan_id_fk FOREIGN KEY (transformation_plan_id) REFERENCES transformation_plan(id) ON DELETE CASCADE;

    ALTER TABLE un_material_referenced_standard
        DROP INDEX FK2vtd8rk3tf2ktb21417w6480s;
    ALTER TABLE un_material_referenced_standard
        ADD CONSTRAINT un_material_referenced_standard_sustainability_criterion_name_fk FOREIGN KEY (sustainability_criterion_name) REFERENCES un_sustainability_criterion(name) ON DELETE CASCADE;

    ALTER TABLE un_process_type_role
        DROP INDEX FK7owi7ne1vuhdvdwlpyjermek8;
    ALTER TABLE un_process_type_role
        ADD CONSTRAINT un_process_type_role_un_role_name_fk FOREIGN KEY (un_role_name) REFERENCES un_role(name) ON DELETE CASCADE;

    ALTER TABLE un_processing_standard
        DROP INDEX FKltu8kprlpgfo0ef6ogo8uxvv6;
    ALTER TABLE un_processing_standard
        ADD CONSTRAINT un_processing_standard_sustainability_criterion_name_fk FOREIGN KEY (sustainability_criterion_name) REFERENCES un_sustainability_criterion(name) ON DELETE CASCADE;

    ALTER TABLE un_product_detail
        DROP INDEX FKby0nu8ugjbiblw5gi64a5orc8;
    ALTER TABLE un_product_detail
        ADD CONSTRAINT un_product_detail_category_code_fk FOREIGN KEY (category_code) REFERENCES un_product_category(code) ON DELETE CASCADE;

    ALTER TABLE un_referenced_standard
        DROP INDEX FKeyfrcyomhiu047wreyn2hywpx;
    ALTER TABLE un_referenced_standard
        ADD CONSTRAINT un_referenced_standard_sustainability_criterion_name_fk FOREIGN KEY (sustainability_criterion_name) REFERENCES un_sustainability_criterion(name) ON DELETE CASCADE;

    ALTER TABLE un_self_certification_proprietary_standard
        DROP INDEX FKah4l9m8xuutij2h886udiekof;
    ALTER TABLE un_self_certification_proprietary_standard
        ADD CONSTRAINT un_self_certification_proprietary_standard_sust_crit_name_fk FOREIGN KEY (sustainability_criterion_name) REFERENCES un_sustainability_criterion(name) ON DELETE CASCADE;

    ALTER TABLE un_transaction_referenced_standard
        DROP INDEX FK6yd4idmdvnn4f8x7wbs0u9kh8;
    ALTER TABLE un_transaction_referenced_standard
        ADD CONSTRAINT un_transaction_referenced_standard_sust_crit_name_fk FOREIGN KEY (sustainability_criterion_name) REFERENCES un_sustainability_criterion(name) ON DELETE CASCADE;

    ALTER TABLE user
        DROP INDEX FK2yuxsfrkkrnkn5emoobcnnc3r,
        DROP INDEX FKorb7lp5k6rbkxj23hh454csi1;
    ALTER TABLE user
        ADD CONSTRAINT user_company_id_fk FOREIGN KEY (company_id) REFERENCES company(company_name) ON DELETE CASCADE,
        ADD CONSTRAINT user_country_code_fk FOREIGN KEY (country_code) REFERENCES un_country(code) ON DELETE CASCADE;

END;


CREATE PROCEDURE STRUCTURE_DB_FIX_AFTER_DATA()
BEGIN

    DROP TABLE business_step_detail;
    DROP TABLE business_step_type_document_type;
    DROP TABLE role_business_step_type;
    DROP TABLE business_step_type;
    DROP TABLE un_industry;
    DROP TABLE input_type;
    DROP TABLE un_product_detail;
    DROP TABLE un_self_certification_processing_standard;

    ALTER TABLE un_assessment_type DROP PRIMARY KEY;
    ALTER TABLE un_assessment_type
        ADD PRIMARY KEY(name),
        DROP COLUMN id;

    ALTER TABLE un_self_certification_assessment_type DROP PRIMARY KEY;
    ALTER TABLE un_self_certification_assessment_type
        ADD PRIMARY KEY(name),
        DROP COLUMN id;

    ALTER TABLE certification_transaction
        DROP transaction_date,
        ADD CONSTRAINT certification_transaction_assessment_type_name_fk FOREIGN KEY (assessment_type_name) REFERENCES un_assessment_type(name) ON DELETE CASCADE;

    ALTER TABLE contract_trade
        DROP transaction_date,
        DROP type_id;

    ALTER TABLE order_trade
        DROP transaction_date,
        DROP type_id;

    ALTER TABLE shipping_trade
        DROP transaction_date,
        DROP type_id;

    ALTER TABLE material
        DROP FOREIGN KEY material_process_type_code_fk,
        DROP process_type_code;

    ALTER TABLE transformation_plan
        DROP FOREIGN KEY transformation_plan_processing_standard_name_fk,
        DROP FOREIGN KEY transformation_plan_document_id_fk,
        DROP processing_standard_name,
        DROP document_id;

    ALTER TABLE un_process_type_role CHANGE un_process_type_code process_type_code VARCHAR(6);
    ALTER TABLE un_process_type_role CHANGE un_role_name role_name VARCHAR(255);

END;


CREATE PROCEDURE CLEAN_USELESS_DATA()
BEGIN

    DELETE FROM company WHERE company_name LIKE 'del\_%';
    DELETE FROM company WHERE company_name = 'SCIC' OR company_name = 'Agroscope';

END;



CREATE PROCEDURE FIX_COMPANY()
BEGIN
    DECLARE total_companies INT DEFAULT 0;
    DECLARE i INT DEFAULT 0;
    DECLARE new_company_id, company_name_field VARCHAR(255);
    DECLARE wallet_id INT;
    SELECT COUNT(*) FROM company INTO total_companies;

    SET i=0;

    ALTER TABLE certification_transaction ADD consignee_eth_address VARCHAR(255), ADD contractor_eth_address VARCHAR(255), ADD approver_eth_address VARCHAR(255);
    ALTER TABLE company_knows_company ADD company_a_eth_address VARCHAR(255), ADD company_b_eth_address VARCHAR(255);
    ALTER TABLE contract_trade ADD consignee_eth_address VARCHAR(255), ADD contractor_eth_address VARCHAR(255), ADD approver_eth_address VARCHAR(255);
    ALTER TABLE order_trade ADD consignee_eth_address VARCHAR(255), ADD contractor_eth_address VARCHAR(255), ADD approver_eth_address VARCHAR(255);
    ALTER TABLE shipping_trade ADD consignee_eth_address VARCHAR(255), ADD contractor_eth_address VARCHAR(255), ADD approver_eth_address VARCHAR(255);
    ALTER TABLE material ADD company_eth_address VARCHAR(255);
    ALTER TABLE transformation_plan ADD company_eth_address VARCHAR(255);
    ALTER TABLE user ADD company_eth_address VARCHAR(255);
    RENAME TABLE company_industry TO un_company_industry;

    ALTER TABLE company
        ADD company_head_eth_address VARCHAR(255) NULL,
        ADD eth_address VARCHAR(255) NOT NULL;


    WHILE i<total_companies DO
    --     get company information to get results and update
        SELECT custodial_wallet_credentials_id, company_name INTO wallet_id, company_name_field FROM company LIMIT i,1;
        SELECT eth_address INTO new_company_id FROM custodial_wallet_credentials WHERE id = wallet_id;
    --
    --     fix certification transaction references - consignee and contractor
        UPDATE certification_transaction SET consignee_eth_address = new_company_id WHERE consignee_company_name = company_name_field;
        UPDATE certification_transaction SET contractor_eth_address = new_company_id WHERE contractor_company_name = company_name_field;
    --
    --  fix company_knows_company references
        UPDATE company_knows_company SET company_a_eth_address = new_company_id WHERE companyaname = company_name_field;
        UPDATE company_knows_company SET company_b_eth_address = new_company_id WHERE companybname = company_name_field;
    --
    --     fix contract trade references - consignee and contractor
        UPDATE contract_trade SET consignee_eth_address = new_company_id WHERE consignee_company_name = company_name_field;
        UPDATE contract_trade SET contractor_eth_address = new_company_id WHERE contractor_company_name = company_name_field;
        UPDATE contract_trade SET approver_eth_address = new_company_id WHERE approver_company_name = company_name_field;
    --
    --     fix order trade references - consignee and contractor
        UPDATE order_trade SET consignee_eth_address = new_company_id WHERE consignee_company_name = company_name_field;
        UPDATE order_trade SET contractor_eth_address = new_company_id WHERE contractor_company_name = company_name_field;
        UPDATE order_trade SET approver_eth_address = new_company_id WHERE approver_company_name = company_name_field;

    --
    --     fix shipping trade references - consignee and contractor
        UPDATE shipping_trade SET consignee_eth_address = new_company_id WHERE consignee_company_name = company_name_field;
        UPDATE shipping_trade SET contractor_eth_address = new_company_id WHERE contractor_company_name = company_name_field;
        UPDATE shipping_trade SET approver_eth_address = new_company_id WHERE approver_company_name = company_name_field;

        --
        --     fix material references
        UPDATE material SET company_eth_address = new_company_id WHERE company_id = company_name_field;
    --
    --     fix transformation plan references
        UPDATE transformation_plan SET company_eth_address = new_company_id WHERE company_company_name = company_name_field;

    --     fix user references
        UPDATE user SET company_eth_address = new_company_id WHERE company_id = company_name_field;

    --     fix company references
        UPDATE company SET eth_address = new_company_id WHERE company_name = company_name_field;


        SET i = i + 1;
        SET wallet_id = NULL;
        SET company_name_field = NULL;
        SET new_company_id = NULL;
    END WHILE;

    UPDATE custodial_wallet_credentials SET public_key = eth_address WHERE 1=1;
    ALTER TABLE custodial_wallet_credentials DROP eth_address;

    ALTER TABLE certification_transaction
        DROP FOREIGN KEY certification_transaction_approver_company_name_fk,
        DROP FOREIGN KEY certification_transaction_consignee_company_name_fk,
        DROP FOREIGN KEY certification_transaction_contractor_company_name_fk,
        DROP FOREIGN KEY certification_transaction_assessment_type_id_fk,
        DROP consignee_company_name,
        DROP contractor_company_name,
        DROP approver_company_name,
        DROP assessment_type_id;

    ALTER TABLE company_knows_company
        DROP FOREIGN KEY companyaname_fk,
        DROP FOREIGN KEY companybname_fk,
        DROP companyaname,
        DROP companybname;

    ALTER TABLE contract_trade
        DROP FOREIGN KEY contract_trade_approver_company_name_fk,
        DROP FOREIGN KEY contract_trade_consignee_company_name_fk,
        DROP FOREIGN KEY contract_trade_contractor_company_name_fk,
        DROP consignee_company_name,
        DROP contractor_company_name,
        DROP approver_company_name;

    ALTER TABLE order_trade
        DROP FOREIGN KEY order_trade_approver_company_name_fk,
        DROP FOREIGN KEY order_trade_consignee_company_name_fk,
        DROP FOREIGN KEY order_trade_contractor_company_name_fk,
        DROP consignee_company_name,
        DROP contractor_company_name,
        DROP approver_company_name;

    ALTER TABLE shipping_trade
        DROP FOREIGN KEY shipping_trade_approver_company_name_fk,
        DROP FOREIGN KEY shipping_trade_consignee_company_name_fk,
        DROP FOREIGN KEY shipping_trade_contractor_company_name_fk,
        DROP consignee_company_name,
        DROP contractor_company_name,
        DROP approver_company_name;

    ALTER TABLE transformation_plan
        DROP FOREIGN KEY transformation_plan_company_company_name_fk,
        DROP company_company_name;

    ALTER TABLE user
        DROP FOREIGN KEY user_company_id_fk,
        DROP company_id;

    DROP INDEX UK5194qm2f4urmyoctpdjsqkkrb ON material;
    DROP INDEX UKl1f1869iq1buuk4qlfdougjvg ON material;
    ALTER TABLE material
        DROP FOREIGN KEY material_company_id_fk,
        DROP COLUMN company_id;

    ALTER TABLE company
        DROP FOREIGN KEY company_head_company_name_fk,
        DROP company_head_company_name,
        DROP partner_typ,
        DROP PRIMARY KEY;
    SET FOREIGN_KEY_CHECKS=0;
    ALTER TABLE company ADD PRIMARY KEY (eth_address);
    ALTER TABLE company
        ADD CONSTRAINT company_head_eth_address_fk FOREIGN KEY (company_head_eth_address) REFERENCES company(eth_address) ON DELETE CASCADE;

    ALTER TABLE certification_transaction
        ADD CONSTRAINT certification_transaction_approver_eth_address_fk FOREIGN KEY (approver_eth_address) REFERENCES company(eth_address) ON DELETE CASCADE,
        ADD CONSTRAINT certification_transaction_consignee_eth_address_fk FOREIGN KEY (consignee_eth_address) REFERENCES company(eth_address) ON DELETE CASCADE,
        ADD CONSTRAINT certification_transaction_contractor_eth_address_fk FOREIGN KEY (contractor_eth_address) REFERENCES company(eth_address) ON DELETE CASCADE;
    ALTER TABLE company_knows_company
        ADD CONSTRAINT company_a_eth_address_fk FOREIGN KEY (company_a_eth_address) REFERENCES company(eth_address) ON DELETE CASCADE,
        ADD CONSTRAINT company_b_eth_address_fk FOREIGN KEY (company_b_eth_address) REFERENCES company(eth_address) ON DELETE CASCADE;
    ALTER TABLE contract_trade
        ADD CONSTRAINT contract_trade_approver_eth_address_fk FOREIGN KEY (approver_eth_address) REFERENCES company(eth_address) ON DELETE CASCADE,
        ADD CONSTRAINT contract_trade_consignee_eth_address_fk FOREIGN KEY (consignee_eth_address) REFERENCES company(eth_address) ON DELETE CASCADE,
        ADD CONSTRAINT contract_trade_contractor_eth_address_fk FOREIGN KEY (contractor_eth_address) REFERENCES company(eth_address) ON DELETE CASCADE;
    ALTER TABLE order_trade
        ADD CONSTRAINT order_trade_approver_eth_address_fk FOREIGN KEY (approver_eth_address) REFERENCES company(eth_address) ON DELETE CASCADE,
        ADD CONSTRAINT order_trade_consignee_eth_address_fk FOREIGN KEY (consignee_eth_address) REFERENCES company(eth_address) ON DELETE CASCADE,
        ADD CONSTRAINT order_trade_contractor_eth_address_fk FOREIGN KEY (contractor_eth_address) REFERENCES company(eth_address) ON DELETE CASCADE;
    ALTER TABLE shipping_trade
        ADD CONSTRAINT shipping_trade_approver_eth_address_fk FOREIGN KEY (approver_eth_address) REFERENCES company(eth_address) ON DELETE CASCADE,
        ADD CONSTRAINT shipping_trade_consignee_eth_address_fk FOREIGN KEY (consignee_eth_address) REFERENCES company(eth_address) ON DELETE CASCADE,
        ADD CONSTRAINT shipping_trade_contractor_eth_address_fk FOREIGN KEY (contractor_eth_address) REFERENCES company(eth_address) ON DELETE CASCADE;
    ALTER TABLE transformation_plan
        ADD CONSTRAINT transformation_plan_company_eth_address_fk FOREIGN KEY (company_eth_address) REFERENCES company(eth_address) ON DELETE CASCADE;
    ALTER TABLE user
        ADD CONSTRAINT user_company_eth_address_fk FOREIGN KEY (company_eth_address) REFERENCES company(eth_address) ON DELETE CASCADE;
    ALTER TABLE material
        ADD UNIQUE (name, company_eth_address, is_input),
        ADD CONSTRAINT material_company_eth_address_fk FOREIGN KEY (company_eth_address) REFERENCES company(eth_address) ON DELETE CASCADE;
END;


CREATE PROCEDURE INSERT_MISSING_VALUES()
BEGIN
    DELETE FROM un_company_industry WHERE 1 = 1;
    INSERT INTO `un_company_industry` (`name`) VALUES ('cheese'),('cotton'),('leather');

    INSERT INTO `un_role_company_industry` (`role_name`, `company_industry_name`) VALUES ('certifier','cheese'),('trader','cheese'),('casaro','cotton'),('certifier','cotton'),('cotton_generic','cotton'),('dyer','cotton'),('farmer','cotton'),('finisher','cotton'),('ginner','cotton'),('manufacturing','cotton'),('retailer','cotton'),('spinner','cotton'),('trader','cotton'),('weaver','cotton'),('abbatoir','leather'),('certifier','leather'),('consumer','leather'),('farmer','leather'),('finisher','leather'),('manufacturing','leather'),('retailer','leather'),('slaughter','leather'),('tannery','leather');

    INSERT INTO `un_processing_standard_company_industry` (`company_industry_name`, `processing_standard_name`) VALUES ('cotton','-- Not applicable --'),('leather','-- Not applicable --'),('cotton','Agroscope - Rapporto analisi campioni'),('leather','Agroscope - Rapporto analisi campioni'),('leather','AGW - Animal Welfare '),('leather','animal welfare assessment '),('cotton','Better Cotton Initiative (BCI)'),('cotton','chemical use assessment '),('leather','chemical use assessment '),('cotton','ECO2L '),('leather','ECO2L '),('cotton','environment assessment '),('leather','environment assessment '),('cotton','fibre content'),('cotton','FSLM Facility Social Labor Module'),('leather','FSLM Facility Social Labor Module'),('cotton','Global Organic Textile Standard (GOTS)'),('leather','Global Organic Textile Standard (GOTS)'),('cotton','Haelixa DNA origin standard'),('cotton','health & safety assessment '),('leather','health & safety assessment '),('cotton','ICEC Certification  '),('leather','ICEC Certification  '),('cotton','Intertek '),('leather','Intertek '),('cotton','ISO'),('leather','ISO'),('cotton','LWG Certification '),('leather','LWG Certification '),('cotton','Oeko-Tex Eco Passport'),('leather','Oeko-Tex Eco Passport'),('cotton','Oeko-Tex Made Green'),('leather','Oeko-Tex Made Green'),('cotton','Oeko-Tex STeP'),('leather','Oeko-Tex STeP'),('cotton','OIC - Rapporto ispezione'),('leather','OIC - Rapporto ispezione'),('cotton','origin assessment'),('leather','origin assessment'),('cotton','quality assessment'),('leather','quality assessment'),('cotton','social & environment assessment '),('leather','social & environment assessment '),('cotton','social assessment '),('leather','social assessment '),('cotton','STANDARD 100 by OEKO-TEX'),('leather','STANDARD 100 by OEKO-TEX'),('cotton','STEA - Formulario tassazione'),('leather','STEA - Formulario tassazione'),('cotton','Sustainable Leather Foundation '),('leather','Sustainable Leather Foundation '),('cotton','Textile Exchange Global Recycled Standard (GRS)'),('leather','Textile Exchange Global Recycled Standard (GRS)'),('cotton','USDA National Organic Program - NOP'),('leather','USDA National Organic Program - NOP'),('cotton','WRAP '),('leather','WRAP '),('cotton','WRAP Socially Responsible factories'),('leather','WRAP Socially Responsible factories'),('cotton','ZDHC ChemCheck '),('leather','ZDHC ChemCheck '),('cotton','ZDHC ClearStream'),('leather','ZDHC ClearStream'),('cotton','ZDHC InCheck'),('leather','ZDHC InCheck');

    INSERT INTO `un_sustainability_criterion_company_industry` (`sustainability_criterion_name`, `company_industry_name`) VALUES ('Fibre content','cotton'),('Gas emission','cotton'),('Origin','cotton'),('Product quality','cotton'),('Social/environmental performance','cotton'),('Use of chemicals','cotton'),('Animal welfare','leather'),('Fibre content','leather'),('Gas emission','leather'),('Origin','leather'),('Product quality','leather'),('Social/environmental performance','leather'),('Use of chemicals','leather');
END;

;;

DELIMITER ;


# RUN ORDER:
# 1
CALL STRUCTURE_DB_FIX_BEFORE_DATA();

# before clear useless companies and fixing again the structure, the inserts of the data can be resumed...

# 2
CALL CLEAN_USELESS_DATA();
# 3
CALL FIX_COMPANY();
#4
CALL STRUCTURE_DB_FIX_AFTER_DATA();

#5 - run this procedure after the backend has been started (new tables have to be created before insertion)
CALL INSERT_MISSING_VALUES();
