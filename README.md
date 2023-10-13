# CMU Score Announcement
### Framework: ReactJS
### Database: MongoDB
### Uploader: Microsoft Excel
### IDE: up to you

### App main is located in "cmu-score-announcement/frontend/src/App.jsx"
### MongoDB is located in "cmu-score-announcement/backend/db/dbConnect.js"

# Let's get started
## Please do the following steps before you start
### Frontend Part
1. Run ``` cd frontend ``` to access frontend directory
2. Run ``` npm install ``` to install node modules
3. Update the .env file
4. Run ``` npm start ``` to develop project
### Backend Part
1. Run ``` cd backend ``` to access backend directory
2. Run ``` npm install ``` to install node modules
3. Update the .env file
4. Run ``` npm run dev ``` to run backend system
## Deploy project
```
$ sudo apt-get update
$ sudo apt-get upgrade
```
### install nvm
```
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
$ nvm install 18.18
```
### install MongoDB by following link 
https://www.cherryservers.com/blog/install-mongodb-ubuntu-22-04
### Edit file
- Backend
    - `.env` add database and domain links
    - `app.js` edit cors origin
- Frontend
    - `.env` add API link
### install pm2 
```
$ sudo npm install pm2 -g
```
### run app
```
$ cd frontend 
$ npm install 
$ npm run build 
$ pm2 serve build 300 --name "frontend" --spa 
$ cd ../backend 
$ npm install 
$ pm2 start npm --name "backend" -- start 
$ pm2 save 
$ pm2 startup system
```
# Developers
- 630615028 Newin Yamaguchu
- 640610638 Thanaporn Chanchanayothin
- 640610657 Patrasorn Khantipongse
- 640610666 Worapitcha Muangyot
- 640610672 Switch Jaruekpoonpol
