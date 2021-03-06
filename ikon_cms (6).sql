
DROP SCHEMA IF EXISTS ikon_cms ;
CREATE SCHEMA IF NOT EXISTS ikon_cms DEFAULT CHARACTER SET utf8 ;
USE ikon_cms ;

/*Admin Login Detail*/

/*
Manages details all types of login pages avalibale in UI for 
jetsynthesys
*/
CREATE TABLE icn_login_pages
(
	lp_id			int(5),					-- unique id
	lp_pages		varchar(20),			-- Admin pages
	lp_module		varchar(20),			-- The reference module
	lp_function		varchar(20)				-- The function of the page
)ENGINE = INNODB;

CREATE TABLE icn_user_rights
(
	ur_lp_id		int(5),					-- fk: lp_id
	ur_read			int(1),					-- is read right exist : 1 is true, 0 is false
	ur_write		int(1),					-- is write right exist: 1 is true, 0 is false
	ur_ld_id		int(7)					-- fk: ld_id, user id
)ENGINE = INNODB;


/*
Manages details for login credentials
*/
CREATE TABLE icn_login_detail
(
	ld_id			int(7) not null,                        -- pk
	ld_active		int(1),						-- user is active or not
	ld_user_id		varchar(50),				-- user id userd for login
	ld_user_pwd		varchar(50),				-- password for user id
	ld_user_name		varchar(50),				-- full name of the user
	ld_display_name		varchar(50),				-- display name of user
	ld_email_id		varchar(50),				-- email id
	ld_mobile_no		decimal(40,0),				-- phone number of user
	ld_role			varchar(50),				-- role/designation of user
	ld_user_type	varchar(50),				-- user can be Super user or regular user
	ld_last_login	datetime,					-- last login date of user
	ld_created_on		datetime,				-- date and time of creation
	ld_created_by		varchar(50),				-- created by
	ld_modified_on		datetime,				-- date and time of modification	
	ld_modified_by		varchar(50),				-- modified by
	PRIMARY KEY (ld_id)
)ENGINE = INNODB;


/*
Mannages admin log details
*/
CREATE TABLE icn_admin_log_detail
(
	ald_id				int(10) not null,                        -- pk
	ald_message			varchar(500),							-- message to add
	ald_action			varchar(50),							-- action taken e.g. add/delete/update
	ald_created_on		datetime,								-- date and time of creation
	ald_created_by		varchar(50),							-- created by
	ald_modified_on		datetime,								-- date and time of modification
	ald_modified_by		varchar(50),							-- modified by
	PRIMARY KEY (ald_id)
)ENGINE = INNODB;


/*Vendor Management*/

/*
Mannages vendor details
*/
CREATE TABLE icn_vendor_detail
(
	vd_id				int(7) not null,            -- pk
	vd_ld_id			int(7),						-- fk: ld_id
	vd_name				varchar(50),				-- full name of the vendor
	vd_display_name		varchar(50),				-- display name of vendor
	vd_email_id         varchar(50),                -- email id of vendor
    vd_mobile_no        decimal(40,0),              -- phone number of vendor
	vd_desc				varchar(100),				-- small description about vendor
	vd_is_active		int(1),						-- flag to show the vendor is active or not. 1: active 2. block
	vd_starts_on		date,						-- start date of vendor
	vd_end_on			date,						-- end date of vendor
	vd_vendor_of		varchar(50),				-- vendor belogs to which module. e.g. content_ingestion,cms,bgw
	vd_created_on		datetime,					-- date and time of creation
	vd_created_by		varchar(50),				-- created by
	vd_modified_on		datetime,					-- date and time of modification	
	vd_modified_by		varchar(50),				-- modified by
	PRIMARY KEY (vd_id)
)ENGINE = INNODB;


/*Store & Icon Management*/
/*
Mannages Store Vs User
*/
CREATE TABLE icn_store_user
(
	su_st_id							int(10) not null,				-- fk: st_id, store id
	su_ld_id							int(7),							-- fk: ld_id, id of store super user( table : icn_login_detail)
	su_created_on						 DATETIME,	
	su_modified_on						 DATETIME,
	su_created_by						 VARCHAR(50),
	su_modified_by						 VARCHAR(50),
	PRIMARY KEY (su_ld_id)
)ENGINE = INNODB;

/*
Mannages Store and its details
*/
CREATE TABLE icn_store
(
	st_id				int(10) not null,                       -- pk
	st_name				varchar(50),							-- name of the store
	st_url				varchar(250),							-- url of the store
	st_country_distribution_rights			INT(10),			-- fk: cmd_group_id - country distribution rights
	st_front_type							INT(10),			-- fk: cmd_group_id - store front type e.g. mobile, app.
	st_payment_type							INT(10),			-- fk: cmd_group_id - payment type distribution rights e.g sub or on time
	st_payment_channel						INT(10),			-- fk: cmd_group_id - payment channel distribution rights e.g voda, airtel
	st_vendor								INT(10),			-- fk: cmd_group_id - vendor distribution rights e.g t-series
	st_content_type							INT(10),			-- fk: cmd_group_id - content distribution rights e.g ringtones,wallpaper
	st_created_on						 DATETIME,	
	st_modified_on						 DATETIME,
	st_created_by						 VARCHAR(50),
	st_modified_by						 VARCHAR(50),
	PRIMARY KEY (st_id)
)ENGINE = INNODB;


/*
Mannages content type w.r.t. streaming,download and plan
*/
CREATE TABLE icn_manage_content_type
(
	mct_id						int(7) not null,					-- pk
	mct_parent_cnt_type_id		int(7),								-- fk: cd_id e.g. Audio, Video, Image (id of parent content type
	mct_cnt_type_id				int(7),								-- fk: cd_id e.g. song, ringtone, video clips etc
	mct_delivery_type_id		int(5),								-- fk: cmd_group_id - delivery type group id
	PRIMARY KEY (mct_id)
)ENGINE = INNODB;

/*
Mannages country and its region
Not required
CREATE TABLE icn_country
(
	cty_unq_id							int(7),								-- newly added
	cty_region_id								int(7) not null,			-- fk: cd_id
	cty_name							varchar(100),						-- country name
	cty_created_on						DATETIME,	
	cty_modified_on						DATETIME,
	cty_created_by						VARCHAR(50),
	cty_modified_by						VARCHAR(50)
)ENGINE = INNODB;
*/

/*Plan creation Management*/

/* for Alacarte plans*/
create table icn_alacart_plan
(
	ap_id						int(7),				-- pk : unique id
	ap_ld_id					int(10),			-- fk: ld_id for multi tenancy
	ap_st_id					int(7),				-- fk: st_id for multi tenacy
	ap_plan_name				varchar(40),		-- plan name
	ap_caption					varchar(40),		-- Caption
	ap_description				varchar(200),		-- desc
	ap_jed_id					int(10),			-- jet pay event id
	ap_content_type				int(7),				-- fk: cd_id e.g. wallpaper, audio, image
	ap_delivery_type			int(5),				-- fk: cmd_group_id - delivery type group id
	ap_no_of_stream				int(5),				-- streaming number of times
	ap_stream_duration			int(5),				-- streaming duration.
	ap_stream_dur_type			int(5),				-- fk: cd_id, duration type e.g hr, min, year
	ap_channel_front		 	INT(10),			-- fk: cmd_group_id - channel fronts distribution e.g. mobile app, web
	ap_stream_setting			int(1),				-- 0. OFF, 1. ON
	ap_stream_dur_setting		int(1),				-- 0. OFF, 1. ON
	ap_cty_id					int(7),				-- fk: cty_id. geo location id
	ap_is_active				int(1),				-- 0 in-active, 1 active plan
	ap_created_on				datetime,
	ap_created_by				varchar(50),
	ap_modified_on				datetime,
	ap_modified_by				varchar(50),
	PRIMARY KEY (ap_id)
)ENGINE = INNODB;


/* for Offer plans*/
create table icn_offer_plan
(
	op_id						int(7),				-- pk: unique id
	op_ld_id					int(10),			-- fk: ld_id for multi tenancy
	op_st_id					int(7),				-- fk: st_id for multi tenacy
	op_plan_name				varchar(40),		-- plan name
	op_caption					varchar(40),		-- Caption
	op_description				varchar(200),		-- desc
	op_buy_item					int(3),				-- no of items user has to buy to participate in offer
	op_free_item				int(3),				-- no of items user will get free
	op_channel_front		 	INT(10),			-- fk: cmd_group_id - channel fronts distribution e.g. mobile app, web
	op_is_active				int(1),				-- 0 in-active, 1 active plan
	op_created_on				datetime,
	op_created_by				varchar(50),
	op_modified_on				datetime,
	op_modified_by				varchar(50),
	PRIMARY KEY (op_id)
)ENGINE = INNODB;


/* for subscription plans*/
create table icn_sub_plan
(
	sp_id							int(7),				-- unique id :pk
	sp_ld_id						int(10),			-- fk: ld_id for multi tenancy
	sp_st_id						int(7),				-- fk: st_id for multi tenancy
	sp_plan_name					varchar(40),		-- plan name
	sp_caption						varchar(40),		-- Caption
	sp_description					varchar(200),		-- desc
	sp_jed_id						int(10),			-- jet pay eventid
	sp_tnb_days						int(5),				-- try and buy offer for days
	sp_tnb_free_cnt_limit			int(3),				-- nos of content per day for the try and buy offer days
	sp_single_day_cnt_limit			int(3),				-- nos of content for single day for sub
	sp_full_sub_cnt_limit			int(5),				-- nos of content for full sub duration
	sp_channel_front		 		INT(10),			-- fk: cmd_group_id - channel fronts distribution e.g. mobile app, web
	sp_tnb_stream_cnt_limit			int(3),				-- nos of content to be stream per day for the try and buy offer days
	sp_single_day_steam_limit		int(3),				-- nos of content to be stream for single day for sub
	sp_full_sub_stream_limit		int(5),				-- nos of content to be stream for full sub duration
	sp_tnb_stream_duration			int(5),				-- streaming duration in tnb .
	sp_tnb_stream_dur_type			int(5),				-- fk: cd_id, duration type in tnb  e.g hr, min, year
	sp_single_day_stream_dur		int(5),				-- streaming duration for single day.
	sp_single_day_stream_dur_type	int(5),				-- fk: cd_id, duration type for single day e.g hr, min, year
	sp_full_sub_stream_duration		int(5),				-- streaming duration for full sub.
	sp_full_sub_stream_dur_type		int(5),				-- fk: cd_id, duration type for full sub e.g hr, min, year
	sp_stream_setting				int(1),				-- 0. OFF, 1. ON
	sp_stream_dur_setting			int(1),				-- 0. OFF, 1. ON
	sp_cty_id						int(7),				-- fk: cty_id. geo location id
	sp_is_cnt_free					int(1),				-- is content free or paid. 0 - free, 1 - paid
	sp_wallpaper_alcrt_id			int(7),				-- fk : ap_id, wallpaper alacart download plan id
	sp_animation_alcrt_id			int(7),				-- fk : ap_id, animation alacart download plan id
	sp_ringtone_alcrt_id			int(7),				-- fk : ap_id, ringtone alacart download plan id
	sp_text_alcrt_id				int(7),				-- fk : ap_id, text/article alacart download plan id
	sp_game_alcrt_id				int(7),				-- fk : ap_id, games/apps alacart download plan id
	sp_video_alcrt_id				int(7),				-- fk : ap_id, video alacart download plan id
	sp_fullsong_alcrt_id			int(7),				-- fk : ap_id, full song alacart download plan id
	sp_video_alcrt_stream_id		int(7),				-- fk : ap_id, video alacart stream plan id
	sp_fullsong_alcrt_stream_id		int(7),				-- fk : ap_id, full song alacart stream plan id
	sp_plan_duration				int(5),				-- sub plan duration value. e.g 1 ,2 etc
	sp_plan_dur_type				int(5),				-- fk: cd_id, duration type in tnb  e.g day,week , month, year
	sp_is_active					int(1),				-- 0 in-active, 1 active plan
	sp_created_on					datetime,
	sp_created_by					varchar(50),
	sp_modified_on					datetime,
	sp_modified_by					varchar(50),
	PRIMARY KEY (sp_id)
) ENGINE = INNODB;


/* for value pack plans*/

create table icn_valuepack_plan
(
	vp_id						int(7),				-- pk: unique id
	vp_ld_id					int(10),			-- fk: ld_id for multi tenancy
	vp_st_id					int(7),				-- fk: st_id for multi tenancy
	vp_plan_name				varchar(40),		-- plan name
	vp_caption					varchar(40),		-- Caption
	vp_description				varchar(200),		-- desc
	vp_jed_id					int(10),			-- jey pay event  id
	vp_download_limit			int(5),				-- max no of downloads
	vp_duration_limit			int(5),				-- max no of duration
	vp_duration_type			int(5),				-- fk: cd_id, duration type for full sub e.g hr, min, year
	vp_stream_limit				int(5),				-- max number of stream
	vp_stream_duration			int(5),				-- streaming duration .
	vp_stream_dur_type			int(5),				-- fk: cd_id, duration type for full sub e.g hr, min, year
	vp_stream_setting			int(1),				-- 0. OFF, 1. ON
	vp_stream_dur_setting		int(1),				-- 0. OFF, 1. ON
	vp_is_active				int(1),				-- 0 in-active, 1 active plan
	vp_cty_id					int(7),				-- fk: cty_id. geo location id
	vp_created_on				datetime,
	vp_created_by				varchar(50),
	vp_modified_on				datetime,
	vp_modified_by				varchar(50),
	PRIMARY KEY (vp_id)
)ENGINE = INNODB;

CREATE TABLE IF NOT EXISTS  icn_user_content_counter(
	ucc_id						int(10) not null,		-- pk: unique id
	ucc_ref_jed_id				int(7),					-- jet pay id
	ucc_delivery_type			int(3),					-- stream/download
	ucc_start_time				datetime,				-- eg. the start of the subscription of te one month sub
	ucc_end_time				datetime,				-- eg. the send of the subscription of the one month sub
	ucc_counter					int(3),					-- counter for the current day
	ucc_curr_start_date			datetime,				-- e.g. start day for the subset of the complete duration
	ucc_curr_end_date			datetime,				-- e.g. end day for the subset of the complete duration
	ucc_cumm_counter			int(3),					-- cummulative content consumption
	ucc_created_on				datetime,
	ucc_created_by				varchar(50),
	ucc_modified_on				datetime,
	ucc_modified_by				varchar(50),
	PRIMARY KEY (ucc_id)
)ENGINE = INNODB;


CREATE TABLE IF NOT EXISTS  icn_disclaimer(
	dcl_id					int(7) not null, 			-- pk: unique id
	dcl_ref_jed_id			int(7),						-- jet pay id
	dcl_partner_id			int(3),						-- operator id
	dcl_st_id				int(7),						-- fk: st_id for multi tenancy
	dcl_disclaimer			varchar(200),				-- disclaimer text
	dcl_created_on			datetime,
	dcl_created_by			varchar(50),
	dcl_modified_on			datetime,
	dcl_modified_by			varchar(50),
	PRIMARY KEY (dcl_id)
)ENGINE = INNODB;



/*Icon Content*/
-- catalogue is the master name i.e. content status, content type name etc. 

CREATE TABLE IF NOT EXISTS  catalogue_master(
cm_id		 INT(7),  		-- unique id for the master catalogue
cm_name		VARCHAR(25), 	-- name of the catalogue
CONSTRAINT unc_cat_mstr_id UNIQUE (cm_id)
)ENGINE = InnoDB;

-- example record 1
-- cm_id :1
-- cm_name :content status
-- example record 2
-- cm_id :2
-- cm_name :content type
-- cm_id :3
-- cm_name: Rights Setting
-- cm_id:4
-- cm_name: vendor

-- catalogue is master details e.g. content status(in process, ready to moderate ) etc. 
CREATE TABLE IF NOT EXISTS  catalogue_detail(
cd_id 		 	INT(10),  		-- unique id for the detail master
cd_cm_id	 	INT(7),	 	-- id of the master catalogue
cd_name			VARCHAR(25),  	-- catalogue label name
cd_display_name	VARCHAR(40),	-- display name
cd_desc		 	INT(10),		-- self join e.g. celeb role.
cd_desc1		VARCHAR(40)	,	-- can be any desc eg. alias for celeb
CONSTRAINT unc_cat_det_id UNIQUE (cd_id)
)ENGINE = InnoDB;


-- id 1, cm_name - content status , cd_name - in process
-- id 1, cm_name - content status , cd_name - ready to moderate
-- example record 1
-- cd_id :1
-- cd_cm_id :1
-- cd_name :in process
-- example record 2
-- cd_id :2
-- cd_cm_id :1
-- cd_name :ready to moderate
-- example record 3
-- cd_id :3
-- cd_cm_id :2
-- cd_name :Audio
-- cd_id:4
-- cd_cm_id:3
-- cd_name:Rights_Allowed Content Type
-- cd_display_name:Allowed Content Type
-- cd_id:4
-- cd_cm_id:3
-- cd_name:Rights_Country Disrtibution Rights
-- cd_display_name:Country Disrtibution Rights
-- cd_id:5
-- cd_cm_id:3
-- cd_name:Rights_Channel Distribution Rights
-- cd_display_name:Channel Distribution Rights
-- cd_id :6
-- cd_cm_id :4
-- cd_name :Vendor




CREATE TABLE IF NOT EXISTS  vendor_profile(
vp_vendor_id				 INT(5),  -- vendor id
vp_r_group_id				 INT(10), -- fk:r_group_id ->fK:cmd_group_id
vp_rights_at_property_level	 INT(1) default 0	-- yes 1/no 0 -- default no
)ENGINE = InnoDB;


CREATE TABLE IF NOT EXISTS  rights(
r_id 								 INT(10),   -- unique id
r_group_id							 INT(10),   -- group id unique per entity
r_entity_type						 INT(10),	-- fk: cd_id - e.g. vendor, property : basically for all entities where rights is required. 
r_allowed_content_type				 INT(10),	-- fk: cmd_group_id - content type
r_country_distribution_rights		 INT(10),	-- fk: cmd_group_id - country distribution rights
r_channel_distribution_rights		 INT(10),	-- fk: cmd_group_id - channel distribution rights
r_rights_at_content_level			 int(1),	-- 0 for no 1; yes
r_created_on						 DATETIME,	
r_modified_on						 DATETIME,
r_created_by						 VARCHAR(50),
r_modified_by						 VARCHAR(50),
CONSTRAINT unc_r_group_id UNIQUE (r_group_id)

)ENGINE = InnoDB;

-- Example
-- r_id :1
-- r_group_id:
-- r_entity_type:6
-- r_allowed_content_type:
-- r_country_distribution_rights:
-- r_channel_distribution_rights:


-- typically will be used by the tables where cartesian is required e.g. multiple celebs, multiple tags etc. 
CREATE TABLE IF NOT EXISTS  multiselect_metadata_detail(
cmd_id 								 INT(10),		-- unique id per record
cmd_group_id						 INT(10),		-- unique id per entity
cmd_entity_type						 INT(10),		-- fk:cd_id - entity type
cmd_entity_detail					 INT(10),		-- fk:cd_id - entity detail	- e.g. celebrity detail
CONSTRAINT unc_cmd_id UNIQUE (cmd_id)
)ENGINE = InnoDB;
create index idx_cmd_group_id on multiselect_metadata_detail(cmd_group_id) using BTREE;
-- cmd_id : 1
-- cmd_groud_id : 1
-- cmd_entity_type
-- cmd_entity_detail: 4




CREATE TABLE IF NOT EXISTS  content_metadata(
cm_id								 INT(10),		-- unique id per record
cm_vendor							 INT(10),		-- vendor will be central module
cm_content_type						 INT(10),		-- fk: cd_id e.g. property, wallpaper, video etc. (also video type)
cm_r_group_id						 INT(10),		-- fk:r_group_id
cm_title							VARCHAR(200),
cm_short_desc						VARCHAR(200),	-- short desc
cm_release_year						INT,			-- Release YEAR
cm_starts_from						DATETIME,		-- Agreement start date
cm_expires_on    					DATETIME,		-- Agreement end date
cm_property_id						 INT(10),		-- self join, will be null in case of content type is property 
cm_display_title					VARCHAR(200),	-- display title
cm_celebrity						 INT(10),		-- fk: cmd_group_id
cm_genre							 INT(10),		-- fk:cd_id - genre
cm_sub_genre						 INT(10),		-- fk:cd_id - sub genre
cm_protographer						 INT(10),		-- fk:cd_id 
cm_mood								 INT(10),		-- fk:cd_id
cm_language							 INT(10),		-- fk:cd_id	
cm_nudity							 INT(1),		-- yes /no
cm_parental_advisory				 INT(10),		-- fk:cd_id	
cm_location							 INT(10),		-- fk:cd_id
cm_festival_occasion				 INT(10),		-- fk:cd_id
cm_religion							 INT(10),		-- fk:cd_id
cm_cp_content_id					VARCHAR(40),	-- 3rd party cp content id
cm_content_duration					 INT(10),		-- in seconds
cm_singer							 INT(10),		-- fk:cd_id
cm_music_director					 INT(10),		-- fk:cd_id
cm_content_quality					 INT(10),		-- fk:cd_id (video quality)
cm_key_words						 INT(10),		-- fk: cmd_group_id
cm_raag_tal							 INT(10),		-- fk: cmd_group_id
cm_instruments						 INT(10),		-- fk: cmd_group_id
cm_long_description					VARCHAR(800),	-- long description
cm_mode								 INT(10),		-- fk:cd_id (single player / multiple player)
cm_is_app_store_purchase			 INT(1),		-- yes /no
cm_signature						VARCHAR(20),    -- unique id 
cm_state							 INT(10),		-- fk: cd_id - content state
cm_rank								int(1),			-- content rank
cm_is_active						int(1),			-- 0. active, 1. inactive content
cm_thumb_url						varchar(200),	-- thumb url 
cm_comment							varchar(200),	--  use for commenting
cm_live_on							datetime,		-- content live date
cm_created_on						datetime,
cm_created_by						varchar(50),
cm_modified_on						datetime,
cm_modified_by						varchar(50),
CONSTRAINT unc_con_meta_id UNIQUE (cm_id)

)ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS  content_template(
ct_id								 INT(10)	,	-- unique id per record
ct_group_id							 INT(10),		-- unique id per entity ( content type i.e. audio, video)
ct_param							 INT(10),		-- content template param e.g. width, height, codec etc.
ct_param_value						 VARCHAR(10),	-- required content param value
ct_is_mandatory						 INT(1),		-- yes /no
CONSTRAINT unc_ct_id UNIQUE (ct_id)
)ENGINE = InnoDB;
create index idx_ct_group_id on content_template(ct_group_id) using BTREE;

CREATE TABLE IF NOT EXISTS  content_files(
cf_id								 INT(10),		-- unique id per record
cf_cm_id							 INT(10),		-- fk:cm_id
cf_original_processed				 INT(1),		-- original / processed
cf_url_base							VARCHAR(200),	-- base resource locator
cf_url								VARCHAR(200),	-- base + url
cf_absolute_url						VARCHAR(400),	-- absolute url
cf_template_id						 INT(10),		-- fk:ct_group_id template id
FOREIGN KEY (cf_cm_id) REFERENCES catalogue_detail(cd_id),
FOREIGN KEY (cf_template_id) REFERENCES content_template(ct_group_id),
CONSTRAINT unc_cf_id UNIQUE (cf_id)
)ENGINE = InnoDB;


-- ------ Vendor will be central module  -----------

-- In content_metadata -> cm_vendor							 




                                 


