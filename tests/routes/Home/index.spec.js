import HomeRoute from '../../../src/routes/Home';

describe('(Route) Home', () => {
  let component;

  beforeEach(() => {
    component = HomeRoute.component();
  });

  it('Should return a route configuration object', () => {
    expect(typeof HomeRoute).to.equal('object');
  });

  it('Should define a route component', () => {
    expect(component.type).to.equal('div');
  });
});
