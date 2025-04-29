import ServerEkasha from '../../../../../containers/administration/ServerEkasha';
import { findByTestAtrrFirst } from '../../../../../../helpers/lib/testUtils';
import { mountComponent } from '../../../../../../setupTests';

jest.useFakeTimers();

const actionProps = {
  // Add any necessary action props here
};

const initialData = {
  Server: {
    // Add initial server data here if needed
  },
};

const setUp = (props = {}, initialState = { Server: {} }) => mountComponent(
  ServerEkasha, props, initialState, null,
);

describe('Server Component Rendering', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    wrapper = setUp(actionProps, initial);
  });

  it('Should render the component', () => {
    const serverWrapper = findByTestAtrrFirst(wrapper, 'ServerRabbitManagement');
    expect(serverWrapper.length).toBe(1);
  });

  afterAll(() => {
    jest.useRealTimers();
    if (wrapper) {
      wrapper.unmount();
    }
  });
});
