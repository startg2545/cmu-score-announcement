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
## install nvm
1. ``` $ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash ```
2. ``` $ nvm install 18.18 ```
## install MongoDB by following link 
https://www.cherryservers.com/blog/install-mongodb-ubuntu-22-04
## Deploy project
1. ``` $ sudo apt-get update ``` 
2. ``` $ sudo apt-get upgrade ``` 
3. ``` $ sudo npm install pm2 -g ``` 
4. ``` $ cd frontend ``` 
5. ``` $ npm install ``` 
6. ``` $ npm run build ``` 
7. ``` $ pm2 serve build 300 --name "frontend" --spa ``` 
8. ``` $ cd ../backend ``` 
9. ``` $ npm install ``` 
10. ``` $ pm2 save ``` 
11. ``` $ pm2 startup system ``` 
# Developers
- 630615028 Newin Yamaguchu
- 640610638 Thanaporn Chanchanayothin
- 640610657 Patrasorn Khantipongse
- 640610666 Worapitcha Muangyot
- 640610672 Switch Jaruekpoonpol
