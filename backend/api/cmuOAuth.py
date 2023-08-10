from flask import Blueprint, request, make_response, json
import os
import requests
import jwt
import datetime

cmuOAuth_api = Blueprint('cmuOAuth_api', __name__)

def get_CMU_basic_info(accessToken):
  resp = requests.get(os.environ.get("CMU_OAUTH_GET_BASIC_INFO"),
    headers={'Authorization': "Bearer " + accessToken }
  )
  return resp

@cmuOAuth_api.route("/", methods=['POST'])
def get_token():
  # validate code
  if type(request.args.get('code')) is not str:
    return {
      'ok': False,
      'message': "Invalid authorization code"
    }, 400

  # get access token
  resp = requests.post(
    os.environ.get("CMU_OAUTH_GET_TOKEN_URL"),
    {},
    params={
      'code': request.args.get('code'),
      'redirect_uri': request.args.get('redirect_uri'),
      'client_id': request.args.get('client_id'),
      'client_secret': request.args.get('client_secret'),
      'grant_type': "authorization_code",
    },
    headers={
      "content-type": "application/x-www-form-urlencoded",
    },
  )
  if not resp:
    return {
      'ok': False,
      'message': "Cannot get OAuth access token"
    }, 400
  
  #get basic info
  resp2 = get_CMU_basic_info(resp.json().get('access_token'))
  if not resp2:
    return {
      'ok': False,
      'message': "Cannot get cmu basic info"
    }, 400

  #create session
  token = jwt.encode(
    payload={
      'cmuAccount': resp2.json().get('cmuitaccount'),
      'firstName': resp2.json().get('firstname_EN'),
      'lastName': resp2.json().get('lastname_EN'),
      'studentId': resp2.json().get('student_id') if resp2.json().get('student_id') else None, #Note that not everyone has this. Teachers and CMU Staffs don't have student id!
      'itAccountType': resp2.json().get('itaccounttype_id'),
      'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24),
    },
    key=os.environ.get("JWT_SECRET"),
    algorithm="HS256",
  )
  
  res = make_response()
  res.set_cookie(
    key="token",
    value=token,
    max_age=3600*24,
    httponly=True,
    samesite='lax',
    secure=os.environ.get("NODE_ENV") == "production",
    path="/",
    domain=os.environ.get("DOMAIN"),
  )
  res.status_code = 200
  res.set_data(value=json.dumps({
        'itaccounttype_id': resp2.json().get('itaccounttype_id'),
        'accessToken': resp.json().get('access_token'),
        'token': token,
      }))
  
  return res
    