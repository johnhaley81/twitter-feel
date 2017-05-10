import React from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';
import TweetEmbed from 'react-tweet-embed';

const getEmbeddedTweets = R.map(({ id_str: id }) => <TweetEmbed id={id} key={id} />);

export const Search = ({ fetchSearchResults, query, results, updateSearchQuery }) => (
  <div style={{ margin: '0 auto' }} >
    <h2>Search:</h2>
    <input onChange={updateSearchQuery} value={query} />
    <button className='btn btn-default' onClick={fetchSearchResults}>
      Submit
    </button>
    <ul>
      {getEmbeddedTweets(results)}
    </ul>
  </div>
);

Search.propTypes = {
  fetchSearchResults: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
  results: PropTypes.arrayOf(PropTypes.shape({
    id_str: PropTypes.string.isRequired
  })).isRequired,
  updateSearchQuery: PropTypes.func.isRequired,
};

export default Search;
