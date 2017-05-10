import R from 'ramda';
import XHR from 'xhr-promise';

// ------------------------------------
// Constants
// ------------------------------------
export const UPDATE_SEARCH_QUERY = 'UPDATE_SEARCH_QUERY';
export const UPDATE_RESULTS = 'UPDATE_RESULTS';

// ------------------------------------
// Actions
// ------------------------------------
const valueLens = R.view(R.lensPath(['target', 'value']));
export const updateSearchQuery = event => dispatch => dispatch({
  type: UPDATE_SEARCH_QUERY,
  query: valueLens(event)
});

const resultsLens = R.view(R.lensPath(['responseText', 'statuses']));
export const fetchSearchResults = () => (dispatch, getState) => {
  const query = getState().search.query;
  const xhrPromise = new XHR();

  xhrPromise.send({
    method: 'GET',
    url: `/twitter?q=${query}`,
  })
  .then((resp) => {
    if (resp.status !== 200) {
      throw new Error('request failed');
    }
    dispatch({
      type: UPDATE_RESULTS,
      results: resultsLens(resp)
    });
  })
  .catch((e) => {
    console.error('XHR error'); // eslint-disable-line no-console
    console.error(e); // eslint-disable-line no-console
  });
};

export const actions = {
  fetchSearchResults,
  updateSearchQuery,
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const queryLens = R.lensProp('query');
const twitterResultsLens = R.lensProp('results');

const ACTION_HANDLERS = {
  [UPDATE_SEARCH_QUERY]: (state, { query }) => R.set(queryLens, query, state),
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
