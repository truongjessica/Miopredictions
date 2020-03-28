This command uses a csv that is turned into an array of json to be inserted into firestore 

Note that firebase will cause migration to fail if the file is too big, so an alternative solution may be neccessary & plus firebase has a cap on free storage; However, this is a good start for finding average

npm install -g typescript
then leave and come back to vscode,

npm i
--collection refers to the collection you wish to name it as
--Src is the location of the csv
--ICouldntSleep is my personal command will change soon


-----
To Run the code 

tsc  && npm link
IcouldntSleep --src csv/NAMEOFCSV.csv --collection NAMEOFCOLLECTION



-----
example: 
ICouldntSleep --src min_csv/1.csv --collection DorchesterRoadandHuronChurchRoad_tmc_data_test_min

You only need to run tsc && npm link after every change, if you havent edited the code, dont bother