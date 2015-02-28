
var undore = require('../index.js');
var jsc = require('jsverify');

var genNatKvPairs = jsc.array(jsc.pair(jsc.nat, jsc.nat));

describe('set', function() {
  jsc.property('contains', 'array nat', 'json', function(xs, val) {
    var initial = xs.reduce(function(s, x) {
      return undore.set(s, x, val);
    }, undore());

    for(var i = 0; i < xs.length; i++) {
      if(undore.get(initial, xs[i]) !== val) return false;
    }

    return true;
  });
});

describe('delete', function() {
  jsc.property('removed', 'json', 'json', function(k, v) {
    var initial = undore();
    var results = undore.delete(undore.set(initial, k, v), k)

    return initial.get('state') == results.get('state');
  });
});

describe('undo', function() {
  jsc.property('initialState', 'array nat', function(xs) {
    var initial = undore({})

    var sets = xs.reduce(function(s, x) {
      return undore.set(s, x, Math.random());
    }, initial);

    var undos = xs.reduce(function(s) {
      return undore.undo(s);
    }, sets);

    return undos.get('state') == initial.get('state')
  });

  jsc.property('idempotenceWhenEmpty', genNatKvPairs, 'nat', function(init, n) {
    var initial = undore(init);
    var results = undore(init);

    for(var i = 0; i < n; i++) {
      results = undore.undo(results);
    }

    return initial.get('state').equals(results.get('state'));
  });

});

describe('redo', function() {
  jsc.property('idempotenceWhenEmpty', genNatKvPairs, 'nat', function(init, n) {
    var initial = undore(init);
    var results = undore(init);

    for(var i = 0; i < n; i++) {
      results = undore.redo(results);
    }

    return initial.get('state').equals(results.get('state'));
  });
});

describe('undo/redo', function() {
  jsc.property('inverse', 'nat', 'nat', function(k, v) {
    var initial = undore.set(undore(), k, v);
    var results = undore.redo(undore.undo(initial));

    return initial.get('state') == results.get('state')
  });
});

