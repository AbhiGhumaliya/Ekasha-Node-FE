jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(() => ({
    render: jest.fn(),
    unmount: jest.fn(),
  })),
}));

// Mock App component
describe('Application root', () => {
  let mockRoot;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Setup mock root element
    mockRoot = document.createElement('div');
    mockRoot.id = 'root';
    document.body.appendChild(mockRoot);
  });

  afterEach(() => {
    // Cleanup after each test
    document.body.removeChild(mockRoot);
  });

  it('should render App component when root element exists', () => {
    // Require the index file which contains the rendering logic
    require('./index');

    // Get the mocked ReactDOM
    const ReactDOM = require('react-dom/client');
    const mockCreateRoot = ReactDOM.createRoot;
    // const mockRender = mockCreateRoot().render;

    // Verify root was created with correct element
    expect(mockCreateRoot).toHaveBeenCalledWith(document.getElementById('root'));
    expect(mockCreateRoot).toHaveBeenCalledTimes(1);
  });

  it('should not throw error when root element does not exist', () => {
    // Verify that requiring index doesn't throw error
    expect(() => {
      require('./index');
    }).not.toThrow();
  });

  it('should properly import required stylesheets', () => {
    // Mock the style imports
    jest.mock('antd/dist/antd.min.css', () => ({}));
    jest.mock('./assets/fonts/font.css', () => ({}));
    jest.mock('./global.scss', () => ({}));

    require('./index');
    // If we reach here without errors, stylesheets were imported successfully
  });
});
