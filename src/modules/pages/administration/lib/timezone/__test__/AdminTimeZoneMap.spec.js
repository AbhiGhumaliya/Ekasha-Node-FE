/* eslint-disable no-underscore-dangle */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import '@testing-library/jest-dom';
import moment from 'moment';
import { act } from 'react';
import { fireEvent } from '@testing-library/react';
import { getById, renderComponent } from '../../../../../../helpers/lib/RTL';
import TimezoneMap from '../../../../../../components/timezone_map/timezoneMap';

jest.useFakeTimers();

const mockProps = {
  selectedTimeZone: {
    timezoneId: 'Asia/Kolkata',
    countryName: 'India',
    city: 'Kolkata',
  },
  hoverCountery: '',
  selectRegion: 'Asia',
  timeZoneMapData: [
    {
      timezone: 'Asia/Kolkata',
      country: 'India',
      city: 'Kolkata',
      lat: 22.5726,
      lng: 88.3639,
    },
  ],
  setData: jest.fn(),
  svgHeight: 500,
  svgWidth: 1000,
  fakeActionTimezone: jest.fn(),
  newtimeZoneData: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          sovereignt: 'India',
        },
        geometry: {
          // Simplified geometry data
        },
      },
    ],
  },
};

const setUp = (props = {}) => renderComponent(TimezoneMap, props);

describe('TimezoneMap Component', () => {
  beforeEach(() => {
    jest.spyOn(global, 'setTimeout');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state initially', () => {
    setUp(mockProps);
    expect(getById('AdminTimezoneLoading')).toBeInTheDocument();
  });

  it('should render map after loading', async () => {
    setUp(mockProps);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
  });

  it('should handle map interactions', async () => {
    const { container } = setUp(mockProps);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const mapContainer = container.querySelector('#Map-container');
    fireEvent.mouseMove(mapContainer);
    fireEvent.mouseOut(mapContainer);
  });

  it('should update when props change', async () => {
    const { rerender } = setUp(mockProps);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const newProps = {
      ...mockProps,
      selectedTimeZone: {
        timezoneId: 'America/New_York',
        countryName: 'United States',
        city: 'New York',
      },
    };

    // eslint-disable-next-line react/react-in-jsx-scope
    rerender(<TimezoneMap {...newProps} />);
  });

  it('should handle zoom interactions', async () => {
    const { container } = setUp(mockProps);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const mapContainer = container.querySelector('#Map-container');
    const event = new MouseEvent('wheel', {
      bubbles: true,
      cancelable: true,
      deltaY: -100,
    });
    fireEvent(mapContainer, event);
  });

  it('should handle location click events', async () => {
    const { container } = setUp(mockProps);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const location = container.querySelector('.timezone');
    fireEvent.click(location);
    expect(mockProps.setData).toHaveBeenCalled();
  });

  it('should handle location hover events', async () => {
    const { container } = setUp(mockProps);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const location = container.querySelector('.timezone');
    fireEvent.mouseEnter(location);
    fireEvent.mouseMove(location);

    const tooltip = container.querySelector('.tooltip');
    expect(tooltip).toBeInTheDocument();
  });

  it('should handle selected location hover events', async () => {
    const { container } = setUp(mockProps);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const selectedLocation = container.querySelector('image');
    fireEvent.mouseEnter(selectedLocation);
    fireEvent.mouseMove(selectedLocation);
    fireEvent.mouseOut(selectedLocation);
  });

  it('should update region selection', async () => {
    const newProps = {
      ...mockProps,
      selectRegion: 'Europe',
    };

    const { rerender } = setUp(mockProps);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    // eslint-disable-next-line react/react-in-jsx-scope
    rerender(<TimezoneMap {...newProps} />);
  });

  it('should handle hover country updates', async () => {
    const newProps = {
      ...mockProps,
      hoverCountery: 'India',
    };

    const { rerender } = setUp(mockProps);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    // eslint-disable-next-line react/react-in-jsx-scope
    rerender(<TimezoneMap {...newProps} />);
  });

  it('should handle empty timezone data', () => {
    const propsWithEmptyData = {
      ...mockProps,
      timeZoneMapData: [],
      newtimeZoneData: { features: [] },
    };

    setUp(propsWithEmptyData);
  });

  it('should handle UTC timezone filtering', async () => {
    const propsWithUTC = {
      ...mockProps,
      timeZoneMapData: [
        ...mockProps.timeZoneMapData,
        {
          timezone: 'UTC',
          country: 'UTC',
          city: 'UTC',
          lat: 0,
          lng: 0,
        },
      ],
    };

    const { container } = setUp(propsWithUTC);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const locations = container.querySelectorAll('.timezone');
    expect(locations.length).toBe(1); // Should only show non-UTC locations
  });

  it('should handle projection edge cases', async () => {
    const propsWithInvalidCoords = {
      ...mockProps,
      timeZoneMapData: [
        {
          timezone: 'Invalid/Zone',
          country: 'Test',
          city: 'Test',
          lat: null,
          lng: null,
        },
      ],
    };

    const { container } = setUp(propsWithInvalidCoords);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const location = container.querySelector('.timezone');
    expect(location).toBeInTheDocument();
  });

  it('should handle multiple selected cities', async () => {
    const propsWithMultipleCities = {
      ...mockProps,
      timeZoneMapData: [
        ...mockProps.timeZoneMapData,
        {
          timezone: 'Asia/Kolkata',
          country: 'India',
          city: 'Kolkata',
          lat: 22.5726,
          lng: 88.3639,
        },
      ],
    };

    const { container } = setUp(propsWithMultipleCities);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const selectedLocations = container.querySelectorAll('image');
    expect(selectedLocations.length).toBeGreaterThan(0);
  });

  it('should handle zoom transform events', async () => {
    const { container } = setUp(mockProps);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    // Simulate d3 zoom transform event
    const mapContainer = container.querySelector('#Map-container');
    const zoomEvent = new CustomEvent('zoom', {
      detail: {
        transform: {
          k: 2,
          x: 100,
          y: 100,
        },
      },
    });
    fireEvent(mapContainer, zoomEvent);
  });

  it('should handle different region selection scenarios', async () => {
    const propsWithRegion = {
      ...mockProps,
      selectRegion: 'Asia',
      timeZoneMapData: [
        {
          timezone: 'Asia/Tokyo',
          country: 'Japan',
          city: 'Tokyo',
          lat: 35.6762,
          lng: 139.6503,
        },
      ],
      newtimeZoneData: {
        features: [
          {
            properties: {
              sovereignt: 'Japan',
            },
            geometry: {},
          },
        ],
      },
    };

    const { container } = setUp(propsWithRegion);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const path = container.querySelector('.regionHover');
    expect(path).toBeInTheDocument();
  });

  it('should handle tooltip positioning', async () => {
    const { container } = setUp(mockProps);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const location = container.querySelector('.timezone');
    fireEvent.mouseMove(location, {
      layerX: 100,
      layerY: 100,
    });

    const tooltip = container.querySelector('.tooltip');
    expect(tooltip).toHaveStyle({ left: expect.any(String), top: expect.any(String) });
  });

  it('should handle map rerendering on prop changes', async () => {
    const { rerender } = setUp(mockProps);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const newProps = {
      ...mockProps,
      selectedTimeZone: {
        timezoneId: 'Europe/London',
        countryName: 'United Kingdom',
        city: 'London',
      },
      selectRegion: 'Europe',
      hoverCountery: 'United Kingdom',
    };

    // eslint-disable-next-line react/react-in-jsx-scope
    rerender(<TimezoneMap {...newProps} />);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });
  });

  it('should handle country hover states correctly', async () => {
    const { container } = setUp(mockProps);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const country = container.querySelector('.country');
    fireEvent.mouseMove(country);

    const hoveredCountry = container.querySelector('.country-on');
    fireEvent.click(hoveredCountry);
    expect(hoveredCountry).toBeInTheDocument();

    fireEvent.mouseOut(country);
    expect(container.querySelector('.country-on')).not.toBeInTheDocument();
  });

  it('should handle location mouseout events', async () => {
    const { container } = setUp(mockProps);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    // Find a timezone location
    const location = container.querySelector('.timezone');

    // First trigger mousemove to set up the initial state
    fireEvent.mouseMove(location);

    // Then trigger mouseout
    fireEvent.mouseOut(location);

    // Check if tooltip opacity is set to 0
    const tooltip = container.querySelector('.tooltip');
    expect(tooltip).toHaveStyle({ opacity: '0' });

    // Check if country-on class is removed

    // Check if selectPath class is removed
    const timezoneElement = container.querySelector(`.timezoneId${mockProps.timeZoneMapData[0].country}`);
    expect(timezoneElement).not.toHaveClass('selectPath');

    // Verify setTooltip was called with correct parameters
    const tooltipText = container.querySelector('.Maptooltip');
    if (mockProps.selectedTimeZone.timezoneId) {
      expect(tooltipText.textContent).toBe(
        moment().tz(mockProps.selectedTimeZone.timezoneId).format('dddd, D MMMM YYYY, h:mm a'),
      );
    } else {
      expect(tooltipText.textContent).toBe('Select timezone');
    }
  });
});
