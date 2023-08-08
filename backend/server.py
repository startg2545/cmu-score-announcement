from dotenv import load_dotenv, find_dotenv
from flask import Flask, jsonify, request
import os
import pprint
from pymongo import MongoClient
import json
from bson import json_util
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
        arr.append(x['data'])
    return parse_json(arr)


@app.route('/course-detail', methods=['POST'])
def insert_scores():
    return jsonify({"Result": "Received scores of subject " + request.json['courseNo'] + " successfully."})

if __name__ == '__main__':
    app.run(debug=True,port=3000)


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

# def update_person_by_id(person_id):
#     from bson.objectid import ObjectId

#     _id = ObjectId(person_id)

#     # all_updates = {
#     #     '$set': {'new_field': True},
#     #     '$rename': {'first': 'first_name', 'last': 'last_name'}
#     # }

#     # person_collection.update_one({'_id': _id}, all_updates)
#     # perosn_collection.update_one({'_id': _id}, {'$unset': {'new_field': ''}})

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
