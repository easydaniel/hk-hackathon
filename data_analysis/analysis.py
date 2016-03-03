import requests
import sys
import json
import numpy
import progressbar
import time

class item:
	def __init__(self, name='null-item', id=-1):
		self.name = name
		self.id = id
		self.value = list()


if __name__ == '__main__':

	#const value for labels
	NAME_LABLE = 'name'
	VALUE_LABLE = 'china'

	#get json from api
	try :
		request_data = requests.get('http://140.113.89.72:1337/test?year=2015')
	except requests.exceptions.ConnectionError as err :
		print(err)
		sys.exit(0)
		
	all_data = request_data.json()

	#name-id mapping
	name_to_id = dict()
	items = list()

	#get items
	progress = progressbar.ProgressBar(len(all_data));
	id_now = 0
	for this_month in progress(all_data) :
		for this_item in this_month['data']:

			this_name = this_item[NAME_LABLE]
			this_value = this_item[VALUE_LABLE]

			if this_name in name_to_id :
				this_id = name_to_id[this_name]
				items[this_id].value.append(this_value)

			else :
				name_to_id[this_name] = id_now
				tmp_item = item(name=this_name, id =id_now )
				tmp_item.value.append(this_value)
				items.append(tmp_item)
				id_now += 1
	num = 0
	for i in iter(name_to_id):
		print(i)
		num += 1
	print(num)
