{
	"dbVersionUpdateList" : [ {
"dbVersionId" : 0, "sqls" : [
"CREATE TABLE if not exists dbversion (dbversion_ID INT(10) NOT NULL, dbversion_date timestamp default now(), primary key (dbversion_id))"
,"CREATE SEQUENCE if not exists dbid" 
]},{
	"dbVersionId" : 1, "sqls" : [
"create table  if not exists  epicrise1 ( epicrise_id int default (NEXT VALUE FOR dbid) , primary key (epicrise_id) ,epicrise_hol1_hid int not null unique ,epicrise_self clob)"
]}
	]
}
