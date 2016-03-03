import requests
from bs4 import BeautifulSoup
import xlrd
import json
import os
import re
import time


def parse_excel(filename):
    print('Start parsing...')

    mydata = {}
    date = re.findall('\d+', filename)
    mydata['year'] = date[0]
    mydata['month'] = date[1].zfill(2)

    data = []

    workbook = xlrd.open_workbook(filename)
    table_china = workbook.sheets()[1]
    table_america = workbook.sheets()[2]

    data.append({
        "name": table_china.row_values(4)[0],
        "china": table_china.row_values(4)[2],
        "america": table_america.row_values(4)[2],
    })

    print(data)
    for i in range(5, table_china.nrows - 3):
        data.append({
            "name": table_china.row_values(i)[1],
            "china": table_china.row_values(i)[2],
            "america": -1
        })

    for i in range(5, table_america.nrows - 3):
        if (any(d['name'] == table_america.row_values(i)[1] for d in data )):
            for d in data:
                if (d['name'] == table_america.row_values(i)[1]):
                    d['america'] = table_america.row_values(i)[2]
                    break
        else:
            data.append({
                "name": table_america.row_values(i)[1],
                "china": -1,
                "america": table_america.row_values(i)[2]
            })
    mydata['data'] = json.dumps(data)
    print('Data parse done!')
    print('Inserting to database...')
    # print(mydata['data'])
    res = requests.post('http://localhost:1337/test', data=mydata)
    print(res)


def update():
    print('Start downloading...')
    res = requests.get('http://www.censtatd.gov.hk/hkstat/sub/sp230_tc.jsp?productCode=D5220409')
    soup = BeautifulSoup(res.text, 'html.parser')

    # for div in soup.select('.productbottomtabletitle'):
    #     link = div.select('a')[0]['href'];
    #     filename = re.sub("[\(\)]", '', re.search("\(.*\)", div.select('a')[0].text).group()) + '.xls'
    #     fileUrl = 'http://www.censtatd.gov.hk' + link
    #     # print(link, filename, fileUrl)
    #     with open(filename, 'wb') as f:
    #         f.write(requests.get(fileUrl).content)
    #     parse_excel(filename)
    #     os.remove(filename)
    # return
    
    link = soup.select('.productbottomtabletitle')[0].select('a')[0]['href']
    filename = re.sub("[\(\)]", '', re.search("\(.*\)", soup.select('.productbottomtabletitle')[0].select('a')[0].text).group()) + '.xls'
    fileUrl = 'http://www.censtatd.gov.hk' + link

    with open(filename, 'wb') as f:
        f.write(requests.get(fileUrl).content)
    parse_excel(filename)
    os.remove(filename)
    print('Done!')

if __name__ == '__main__':
    update()
