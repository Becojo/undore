var Immutable = require('immutable');

/**
 * Initialize an Immutable.Map with three keys
 * - state: An object that represents the current state
 * - history: Immutable.Stack with all the changes made to the structure
 * - redos: Immutable.Stack with changes undone that can be redone
 *
 * undore :: value -> undore
 */
function undore(object) {
  return Immutable.Map({ 
    state: object,
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
 * Gets the current value
 *
 * get :: undore -> value
 */
undore.get = function(self) {
  return self.get('state');
};

/**
 * Change the value and records the change in the history
 *
 * set :: undore -> value -> undore
 */
undore.set = function(self, value) {
  return self.withMutations(function(self) {
    undore.saveHistory(self);
    undore.clearRedos(self);

    self.set('state', value);
  });
};

/**
 * Undo the latest change if any
 *
 * undo :: undore -> undore
 */
undore.undo = function(self) {
  return self.withMutations(function(self) {
    var history = self.get('history');

    if(history.count()) {
      self.set('redos', self.get('redos').push(self.get('state')));
      self.set('state', history.peek());
      self.set('history', history.pop());
    }
  });
};

/**
 * Redo the latest undo if any
 *
 * undo :: undore -> undore
 */
undore.redo = function(self) {
  return self.withMutations(function(self) {
    var redos = self.get('redos');

    if(redos.count()) {
      undore.saveHistory(self);

      self.set('state', redos.peek())
      self.set('redos', redos.pop());
    }
  });
};

module.exports = undore
