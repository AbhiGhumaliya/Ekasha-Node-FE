import '@testing-library/jest-dom';
import { act } from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { handlePermission } from '../../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../../helpers/lib/StorageHandlers';
import { getById, renderComponent, selectOption } from '../../../../../../helpers/lib/RTL';
import {
  getAllTimezonList,
  getSelectedTimezone,
  updateTimezone,
  fakeActionTimezone,
  getAllTimezoneData,
} from '../../../../../../apis/administration/timezone/timezone.action';
import TimezoneEkasha from '../../../../../containers/administration/TimezoneEkasha';
import { stompClient } from '../../../../../../helpers/lib/SocketHandlers';

jest.useFakeTimers();

const actionProps = {
  getAllTimezonList,
  getSelectedTimezone,
  updateTimezone,
  fakeActionTimezone,
  getAllTimezoneData,
};

const initialData = {
  TIMEZONE: {
    GetAllTimezoneResponse: {
      code: 200,
      message: 'Timezone data fetched.',
      status: true,
      data: [
        {
          country: 'Pacific',
          lng: '-151.443588',
          city: 'Marquesas',
          timezone: 'Pacific/Marquesas',
          lat: '-16.761301',
        },
        {
          country: 'Europe',
          lng: '12.45414',
          city: 'Vatican',
          timezone: 'Europe/Vatican',
          lat: '41.90268',
        },
        {
          timezone: 'Asia/Kolkata',
          country: 'India',
          city: 'Kolkata',
          lat: 22.5726,
          lng: 88.3639,
        },
        {
          timezone: 'America/New_York',
          country: 'United States',
          city: 'New York',
          lat: 40.7128,
          lng: -74.0060,
        },
        {
          country: 'Kazakhstan',
          lng: '72.652359',
          city: 'Aral',
          timezone: 'Asia/Qyzylorda',
          lat: '42.531471',
        },
      ],
    },
    GetSelectedTimezoneResponse: {
      code: 200,
      message: 'Selected timezone fetched.',
      status: true,
      data: {
        timezoneId: 'Asia/Kolkata',
        countryName: 'India',
        city: 'Kolkata',
      },
    },
    // UpdateTimezoneResponse: {
    //   code: 200,
    //   message: 'Timezone updated.',
    //   status: true,
    //   data: {},
    // },
    GetAllTimezoneDataResponse: {
      code: 200,
      message: 'Timezone map data fetched.',
      status: true,
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {
              sovereignt: 'India',
            },
          },
        ],
      },
    },
  },
};

const socketFackData = [{
  body: JSON.stringify({
    module: 'timeZone',
    operation: 'update',
    status: true,
    data: {
      timezoneId: 'America/New_York',
      countryName: 'United States',
      city: 'New York',
    },
  }),
}, {
  body: JSON.stringify({
    module: 'timeZone',
    operation: '',
    status: true,
    data: {},
  }),
}];

const setUp = (props = {}, initialState = {
  TIMEZONE: {},
}) => renderComponent(
  TimezoneEkasha, props, initialState, null,
);

describe('Component Rendering - Render with No Permission', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.TIMEZONE = {};
    setPermissions(handlePermission('NA', 'administration', 'timezone'));
    setUp(actionProps, initial);
  });

  it('Should render No Permission Page', async () => {
    expect(getById('Admin_Timezone_No_Permission_NoData')).toBeInTheDocument();
  });
});

describe('Component Rendering - Render with Data and Read Permission', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.TIMEZONE.GetAllTimezoneResponse.status = false;
    initial.TIMEZONE.GetSelectedTimezoneResponse.status = false;
    initial.TIMEZONE.GetAllTimezoneDataResponse.status = false;
    initial.TIMEZONE.UpdateTimezoneResponse = {
      code: 400,
      message: 'Timezone updated.',
      status: false,
      data: {},
    };
    setPermissions(handlePermission('RO', 'administration', 'timezone'));
    setUp(actionProps, initial);
  });

  it('Should render Timezone Wrapper', () => {
    expect(getById('Admin_Timezone_Wrapper')).toBeInTheDocument();
  });

  it('Should render Region Select as disabled', () => {
    const regionSelect = getById('Admin_Timezone_Region_Select');
    expect(regionSelect).toBeInTheDocument();
    expect(regionSelect).toHaveAttribute('disabled');
  });

  it('Should render City Select as disabled', () => {
    const citySelect = getById('Admin_Timezone_City_Select');
    expect(citySelect).toBeInTheDocument();
    expect(citySelect).toHaveAttribute('disabled');
  });
});

describe('Component Rendering - Socket Handler', () => {
  let wrapper;
  let mockSubscribe;

  beforeEach(() => {
    mockSubscribe = {
      unsubscribe: jest.fn(),
    };
    stompClient.connected = true;
    stompClient.subscribe = jest.fn().mockReturnValue(mockSubscribe);

    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RW', 'administration', 'timezone'));
    wrapper = setUp(actionProps, initial);
  });

  afterEach(() => {
    if (wrapper && wrapper.unmount) {
      wrapper.unmount();
    }
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should subscribe to the topic on mount and unsubscribe on unmount', () => {
    expect(stompClient.subscribe).toHaveBeenCalledWith('/topic/broadcast', expect.any(Function));
    wrapper.unmount();
    expect(mockSubscribe.unsubscribe).toHaveBeenCalled();
  });

  it('should not subscribe if stompClient is not connected', () => {
    jest.clearAllMocks();
    stompClient.connected = false;
    expect(stompClient.subscribe).not.toHaveBeenCalled();
  });

  it('should handle socket operations correctly', () => {
    const subscribeCallback = stompClient.subscribe.mock.calls[0][1];
    socketFackData.forEach((element) => {
      act(() => {
        subscribeCallback(element);
      });
    });
  });
});

describe('Component Rendering - Render with Write Permission', () => {
  const selectOption1 = (id, option) => {
    fireEvent.mouseDown(getById(id));
    const options = screen.getAllByText(option);
    fireEvent.click(options[1]);
  };
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.TIMEZONE.UpdateTimezoneResponse = {
      code: 200,
      message: 'Timezone updated.',
      status: true,
      data: {},
    };
    setPermissions(handlePermission('RW', 'administration', 'timezone'));
    setUp(actionProps, initial);
  });

  it('Should handle Region Select change', async () => {
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    selectOption('Admin_Timezone_Region_Select', 'America');
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    selectOption1('Admin_Timezone_City_Select', 'New York');
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    expect(screen.getByText('On change the timezone, have to restart the Ekasha service ?')).toBeInTheDocument();
    const okButton = screen.getByText('Yes');
    fireEvent.click(okButton);
    const cancelButton = screen.getByText('No');
    fireEvent.click(cancelButton);
  });
});

describe('Timezone Map Render with only Read Permission', () => {
  it('should render Toster', async () => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setUp(actionProps, initial);
    setPermissions(handlePermission('RO', 'administration', 'timezone'));

    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    const location = getById('timezonePacific');
    fireEvent.click(location);
    // expect(mockProps.setData).toHaveBeenCalled();
  });
});

describe('Timezone Map Render with only Write Permission', () => {
  it('should TimeZone Change with Map', async () => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setUp(actionProps, initial);
    setPermissions(handlePermission('RW', 'administration', 'timezone'));

    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    const location = getById('timezonePacific');
    fireEvent.click(location);
    // expect(mockProps.setData).toHaveBeenCalled();
  });
});
