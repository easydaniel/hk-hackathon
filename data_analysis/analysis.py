import requests
import sys
import json

if __name__ == '__main__':

	#get json from api
	try :
		request_data = requests.get('http://140.113.89.72:1337/test')
	except requests.exceptions.ConnectionError as err :
		print(err)
		sys.exit(0)
		
	print(request_data.json())

	