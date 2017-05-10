import React from 'react';
import { IndexLink, Link } from 'react-router';
import './Header.scss';

export const Header = () => (
  <div>
    <h1>Search Twitter to see how people are feeling about a topic</h1>
    <IndexLink to='/' activeClassName='route--active'>
      Home
    </IndexLink>
    {' · '}
    <Link to='/search' activeClassName='route--active'>
      Search
    </Link>
  </div>
);

export default Header;
