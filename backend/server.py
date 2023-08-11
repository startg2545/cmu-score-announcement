from dotenv import load_dotenv, find_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import pprint
from pymongo import MongoClient
import json
<<<<<<< HEAD
from bson import json_util, ObjectId
=======
from bson import json_util
from api.cmuOAuth import cmuOAuth_api
from api.user import user_api
from api.course import course_api
>>>>>>> b524893028f060638a793b793ebe68ac127b9ae7

load_dotenv(find_dotenv())  # load environment variable files

password = os.environ.get("MONGODB_PWD")

connection_string = f"mongodb+srv://startg2545:{password}@scoreannouncement.mbqoijf.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(connection_string)

dbs = client.list_database_names()  # get all database
# create database calls score_announcement
score_announcement = client.score_announcement
scores = score_announcement.scores  # create colleciton calls scores

prefix = '/api/v1'

app = Flask(__name__)
cors = CORS(app, origins="http://localhost:3000", supports_credentials='true')

app.url_map.strict_slashes = False

app.register_blueprint(cmuOAuth_api, url_prefix = prefix + '/cmuOAuth')
app.register_blueprint(user_api, url_prefix = prefix + '/user')
app.register_blueprint(course_api, url_prefix = prefix + '/course')


def parse_json(data):
    return json.loads(json_util.dumps(data))


@app.route('/course-detail', methods=['GET'])
def get_score_detail():
    arr = []
    for x in scores.find():
        arr.append(x)
    return parse_json(arr)


@app.route('/course-detail', methods=['POST'])
def insert_score():
    my_request = request.json
    obj = {
        'scoreName': my_request['details'][0]['scoreName'],
        'studentNumber': my_request['details'][0]['studentNumber'],
        'fullName': my_request['details'][0]['fullScore'],
        'isDisplayMean': my_request['details'][0]['isDisplayMean'],
        'mean': my_request['details'][0]['mean'],
        'results': my_request['details'][0]['results']
    }

    existing_scores = []
    for x in scores.find():
        existing_scores.append(x)
    is_found = False
    for data in existing_scores:
        #  find duplicated scores
        if data['courseNo'] == my_request['courseNo'] and data['section'] == my_request['section'] and data['semaster'] == my_request['semaster'] and data['year'] == my_request['year']:
            # find _id of mongodb to insert score in section
            scores.update_one(
                { 'courseNo': "001201" },
                { '$push': { 'details': obj } }
            )
            is_found = True  # duplicated course has been found
            print(f"New score has been added in {my_request['courseNo']}, section {my_request['section']}, {my_request['semaster']}/{my_request['year']}")
    if not is_found:  # inseart score in new course/section/semaster/year
        scores.insert_one(my_request)
        print(f"New score has been added in {my_request['courseNo']} which is a new course!")

    return jsonify({"Result": "Received scores of subject " + my_request['courseNo'] + " successfully."})



if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1')

# notification = client.notification
# person_collection = notification.person_collection

# def create_documents():
#     instructor_id = ['61a82ed2e1d2b69f983664ee', '61a82ed2e1d2b69f983664f5', '61a82ed2e1d2b69f983664fa']
#     first_name = ['Pruet', 'Kasemsit', 'Karn']
#     last_name = ['Boonma', 'Teeyapan', 'Patanukhom']

#     docs = []

#     for instructor_id, first_name, last_name in zip(instructor_id, first_name, last_name):
#         doc = {'instructor_id': instructor_id, 'first_name': first_name, 'last_name': last_name}
#         docs.append(doc)
#     person_collection.insert_many(docs)

# printer = pprint.PrettyPrinter()

# def find_all_people():
#     people = person_collection.find()

#     for person in people:
#         printer.pprint(person)

# def find_pruet():
#     pruet = person_collection.find_one({'first_name': 'Pruet'})
#     printer.pprint(pruet)

# def count_all_people():
#     # SELECT COUNT(*) FROM person
#     count = person_collection.find().count()
#     print('Number of people', count)

# def get_person_by_id(person_id):
#     # SELECT * FROM person WHERE id = person_id
#     from bson.objectid import ObjectId

#     _id = ObjectId(person_id)
#     person = person_collection.find_one({'_id': _id})
#     printer.pprint(person)

# def project_columns():
#     columns = {'_id': 0, 'first_name': 1, 'last_name': 1}
#     people = person_collection.find({}, columns)
#     for person in people:
#         printer.pprint(person)

# def replace_one(person_id):
#     from bson.objectid import ObjectId
#     _id = ObjectId(person_id)

#     new_doc = {
#         'first_name': 'new first name',
#         'last_name': 'new last name',
#         'instructor_id': 'new instructor id'
#     }

#     person_collection.replace_one({'_id': _id}, new_doc)

# def delete_doc_by_id(person_id):
#     from bson.objectid import ObjectId
#     _id = ObjectId(person_id)
#     person_collection.delete_one({'_id': _id})

# delete_doc_by_id('64cf51b3d4e30867e34098f7')
