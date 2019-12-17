import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import reducers from 'reducers';
import { initialState } from 'store';

let middleware = [
  thunk,
];

if (process.env.NODE_ENV !== 'production') {
  const loggerModule = require('redux-logger');
  const logger = loggerModule.createLogger({
    collapsed: true,
    // stateTransformer: (state) => {
    //   if (Immutable.Iterable.isIterable(state)) return state.toJS();
    //   else return state;
    // }
  });

  middleware.push(logger);
}

// Using redux-devtools-extension to support Redux Dev Tools with TS
//  https://stackoverflow.com/questions/52800877/has-anyone-came-across-this-error-in-ts-with-redux-dev-tools-property-redux
const composeEnhancers = composeWithDevTools({});
const store = createStore(
  reducers,
  initialState,  // initial state
  composeEnhancers(
    applyMiddleware(...middleware),
  )
);

export default store;