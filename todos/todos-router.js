const path = require('path');
const express = require('express');
const TodosService = require('./todos-service');

const todosRouter = express.Router();
const jsonParser = express.json();

todosRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    TodosService.getAllTodos(knexInstance)
      .then(todos => res.json(todos.map(TodosService.serializeTodo)))
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const possibleKey = ['description'];
    const newUpdate = req.body;

    Object.keys(newUpdate).forEach(key => {
      if (!possibleKey.includes(key)) {
        res.status(400).json({ error: `${key} is not a valid key` });
      }
    });

    TodosService.updateTodo(req.app.get('db'), req.todos.id, newUpdate).then(
      () => res.send(204)
    );
  })
  .post(jsonParser, (req, res, next) => {
    const { description } = req.body;
    if (description == null) {
      return res.status(400).json({
        error: {
          message: `'description' is required`
        }
      });
    }

    TodosService.insertTodo(req.app.get('db'), { description })
      .then(todo => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${todo.id}`))
          .json(TodosService.serializeTodo(todo));
      })
      .catch(next);
  });

todosRouter
  .route('/:id')
  .all((req, res, next) => {
    TodosService.getById(req.app.get('db'), req.params.id)
      .then(todo => {
        if (!todo) {
          return res.status(404).json({
            error: { message: `todo doesn't exist` }
          });
        }
        res.todo = todo;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(TodosService.serializeTodo(res.todo));
  })
  .delete((req, res, next) => {
    TodosService.deleteTodo(req.app.get('db'), req.params.id)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = todosRouter;
