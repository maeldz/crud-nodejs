const express = require("express");

const server = express();

server.use(express.json());

const projects = [];

let numberRequests = 0;

const ifProjectNotExist = (req, res, next) => {
  const { id } = req.params;

  if (!projects.find(p => p.id == id)) {
    return res.status(400).json({ error: "Project not found." });
  }

  return next();
};

const ifProjectExist = (req, res, next) => {
  const { id } = req.body;

  if (projects.find(p => p.id == id)) {
    return res.status(400).json({ error: "Id already exist." });
  }

  return next();
};

const requestsLog = (req, res, next) => {
  numberRequests++;

  console.log(`Requisições: ${numberRequests}`);

  return next();
};

server.use(requestsLog);

server.post("/projects", ifProjectExist, (req, res) => {
  const { id, title } = req.body;
  projects.push({ id, title, tasks: [] });

  res.json(projects);
});

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.put("/projects/:id", ifProjectNotExist, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const projectIndex = projects.findIndex(p => (p.id = id));

  projects[projectIndex].title = title;

  res.json(projects);
});

server.delete("/projects/:id", ifProjectNotExist, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.send();
});

server.post("/projects/:id/task", ifProjectNotExist, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const projectIndex = projects.findIndex(p => (p.id = id));

  projects[projectIndex].tasks.push(title);

  res.json(projects);
});

server.listen(3000);
