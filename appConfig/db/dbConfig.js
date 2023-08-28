/**
 * Created by pc on 2018/1/24.
 */

const mysqlConfig = {
	installBatPath: process.cwd() + '/db/mysql/install.bat',
	unstallBatPath: process.cwd() + '/db/mysql/unstall.bat',
	mysql: {
		host: '127.0.0.1',
		user: 'root',
		password: 'root',
		database: 'eedb', // 数据库名
		port: 3306,
		multipleStatements: true,
	},
	userSql: {
		insertUser: 'INSERT INTO User(uid,userName) VALUES(?,?)',
		queryUser: 'SELECT * FROM User',
		getUserById: 'SELECT * FROM User WHERE uid = ? ',
		query_table: 'SELECT :countsRows * FROM :tableName WHERE :whereCondition :orderCondition',
		update_table: 'update :tableName set :updateCondition WHERE :whereCondition',
		replace_table: 'REPLACE into :tableName VALUES :valuesCondition WHERE :whereCondition',
		delete_table: 'delete from :tableName WHERE :whereCondition',
	},
};

module.exports = {
	mysqlConfig,
};
