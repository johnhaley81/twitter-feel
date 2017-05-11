import React from 'react';
import PropTypes from 'prop-types';
import R, { __ } from 'ramda';
import TweetEmbed from 'react-tweet-embed';
import emoji from 'node-emoji';

const emojisByTone = {
  anger: emoji.get('angry'),
  disgust: emoji.get('mask'),
  fear: emoji.get('fearful'),
  joy: emoji.get('smiley'),
  sadness: emoji.get('disappointed'),
  analytical: emoji.get('sleuth_or_spy'),
  confident: emoji.get('relieved'),
  tentative: emoji.get('grimacing'),
  openness_big5: emoji.get('speaking_head_in_silhouette'),
  conscientiousness_big5: emoji.get('angel'),
  extraversion_big5: emoji.get('dancer'),
  agreeableness_big5: emoji.get('ok_hand'),
  emotional_range_big5: emoji.get('interrobang')
};

const getEmbeddedTweet = R.pipe(
  R.view(R.lensPath(['tweet', 'id_str'])),
  id => <TweetEmbed id={id} key={id} />
);

const isToneSignificant = R.pipe(
  R.view(R.lensPath(['score'])),
  R.gt(__, 0.75)
);

const getEmojiFromTone = tone => (
  <span style={{ fontSize: 30 }} title={`${tone.tone_name}: ${tone.score}`}>{emojisByTone[tone.tone_id]}</span>
);

const getTones = R.pipe(
  R.view(R.lensPath(['tone', 'document_tone', 'tone_categories'])),
  R.map(R.view(R.lensPath(['tones']))),
  R.flatten,
  R.filter(isToneSignificant),
  R.map(getEmojiFromTone)
);

const getResults = R.map(
  result => (
    <div style={{ width: '100%', marginBottom: 10 }}>
      <div style={{ display: 'inline-block', border: 'solid 1px black', padding: 20 }}>
        <div>{getTones(result)}</div>
        <div style={{ display: 'inline-block' }}>{getEmbeddedTweet(result)}</div>
      </div>
    </div>
  )
);

export const Search = ({ fetchSearchResults, query, results, updateSearchQuery }) => (
  <div style={{ margin: '0 auto' }} >
    <h2>Search:</h2>
    <input onChange={updateSearchQuery} value={query} />
    <button className='btn btn-default' onClick={fetchSearchResults}>
      Submit
    </button>
    <ul>
      {getResults(results)}
    </ul>
  </div>
);

Search.propTypes = {
  fetchSearchResults: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
  results: PropTypes.arrayOf(PropTypes.shape({
    tweet: PropTypes.shape({
      id_str: PropTypes.string.isRequired
    })
  })).isRequired,
  updateSearchQuery: PropTypes.func.isRequired,
};

export default Search;
