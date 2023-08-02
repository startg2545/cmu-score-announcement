from dotenv import load_dotenv, find_dotenv
import os
from pymongo import MongoClient
load_dotenv(find_dotenv())

password = os.environ.get("MONGODB_PWD")

connection_string = f"mongodb+srv://startg2545:{password}@scoreannouncement.mbqoijf.mongodb.net/?retryWrites=true&w=majority"
myclient = MongoClient(connection_string)

dbs = myclient.list_database_names()
mydb = myclient["score_announcement"]

studentGrades = [
    {
        "studentId": 630615028,
        "grade": 'B',
        "comment": 'Very Handsome'
    },
    {
        "studentId": 630615035,
        "grade": 'C',
        "comment": 'Very Handsome'
    },
    {
        "studentId": 630615024,
        "grade": 'D',
        "comment": 'Very Handsome'
    },
]

def addCourseSection(courseNo, section, semaster, year, studentGrades):
    mycol = mydb["course_grade"]
    sections = [
        {
            "section": section,
            "grades": studentGrades
        }
    ]
    courseGrade = {
        "courseNo": courseNo,
        "sections": sections,
        "semaster": semaster,
        "year": year
    }
    myquery = { "courseNo": 269491 }
    newvalues = { "$set": { "sections": sections } }
    mycol.update_one(myquery, newvalues)
    
    # for x in mycol.find():
    #     if x["courseNo"] == courseNo and x["semaster"] == semaster and x["year"] == year:
    #         for x in x["sections"]:
    #             if x["section"] == section:
    #                 query = { "courseNo": courseNo }
    #                 mycol.delete_one(query)
    #                 mycol.insert_one(courseGrade)
    #                 isReplaced = True
    #                 print("data is replaced.")

addCourseSection(269491, 1, 1, 2566, studentGrades)