import urllib
import getpass
from pymongo import MongoClient

if __name__ == '__main__':
	#connect mongodb
	password_raw = getpass.getpass('Input password of db : ')
	password_db = urllib.quote_plus(password_raw)

	db_client = MongoClient('mongodb://user:' + password_db + '@127.0.0.1')
