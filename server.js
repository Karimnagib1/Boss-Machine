const express = require('express');
const app = express();
const {createMeeting, getAllFromDatabase, getFromDatabaseById, addToDatabase, deleteFromDatabasebyId, deleteAllFromDatabase} = require('./server/db.js');
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
  const minions = getAllFromDatabase('minions');
  res.send(minions);
});

apiRouter.post('/minions/', (req, res, next) => {
  const newMinion = req.body;
  if (newMinion.salary && newMinion.title && newMinion.name && newMinion.weaknesses){
    newMinion.salary = Number(newMinion.salary);
    const newMinionWId = addToDatabase('minions', newMinion);
    res.status(201).send(newMinionWId);
  } else {
    res.status(400).send();
  }
});
apiRouter.get('/minions/:minionId/', (req, res, next) => {
  const minion = getFromDatabaseById('minions', req.params.minionId);
  if(minion){
    res.send(minion);
  } else {
    res.status(404).send();
  }
});
apiRouter.put('/minions/:minionId/', (req, res, next) => {
  let updatedMinion = req.body;
  if (updatedMinion.name && updatedMinion.title && updatedMinion.salary && updatedMinion.weaknesses){
    updatedMinion.salary = Number(updatedminion.salary);
    updatedMinion = updateInstanceInDatabase('minions', updatedMinion);
    if (updatedMinion){
      return res.status(201).send(updatedMinion);
    } 
  }
  res.status(404).send();
});
apiRouter.delete('/minions/:minionId/', (req, res, next) => {
  const id = Number(req.params.minionId);
  const deleted = deleteFromDatabasebyId('minions', id);
  if (deleted) {
    res.status(200).send();
  } else {
    res.status(404).send();
  }
});
// Routes for api/ideas/

apiRouter.get('/ideas/', (req, res, next) => {
  const ideas = getAllFromDatabase('ideas');
  res.send(ideas);
});

apiRouter.post('/ideas/', (req, res, next) => {
  const newIdea = req.body;
  if (newIdea.name && newIdea.description && newIdea.weeklyRevenue && newIdea.numWeeks){
    newIdea.numWeeks = Number(newIdea.numWeeks);
    newIdea.weeklyRevenue = Number(newIdea.weeklyRevenue);
    const newIdeaWId = addToDatabase('ideas', newIdea);
    res.status(201).send(newIdeaWId);
  } else {
    res.status(400).send();
  }
});
apiRouter.get('/ideas/:ideaId/', (req, res, next) => {
  const idea = getFromDatabaseById('ideas', req.params.ideaId);
  if(idea){
    res.send(idea);
  } else {
    res.status(404).send();
  }
});
apiRouter.put('/ideas/:ideaId/', (req, res, next) => {
  let updatedIdea = req.body;
  if (updatedIdea.name && updatedIdea.description && updatedIdea.weeklyRevenue && updatedIdea.numWeeks){
    updatedIdea.weeklyRevenue = Number(updatedIdea.weeklyRevenue);
    updatedIdea.numWeeks = Number(updatedIdea.numWeeks);
    updatedIdea = updateInstanceInDatabase('ideas', updatedIdea);
    if (updatedIdea){
      return res.status(201).send(updatedIdea);
    } 
  }
  res.status(404).send();
});
apiRouter.delete('/ideas/:ideaId/', (req, res, next) => {
  const id = Number(req.params.ideaId);
  const deleted = deleteFromDatabasebyId('ideas', id);
  if (deleted) {
    res.status(200).send();
  } else {
    res.status(404).send();
  }
});

// Routes for api/meetings

apiRouter.get('/meetings/', (req, res, next)=> {
  const meetings = getAllFromDatabase('meetings');
  res.send(meetings);
});
apiRouter.post('/meetings/', (req, res, next) => {
  const newMeeting = createMeeting();
  res.send(newMeeting);
});
apiRouter.delete('/meetings/', (req, res, next) => {
  deleteAllFromDatabase('meetings');
  res.status(200).send();
});


// This conditional is here for testing purposes:
if (!module.parent) { 
  // Add your code to start the server listening at PORT below:
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}