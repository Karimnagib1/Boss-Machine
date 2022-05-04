const express = require('express');
const app = express();
const checkMillionDollarIdea = require('./server/checkMillionDollarIdea.js');
const {createMeeting, getAllFromDatabase, getFromDatabaseById, addToDatabase, deleteFromDatabasebyId, deleteAllFromDatabase, updateInstanceInDatabase} = require('./server/db.js');
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
  newMinion.salary = Number(newMinion.salary);
  const newMinionWId = addToDatabase('minions', newMinion);
  if (newMinionWId){
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
  updatedMinion.salary = Number(updatedMinion.salary);
  updatedMinion = updateInstanceInDatabase('minions', updatedMinion);
  if (updatedMinion){
    return res.status(201).send(updatedMinion);
  } else {
    res.status(404).send();
  }
});

apiRouter.delete('/minions/:minionId/', (req, res, next) => {
  const id = req.params.minionId
  const deleted = deleteFromDatabasebyId('minions', id);
  if (deleted) {
    res.status(204).send();
  } else {
    res.status(404).send();
  }
});

// Routes for api/minions/:minionId/work
apiRouter.get('/minions/:minionId/work', (req, res, next) => {
  const minionId = req.params.minionId;
  const works = getAllFromDatabase('work');
  const work = works.filter( work => {
    return work.minionId === minionId;
  })
  if (work.length > 0) {
    return res.status(200).send(work);
  }
  res.status(404).send();
});

apiRouter.post('/minions/:minionId/work', (req, res, next) => {
  let work  = req.body;
  if(work.minionId !== req.params.minionId){
    return res.status(400).send();
  }
  let minions = getAllFromDatabase('minions');
  const minion = minions.find( minion => {
    return minion.id === req.params.minionId;
  });
  if (minion){
    work = addToDatabase('work', work);
    res.status(201).send(work);
  } else {
    res.status(404).send();
  }
  
});

apiRouter.put('/minions/:minionId/work/:workId', (req, res, next) => {
  const work = req.body;
  const minions = getAllFromDatabase('minions');
  
  if(isNaN(Number(req.params.workId))){
    return res.status(404).send();
  }
  let foundMinion = minions.find(minion => {
    return minion.id === work.minionId;
  });
  if (!foundMinion){
    return res.status(400).send();
  }
  const updatedWork = updateInstanceInDatabase('work', work);
  if (updatedWork){
    res.status(200).send(updatedWork);
  }else {
    res.status(404).send();
  }
});

apiRouter.delete('/minions/:minionId/work/:workId', (req, res, next) => {
  const deleted = deleteFromDatabasebyId('work', req.params.workId);
  if (deleted){
    res.status(204).send();
  } else {
    res.status(404).send();
  }
});

// Routes for api/ideas/

apiRouter.get('/ideas/', (req, res, next) => {
  const ideas = getAllFromDatabase('ideas');
  res.send(ideas);
});

apiRouter.post('/ideas/',checkMillionDollarIdea, (req, res, next) => {
  const newIdea = req.body;
  newIdea.numWeeks = Number(newIdea.numWeeks);
  newIdea.weeklyRevenue = Number(newIdea.weeklyRevenue);
  const newIdeaWId = addToDatabase('ideas', newIdea);
  if (newIdeaWId){
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
  updatedIdea = updateInstanceInDatabase('ideas', updatedIdea);

  if (updatedIdea){
    return res.status(201).send(updatedIdea);
  } else {
    res.status(404).send();
  }
});

apiRouter.delete('/ideas/:ideaId/', (req, res, next) => {
  const id = req.params.ideaId;
  const deleted = deleteFromDatabasebyId('ideas', id);
  if (deleted) {
    res.status(204).send();
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
  let newMeeting = createMeeting();
   newMeeting = addToDatabase('meetings', newMeeting);
  res.status(201).send(newMeeting);
});
apiRouter.delete('/meetings/', (req, res, next) => {
  deleteAllFromDatabase('meetings');
  res.status(204).send();
});


// This conditional is here for testing purposes:
if (!module.parent) { 
  // Add your code to start the server listening at PORT below:
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}