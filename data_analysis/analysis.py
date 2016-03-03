import requests
import sys
import json
import numpy
import progressbar
import time

if __name__ == '__main__':

	#get json from api
	try :
		request_data = requests.get('http://140.113.89.72:1337/test')
	except requests.exceptions.ConnectionError as err :
		print(err)
		sys.exit(0)
		
	all_data = request_data.json()

	#calculating
	progress = progressbar.ProgressBar( len(all_data[0]['data']) )
	for set in progress(all_data[0]['data']):
		time.sleep(0.1)
	