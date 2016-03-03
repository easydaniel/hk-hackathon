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

	def interpolation(self):

		if self.value[0] < 0 :
			#find first non -1 element
			for v in self.value :
				if v > 0 :
					self.value[0] = v
					break

			if self.value[0] < 0 :
				self.value[0] = 0

		if self.value[ len(self.value)-1 ] < 0 :
			#find last non -1 element
			for v in reversed(self.value) :
				if v > 0 :
					self.value[ len(self.value)-1 ] = v
					break

		for i in range(len(self.value)):
			this_value = self.value[i]

			if this_value < 0:

				left = 0.0
				right = 0.0
				left_length = 0
				right_length = 0

				for v in self.value[i::-1] :
					left_length += 1
					if v > 0 :
						left = v
						break

				for v in self.value[i::1] :
					right_length += 1
					if v > 0 :
						right = v
						break

				self.value[i] = left * ( float(right_length) ) + right * ( float(left_length) )
				if float(right_length) + float(left_length) != 0 :
					self.value[i] /= float(right_length) + float(left_length)



if __name__ == '__main__':

	#const value for labels
	NAME_LABLE = 'name'
	VALUE_LABLE = 'china'

	#get json from api
	try :
		request_data = requests.get('http://140.113.89.72:1337/test')
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
		for this_item in this_month['data'] :

			this_name = this_item[NAME_LABLE]
			try:
				this_value = float( this_item[VALUE_LABLE] )
			except ValueError:
				this_value = -1

			if this_name in name_to_id :
				this_id = name_to_id[this_name]
				items[this_id].value.append(this_value)

			else :
				name_to_id[this_name] = id_now
				tmp_item = item(name=this_name, id =id_now )
				tmp_item.value.append(this_value)
				items.append(tmp_item)
				id_now += 1


	for this_item in items :
		this_item.interpolation()
		print( this_item.name )
		print( this_item.value )
