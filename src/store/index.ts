import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import reducers from '../reducers';

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

const composeEnhancers = composeWithDevTools({});
const store = createStore(
  reducers,
  {},  // initial state
  composeEnhancers(
    applyMiddleware(...middleware),
  )
);

export default store;
