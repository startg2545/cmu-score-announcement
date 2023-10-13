# CMU Score Announcement
### Framework: ReactJS
### Database: MongoDB
### Uploader: Microsoft Excel
### IDE: up to you

### App main is located in "cmu-score-announcement/frontend/src/App.jsx"
### MongoDB is located in "cmu-score-announcement/backend/db/dbConnect.js"

# Let's get started
## Edit .env file
### Backend add database and domain links
### Frontend add API link
## Develop project at directory "cmu-score-announcement" by running command
## 1. run frontend
###   1.1) open first terminal
###   1.2) run ``` cd frontend ```
###   1.3) run ``` npm start ``` 
## 2. run backend
###   2.1) open second terminal
###   2.2) run ``` cd backend ```
###   2.3) run ``` npm run dev ```
## install nvm
``` $ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash ```
``` $ nvm install 18.18 ```
## install MongoDB by following link "https://www.cherryservers.com/blog/install-mongodb-ubuntu-22-04"
## Deploy project
### ``` $ sudo apt-get update ``` ### 
### ``` $ sudo apt-get upgrade ``` ### 
### ``` $ sudo npm install pm2 -g ``` ### 
### ``` $ cd frontend ``` ### 
### ``` $ npm install ``` ### 
### ``` $ npm run build ``` ### 
### ``` $ pm2 serve build 300 --name "frontend" --spa ``` ### 
### ``` $ cd ../backend ``` ### 
### ``` $ npm install ``` ### 
### ``` $ pm2 save ``` ### 
### ``` $ pm2 startup system ``` ### 
Developers
630615028 Newin Yamaguchu
640610638 Thanaporn Chanchanayothin
640610657 
640610666 Worapitcha Muangyot
640610672 
