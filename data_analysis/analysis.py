import requests
import sys
import json
import numpy
import progressbar
import time
import statistics

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

def relation(a,b):
	#correlatation = numpy.correlate(a,b)[0]
	#stdev_a = statistics.stdev(a)
	#stdev_b = statistics.stdev(b)
	#print(correlatation / (stdev_a * stdev_b * float(len(a)) ) )

	array_a = numpy.array(a)
	array_b = numpy.array(b)

	normalized_a = (array_a - statistics.mean(array_a)) / ( statistics.stdev(array_a) * len(array_a) )
	normalized_b = (array_b - statistics.mean(array_b)) / statistics.stdev(array_b)
	correlatation = numpy.correlate(normalized_a,normalized_b)[0]

	return correlatation

if __name__ == '__main__':

	#const value for labels
	NAME_LABLE = 'name'
	#value_lable = 'china'
	value_lable = raw_input()

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
	number_items = 0
	for this_month in progress(all_data) :
		for this_item in this_month['data'] :

			this_name = this_item[NAME_LABLE]
			try:
				this_value = float( this_item[value_lable] )
			except ValueError:
				try:
					this_value = float( this_item[value_lable].replace(',','') )
				except ValueError:
					this_value = -1

			if this_name in name_to_id :
				this_id = name_to_id[this_name]
				items[this_id].value.append(this_value)

			else :
				name_to_id[this_name] = number_items
				tmp_item = item(name=this_name, id =number_items )
				tmp_item.value.append(this_value)
				items.append(tmp_item)
				number_items += 1

	#do the interpolation to replace -1
	for this_item in items :
		this_item.interpolation()
		#print( this_item.name )
		#print( this_item.value )

	#do the relation
	progress = progressbar.ProgressBar(len(items))
	relation_map = list( list() )
	for a_item in progress(items):
		tmp_list = list()
		for b_item in items:
			tmp_list.append( relation(a_item.value, b_item.value) )

		relation_map.append(tmp_list)

	#output json
	output_json = list()
	for i in range(len(items)):
		for j in range(len(items)):
			a_item = items[i]
			b_item = items[j]
			tmp_dict = dict()
			tmp_dict["from"] = a_item.name
			tmp_dict["to"] = b_item.name
			tmp_dict["relation"] = relation_map[i][j]
			output_json.append(tmp_dict)

	print json.dumps(output_json)