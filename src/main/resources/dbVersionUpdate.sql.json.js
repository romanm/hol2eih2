{
	"dbVersionUpdateList" : [ {
	"dbVersionId" : 0, "sqls" : [
	"CREATE TABLE if not exists dbversion (dbversion_ID INT(10) NOT NULL, dbversion_date timestamp default now(), primary key (dbversion_id))"
	,"CREATE SEQUENCE if not exists dbid" 
]},{
	"dbVersionId" : 1, "sqls" : [
	"CREATE TABLE  IF NOT EXISTS  epicrise1 ( epicrise_id INT DEFAULT (NEXT VALUE FOR dbid) , PRIMARY KEY (epicrise_id) ,epicrise_hol1_hid INT NOT NULL UNIQUE ,epicrise_self CLOB)"
]},{
	"dbVersionId" : 2, "sqls" : [
	"ALTER TABLE history1 ADD COLUMN hol1_history_id INT NOT NULL"
	,"ALTER TABLE history1 ADD CONSTRAINT hol1_history_id_unique UNIQUE(hol1_history_id)"
]},{
	"dbVersionId" : 3, "sqls" : [
	"DELETE from history1"
	,"INSERT INTO history1 (history_id, hol1_history_id) SELECT epicrise_id, epicrise_hol1_hid FROM epicrise1"
	,"ALTER TABLE EPICRISE1 ADD COLUMN history_id INT"
	,"UPDATE epicrise1 SET history_id = epicrise_id" 
	,"ALTER TABLE epicrise1 ADD CONSTRAINT history_id FOREIGN KEY (history_id) REFERENCES history1(history_id)"
	,"ALTER TABLE epicrise1 ALTER COLUMN history_id SET NOT NULL"
]},{
	"dbVersionId" : 4, "sqls" : [
	"ALTER TABLE epicrise1 DROP COLUMN epicrise_hol1_hid"
]}
	]
}
