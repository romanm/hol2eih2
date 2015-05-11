package hol2eih1;

public class AppConfig {

	final static String configJsFileName = "config.json.js";

	//hol
//	final static String applicationFolderPfad	= "/home/hol2/server/hol2eih2/";
//	final static String urlDb = "jdbc:h2:file:/home/hol2/db-h2/db-hol2-eih/db-hol2-eih";
	//development
	final static String applicationFolderPfad	= "/home/roman/01_hol_2/01_hol2eih/hol2eih2/";
	final static String urlDb = "jdbc:h2:file:/home/roman/01_hol_2/db-h2/db-hol2-eih/db-hol2-eih";

//	final static String applicationFolderPfad	= "/home/roman/Documents/01_curepathway/work2/cuwy_sb2w_3_develop-w2/";
	final static String innerDbFolderPfad		= "src/main/webapp/db/";
	final static String innerOpenDbFolderPfad	= "src/main/webapp/cuwy/db/";
	final static String applicationResourcesFolderPfad	= applicationFolderPfad+"src/main/resources/";

	public final static String epicriseDbPrefix = "epicrise/epicrise_";

	public static String getEpicriseDbJsonName(int hId) { return epicriseDbPrefix+ hId+ ".json";}

}
