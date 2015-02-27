var Immutable = require('immutable');

/**
 * Initialize an Immutable.Map with three keys
 * - state: Immutable.Map that stores the current state
 * - history: Immutable.Stack with all the changes made to the structure
 * - redos: Immutable.Stack with changes undone that can be redone
 *
 * undore :: Object -> undore
 */
function undore(object) {
  return Immutable.Map({ 
    state: Immutable.Map(object), 
    history: Immutable.Stack(), 
    redos: Immutable.Stack() 
  });
}

/**
 * Save the current state into the history
 *
 * saveHistory :: undore -> undore
 */
undore.saveHistory = function(self) {
  var state = self.get('state');

  return self.update('history', function(history) {
    return history.push(state);
  });
};

/**
 * Clear the undo stack
 *
 * clearRedos :: undore -> undore
 */
undore.clearRedos = function(self) {
  return self.update('redos', function(redos) {
    return redos.clear();
  });
};

/**
 * Get a key from the state
 *
 * get :: undore -> key -> value
 */
undore.get = function(self, key) {
  return self.getIn(['state', key]);
};

/**
 * Set a value at the given key
 *
 * set :: undore -> key -> value -> undore
 */
undore.set = function(self, key, value) {
  return self.withMutations(function(self) {
    undore.saveHistory(self);
    undore.clearRedos(self);

    self.update('state', function(state) {
      return state.set(key, value);
    });
  });
};

/**
 * Delete a value at the given key
 * 
 * set :: undore -> key -> undore
 */
undore.delete = function(self, key) {
  return self.withMutations(function(self) {
    undore.saveHistory(self);
    undore.clearRedos(self);

    self.update('state', function(state) {
      return state.delete(key);
    });
  });
}

/**
 * Undo the latest change
 *
 * undo :: undore -> undore
 */
undore.undo = function(self) {
  return self.withMutations(function(self) {
    var history = self.get('history');

    self.set('redos', self.get('redos').push(self.get('state')))
    self.set('state', history.peek());
    self.set('history', history.pop());
  });
};

/**
 * Redo the latest undo
 *
 * undo :: undore -> undore
 */
undore.redo = function(self) {
  return self.withMutations(function(self) {
    var state = self.get('redos').peek();

    undore.saveHistory(self);

    self.set('state', state)
    self.update('redos', function(redos) {
      return redos.pop();
    });
  });
};

module.exports = undore
