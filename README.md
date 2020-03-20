# SupportCbusEats
 Files Related to mapping page for supportcolumbuseats.com

## How this program works

The program uses the SCE_DataManip.py code to read in the current csv and manipulate it to get the lat/long. The results are written to a flat file
This results file (SCE.txt) is read by the Shiny app (called App.R).  When this App.R file is placed onto a Shiny server it renders as an interactive map. 
Prototye results can be seen here:  http://13.59.132.88/SCE/  

## Future updates
### SCE_DataManip.py
1) Can this be updated to manually pull the spreadsheet in from airtable?  Not sure if airtable has an api or something we can use.
2) Parse the "Delivery Options" column in source data to create indicator columns.  The column is currently a string all the selected choices (ie "Direct from Restaurant ,GrubHub,Uber Eats") if it's parsed into unique Y/N values we can add them as a fitler on the mapping portion.  
3) Bug Fix - there's a return character getting added in the output file. I've backspaced over it for the sake of getting a prototype down but need to track that down and handle it.



