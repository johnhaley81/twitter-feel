import R from 'ramda';
import Twit from 'twit';

const T = new Twit({
  consumer_key:         '...',
  consumer_secret:      '...',
  access_token:         '...',
  access_token_secret:  '...',
  timeout_ms:           10 * 1000,
});

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

  T.get('search/tweets', { q: query, count: 10 })
    .then(({ data: results }) => {
      dispatch({
        type: UPDATE_RESULTS,
        results
      });
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
