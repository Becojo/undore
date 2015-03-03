# Undore

_A persistent data structure to manage undos and redos_

## Example

```javascript
var undore = require('undore');

// initialize the state to 10
var dataState = undore(10);

// operations does not mutate the original object
undore.set(dataState, 5);
console.log(undore.get(dataState)); // 10

// but we can manually reasign our variable
dataState = undore.set(dataState, 5);
console.log(undore.get(dataState)); // 5

// maybe 5 isn't really a nice value, let's rollback
dataState = undore.undo(dataState);
console.log(undore.get(dataState)); // 10

// nevermind, 5 is pretty awesome
dataState = undore.redo(dataState);
console.log(undore.get(dataState)); // 5
```

## Operations

### undore(initialState) &rarr; undore

Constructor of an Undore instance. This instance is in fact an instance of `Immutable.Map` with three keys:

- `state`: The most recent and valid version of the state
- `history`: An `Immutable.Stack` that contains every past versions of the state.
- `redos`: Also an `Immutable.Stack` with changes that were undone and may be redone.

**Note**: Undore does not enforce the use of immutable object as its state.

### undore.set(undore, value) &rarr; undore

Change the value and record the change in the history.

### undore.get(undore) &rarr; value

Get the current value.

### undore.update(undore, updater) &rarr; undore

Update the state with a function of previous state to next state. These are equivalent:

```javascript
undore.set(myState, updater(undore.get(myState)))
undore.update(myState, updater)
```

### undore.undo(undore) &rarr; undore

Undo the latest change if any.

### undore.redo(undore) &rarr; undore

Redo the latest undo if any.

## Demo

- [undore-react-example](https://github.com/Becojo/undore-react-example)

## License

MIT
