from flask import Blueprint, request, make_response, json
import os
import jwt

user_api = Blueprint('user_api', __name__)

@user_api.route("/", methods=['GET'])
def get_user_info():
  try:
    token = request.cookies.get('token', type=str)
    
    decoded = jwt.decode(token, key=os.environ.get("JWT_SECRET"), algorithms="HS256")
    if decoded['cmuAccount'] == None:
      return { 'ok': False, 'message': "Invalid token" }, 403
    
    return {
      'ok': True,
      'userInfo': {
        'cmuAccount': decoded['cmuAccount'],
        'firstName': decoded['firstName'],
        'lastName': decoded['lastName'],
        'studentId': decoded['studentId'],
        'itAccountType': decoded['itAccountType'],
      },
    }, 200
  except:
    return { 'ok': False, 'message': "Invalid token" }, 401
  
@user_api.route("/signOut", methods=['POST'])
def sign_out():
  res = make_response()
  res.delete_cookie(
    key="token",
    path="/",
    domain=os.environ.get("DOMAIN"),
  )
  res.status_code = 200
  res.set_data(value=json.dumps({ 'ok': True }))
  
  return res