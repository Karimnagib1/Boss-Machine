const express = require('express');
const app = express();
const {createMeeting} = require('./server/db.js');
module.exports = app;

/* Do not change the following line! It is required for testing and allowing
*  the frontend application to interact as planned with the api server
*/
const PORT = process.env.PORT || 4001;

// Add middleware for handling CORS requests from index.html
const cors = require('cors');
app.use(cors());

// Add middware for parsing request bodies here:
const bodyParser = require('body-parser');
app.use(bodyParser.json());


// Mount your existing apiRouter below at the '/api' path.
const apiRouter = require('./server/api');
app.use('/api', apiRouter);

//id counter for minions and ideas
let nextMinionId = 0,  nextIdeaId = 0;

// Routes for api/minions/
apiRouter.get('/minions/', (req, res, next) => {

});

apiRouter.post('/minions/', (req, res, next) => {
  const newMinion = req.body;
  
});
apiRouter.get('/minions/:minionId/', (req, res, next) => {

});
apiRouter.put('/minions/:minionId/', (req, res, next) => {

});
apiRouter.delete('/minions/:minionId/', (req, res, next) => {

});
// Routes for api/ideas/

apiRouter.get('/ideas/', (req, res, next) => {

});

apiRouter.post('/ideas/', (req, res, next) => {

});
apiRouter.get('/ideas/:ideaId/', (req, res, next) => {

});
apiRouter.put('/ideas/:ideaId/', (req, res, next) => {

});
apiRouter.delete('/ideas/ideaId/', (req, res, next) => {

});

// Routes for api/meetings

apiRouter.get('/meetings/', (req, res, next)=> {

});
apiRouter.post('/meetings/', (req, res, next) => {
  createMeeting()
});
apiRouter.delete('/meetings/', (req, res, next) => {

});


// This conditional is here for testing purposes:
if (!module.parent) { 
  // Add your code to start the server listening at PORT below:
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}