import requests
from bs4 import BeautifulSoup
import xlrd


filename = 'file.xls'
# res = requests.get('http://www.censtatd.gov.hk/hkstat/sub/sp230_tc.jsp?productCode=D5220409')
# soup = BeautifulSoup(res.text)
# data_url = 'http://www.censtatd.gov.hk' + soup.select('.productbottomtabletitle a')[0]['href']
# print('Fetching...', data_url)
# with open(filename, 'wb') as file:
#     res = requests.get(data_url)
#     file.write(res.content)
#     print('File Downloaded: ', filename)


data = xlrd.open_workbook(filename)
table = data.sheet_by_index(1)
for i in range(table.nrows):
    print(table.row_values(i))
