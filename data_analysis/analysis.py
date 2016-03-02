import urllib
import getpass
from pymongo import MongoClient
from pymongo import errors
import sys

if __name__ == '__main__':
	#connect mongodb
	#password_raw = getpass.getpass('Input password of db : ')
	#password_db = urllib.quote_plus(password_raw)

	try :
		db_client = MongoClient('mongodb://140.113.89.72',serverSelectionTimeoutMS=500)
		db_client.server_info()

	except errors.ServerSelectionTimeoutError as err :
		print(err)
		sys.exit(0)

	
