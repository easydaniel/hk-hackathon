import requests
from bs4 import BeautifulSoup

res = requests.get('http://www.censtatd.gov.hk/hkstat/sub/sp230_tc.jsp?productCode=D5220409')
soup = BeautifulSoup(res.text)
print(soup.prettify())
