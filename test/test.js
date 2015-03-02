
var undore = require('../index.js');
var jsc = require('jsverify');

describe('get/set', function() {
  jsc.property('get(set(u, x)) = x', 'json', function(value) {
    return undore.get(undore.set(undore(null), value)) === value;
  });
});

describe('update', function() {
  jsc.property('update(u, f) = set(u, f(get(u)))', 'json', 'json', function(previous, next) {
    var f = function() {
      return next;
    };

    var initial = undore(previous);
    var test1 = undore.update(initial, f);
    var test2 = undore.set(initial, f(undore.get(initial)));

    return undore.get(test1) === next && undore.get(test2) === next;
  })
})

describe('undo', function() {

  // property: given an array of length n, apply n times `set` followed by
  //           at least n `undo` should yield the initial value
  jsc.property('initialState', 'array nat', function(xs) {
    var value = {};
    var initial = undore(value)

    var sets = xs.reduce(function(s, x) {
      return undore.set(s, x);
    }, initial);

    var undos = xs.reduce(function(s, _) {
      return undore.undo(s);
    }, sets);

    return undore.get(undos) === undore.get(initial) &&
           undore.get(undos) === value;
  });

  // property: undoing n times should yield the initial value when the undo
  //           stack is empty
  jsc.property('idempotenceWhenEmpty', 'json', 'nat', function(value, n) {
    var initial = undore(value);
    var results = undore(value);

    for(var i = 0; i < n; i++) {
      results = undore.undo(results);
    }

    return undore.get(initial) === undore.get(results) &&
           undore.get(results) === value;
  });

});

describe('redo', function() {

  // property: for any positive n, redoing n times should yield the initial
  //           value when the redo stack is empty
  jsc.property('idempotenceWhenEmpty', 'json', 'nat', function(value, n) {
    var initial = undore(value);
    var results = undore(value);

    for(var i = 0; i < n; i++) {
      results = undore.redo(results);
    }

    return undore.get(initial) === undore.get(results) &&
           undore.get(results) === value;
  });
});

describe('undo/redo', function() {

  // property: redo is the inverse operation of undo
  jsc.property('inverse', 'json', 'json', function(x, y) {
    var initial = undore.set(undore(x), y);
    var results = undore.redo(undore.undo(initial));

    return undore.get(initial) === undore.get(results) &&
           undore.get(results) === y;
  });
});

