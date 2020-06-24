const TodosService = {
  getAllTodos(knex) {
    return knex.select('*').from('todos');
  },

  insertTodo(knex, newtodo) {
    return knex
      .insert(newtodo)
      .into('todos')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },

  getById(knex, id) {
    return knex
      .from('todos')
      .select('*')
      .where('id', id)
      .first();
  },

  deleteTodo(knex, id) {
    return knex('todos')
      .where('id', id)
      .delete();
  },

  updateTodo(knex, id, newTodo) {
    return knex('todos')
      .where({ id })
      .update(newTodo);
  },

  serializeTodo(todo) {
    return {
      id: todo.id,
      description: todo.description
    };
  }
};

module.exports = TodosService;
