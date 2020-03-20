import requests
import json
import pprint as pp
import pandas as pd
import time
import os

apikey = ' XXXXXXXXXX  '

#Read in the file downloaded from the supportcolumbuseats site
locations = pd.read_csv('C:\\Users\\adsmith\\Documents\\GitHub\\SupportColumbusEats\\Main_View.csv')


#Iterate across the file by row to parse out the address info and process.
outputlist = []
for index,row in locations.iterrows():
    name = str(row['Name'])
    status = str(row['Status'])
    menu = str(row['Menu'])
    district = str(row['District'])
    street= str(row['Street Address'])
    city = str(row['City'])
    state = 'OH'
    zipcode = str(row['Zip'])
    phnnbr = str(row['Phone Number'])
    website = str(row['Website'])
    howorder = str(row['How To Order'])
    delivopt = str(row['Delivery Options'])
    pickupopt = str(row['Pickup Options'])
    phoneord = str(row['Accepting Future Orders'])
    phoneorddet = str(row['If Accepting Future Orders, provide details']).replace('\n',' ')
    giftcard = str(row['Selling Gift Cards?'])
    limmenu = str(row['Limited or special menu?'])
    
    #Create the api version of the address
    outline = street + '+' + city + '+' + state + '+' +zipcode
    apiline = outline.replace(' ', '+')
    #print (apiline)
    
    #Hit the Google URL and get results  
    url = 'https://maps.googleapis.com/maps/api/geocode/json?address='+apiline+'&key='+ apikey
    #print (url)
    results = requests.get(url)
    jsonresults = results.json()
    lat = jsonresults["results"][0]["geometry"]["location"]["lat"]
    lng = jsonresults["results"][0]["geometry"]["location"]["lng"]
    
    
    #Reconsolidate data
    outrow = (name, status, menu, district, street, city, state, zipcode, phnnbr, website, howorder, delivopt, pickupopt, 
              phoneord, phoneorddet, giftcard, limmenu, str(lat), str(lng) )
      
    outline = '|'.join(outrow)+'\n'
    #print (outline)
    outputlist.append(outline)
    time.sleep (5)
    

###Delete any existing output and replace with the data generated above.
filename = 'SCE.txt'
filelocation = "C:\\Users\\adsmith\\Documents\\GitHub\\SupportColumbusEats\\"
filepath = str(filelocation)+str(filename)            
try:
    os.remove(filepath)
except OSError:
    pass
for outline in outputlist:    
    print (outline)
    f=open(filepath, 'a', encoding='utf-8')
    f.write("%s" % outline)
    f.close()