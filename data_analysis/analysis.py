import urllib
import getpass
from pymongo import MongoClient
from pymongo import errors
import sys

if __name__ == '__main__':
	#connect mongodb

	try :
		client_db = MongoClient('mongodb://140.113.89.72',serverSelectionTimeoutMS=500)
		client_db.server_info()

	except errors.ServerSelectionTimeoutError as err :
		print(err)
		sys.exit(0)

	#find the database is not named 'local'
	for name in client_db.database_names():
		if name != 'local':
			database = client_db[name]
			break

	#get data from name_database
	for name in database.collection_names():
		print(name)