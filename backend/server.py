from dotenv import load_dotenv, find_dotenv
from flask import Flask, jsonify, request
import os
from pymongo import MongoClient
import json
from bson import json_util, ObjectId

load_dotenv(find_dotenv())  # load environment variable files

password = os.environ.get("MONGODB_PWD")

connection_string = f"mongodb+srv://startg2545:{password}@scoreannouncement.mbqoijf.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(connection_string)

dbs = client.list_database_names()  # get all database
score_announcement = client.score_announcement  # create database calls score_announcement
scores = score_announcement.scores  # create colleciton calls scores

app = Flask(__name__)

def parse_json(data):
    return json.loads(json_util.dumps(data))

@app.route('/course-detail', methods=['GET'])
def get_score_detail():
    arr = []
    for x in scores.find():
        arr.append(x)
    return parse_json(arr)

def get_myrequest_obj(req):
    obj = {
        'scoreName': req['details'][0]['scoreName'],
        'studentNumber': req['details'][0]['studentNumber'],
        'fullName': req['details'][0]['fullScore'],
        'isDisplayMean': req['details'][0]['isDisplayMean'],
        'mean': req['details'][0]['mean'],
        'results': req['details'][0]['results']
    }
    return obj

@app.route('/course-detail', methods=['POST'])
def insert_score():
    myrequest = request.json
    obj = get_myrequest_obj(myrequest)

    existing_scores = []
    for x in scores.find():
        existing_scores.append(x)
    is_found = False
    for data in existing_scores:  #  find duplicated scores
        if data['courseNo'] == myrequest['courseNo'] and data['section'] == myrequest['section'] and data['semester'] == myrequest['semester'] and data['year'] == myrequest['year']:  # find _id of mongodb to insert score in section
            scores.update_one(
                { '_id': ObjectId(data['_id']) },
                { '$push': { 'details': obj } }
            )
            is_found = True  # duplicated course has been found
    if not is_found:  # inseart score in a new course, section, semester, year
        scores.insert_one(myrequest)

    return jsonify({"Result": "Received scores of subject " + myrequest['courseNo'] + " successfully."})


if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1')