import R from 'ramda';
import XHR from 'xhr-promise';

// ------------------------------------
// Constants
// ------------------------------------
export const UPDATE_SEARCH = 'UPDATE_SEARCH';
export const UPDATE_RESULTS = 'UPDATE_RESULTS';

// ------------------------------------
// Actions
// ------------------------------------
export const updateSearch = query => (dispatch) => {
  dispatch({
    type: UPDATE_SEARCH,
    query
  });


  const xhrPromise = new XHR();

  xhrPromise.send({
    method: 'GET',
    url: `/twitter?q=${query}`,
  })
  .then((results) => {
    if (results.status !== 200) {
      throw new Error('request failed');
    }
    dispatch({
      type: UPDATE_RESULTS,
      results
    });
  })
  .catch((e) => {
    console.error('XHR error'); // eslint-disable-line no-console
    console.error(e); // eslint-disable-line no-console
  });
};

export const actions = {
  updateSearch,
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const queryLens = R.lensProp('query');
const twitterResultsLens = R.lensProp('results');

const ACTION_HANDLERS = {
  [UPDATE_SEARCH]: (state, { query }) => R.set(queryLens, query, state),
  [UPDATE_RESULTS]: (state, { results }) => R.set(twitterResultsLens, results, state),
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  query: '',
  results: []
};

export default function counterReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
