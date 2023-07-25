from dotenv import load_dotenv, find_dotenv
import os
from pymongo import MongoClient
load_dotenv(find_dotenv())

password = os.environ.get("MONGODB_PWD")

connection_string = f"mongodb+srv://startg2545:{password}@scoreannouncement.mbqoijf.mongodb.net/?retryWrites=true&w=majority"
myclient = MongoClient(connection_string)

dbs = myclient.list_database_names()
mydb = myclient["test"]
mycol = mydb["test"]

def setCourseGrade(courseNo, grade, semaster, year):
    mydict = {
        "courseNo": courseNo,
        "grade": grade,
        "semaster": semaster,
        "year": year
    }
    x = mycol.insert_one(mydict)