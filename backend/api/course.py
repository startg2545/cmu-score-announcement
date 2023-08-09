from flask import *
import os
import requests
import jwt

course_api = Blueprint('course_api', __name__)

@course_api.route("/detail", methods=['GET'])
def get_course_detail():
  try:
    token = request.cookies.get('token', type=str)
    
    decoded = jwt.decode(token, key=os.environ.get("JWT_SECRET"), algorithms="HS256")
    if decoded['cmuAccount'] == None:
      return { 'ok': False, 'message': "Invalid token" }, 403
    
    resp = requests.get(
      os.environ.get("URL_PATH_CPE")+'/course/detail',
      headers={ 'Authorization': "Bearer " + os.environ.get("TOKEN_API_CPE") },
    )
    resp.status_code = 200
  
    return resp.json()
  except:
    return { 'ok': False, 'message': "Invalid token" }, 401