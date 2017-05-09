import React from 'react';
import { IndexLink, Link } from 'react-router';
import { shallow } from 'enzyme';
import { Header } from '../../../src/components/Header/Header';

describe('(Component) Header', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Header />);
  });

  it('Renders a welcome message', () => {
    const welcome = wrapper.find('h1');
    expect(welcome).to.exist();
    expect(welcome.text()).to.match(/React Redux Starter Kit/);
  });

  describe('Navigation links...', () => {
    it('Should render a Link to Home route', () => {
      expect(wrapper.contains(
        <IndexLink activeClassName='route--active' to='/'>
          Home
        </IndexLink>,
      )).to.be.true();
    });

    it('Should render a Link to Counter route', () => {
      expect(wrapper.contains(
        <Link activeClassName='route--active' to='/counter'>
          Counter
        </Link>,
      )).to.be.true();
    });
  });
});
