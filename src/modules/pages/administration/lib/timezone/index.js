import React, {
  useCallback, useEffect, useState,
} from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { TimezoneWrapper } from './style';
import ZsSelect from '../../../../../components/forms/select';
import ZsModal from '../../../../../components/modal';
import TimezoneMap from '../../../../../components/timezone_map/timezoneMap';
import { ekashaPermission, PermissionRO } from '../../../../../helpers/lib/StorageHandlers';
import { stompClient } from '../../../../../helpers/lib/SocketHandlers';
import Toaster from '../../../../../components/toaster';
import NoData from '../../../../../components/NoData';

let subscribe;

const Timezone = React.memo((props) => {
  const {
    getAllTimezonList, getSelectedTimezone, updateTimezone, fakeActionTimezone, getAllTimezoneData,
  } = props;

  const [timeZoneData, setTimeZoneData] = useState([]);
  const [selectedTimeZone, setSelectedTimeZone] = useState({});
  const [selectedData, setSelectedData] = useState({});
  const [regionData, setRegionDataData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [finalData, setFinalData] = useState({});
  const [openConform, setOpenConform] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newtimeZoneData, setNewtimeZoneData] = useState([]);

  const GetAllTimezonRes = useSelector((state) => (
    state.TIMEZONE.GetAllTimezoneResponse || {}));
  const GetSelectedTimezoneRes = useSelector((state) => (
    state.TIMEZONE.GetSelectedTimezoneResponse || {}));
  const updateTimezoneRes = useSelector((state) => (state.TIMEZONE.UpdateTimezoneResponse || {}));
  const GetAllTimezoneDataRes = useSelector((state) => (
    state.TIMEZONE.GetAllTimezoneDataResponse || {}));

  // eslint-disable-next-line max-len
  // const sortAlphabetically = (a, b) => (a?.name ?? '\uffff').toLowerCase().localeCompare((b?.name ?? '\uffff').toLowerCase());

  const getCityDataForRegion = useCallback((timeZoneData2, regionId) => {
    const filteredCities = timeZoneData2.filter((x) => x.timezone.split('/')[0] === regionId);

    const uniqueCities = [];
    filteredCities.forEach((element) => {
      if (uniqueCities.findIndex((e) => e.value === element.city) === -1) {
        uniqueCities.push({ name: element.city, value: element.city });
      }
    });

    return uniqueCities;
  }, []);

  const onSmtpdataReceived = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'timeZone') {
      switch (dataRes.operation) {
        case 'update':
          if (dataRes.status) {
            setSelectedData(dataRes.data);
            setSelectedTimeZone(dataRes.data);
          }
          break;
        default:
          break;
      }
    }
  };
  useEffect(() => {
    const callback = () => {
      if (PermissionRO('administration', 'timezone').read) {
        getAllTimezoneData();
        getAllTimezonList();
      }
    };
    callback();
    window.addEventListener('ekashaPermissionChanged', callback);
    return () => {
      window.removeEventListener('ekashaPermissionChanged', callback);
    };
  }, [ekashaPermission.aclData]);

  useEffect(() => {
    if (stompClient && stompClient.connected) {
      const channelSub = () => {
        subscribe = stompClient.subscribe('/topic/broadcast', onSmtpdataReceived);
      };
      channelSub();
      window.addEventListener('stompClientChanged', channelSub);
    }
    return () => {
      if (subscribe) { subscribe.unsubscribe(); }
      window.removeEventListener('stompClientChanged', null);
    };
  }, [stompClient.connected]);

  useEffect(() => {
    if (GetAllTimezonRes.status) {
      setTimeZoneData(GetAllTimezonRes.data);

      // Process region data here
      const regionData1 = [];
      GetAllTimezonRes.data.forEach((element) => {
        if (regionData1.findIndex((e) => e.value === element.timezone.split('/')[0]) === -1) {
          regionData1.push({ name: element.timezone.split('/')[0], value: element.timezone.split('/')[0] });
        }
      });
      setRegionDataData(regionData1);

      getSelectedTimezone();
      fakeActionTimezone();
    } else if (GetAllTimezonRes.status === false) {
      fakeActionTimezone();
    }
  }, [GetAllTimezonRes]);

  useEffect(() => {
    if (GetAllTimezoneDataRes.status) {
      setNewtimeZoneData([]);
      setNewtimeZoneData(GetAllTimezoneDataRes.data);
      fakeActionTimezone();
    } else if (GetAllTimezoneDataRes.status === false) {
      setNewtimeZoneData([]);
      fakeActionTimezone();
    }
  }, [GetAllTimezoneDataRes]);

  useEffect(() => {
    if (GetSelectedTimezoneRes.status) {
      setSelectedTimeZone(GetSelectedTimezoneRes.data);
      setSelectedData(GetSelectedTimezoneRes.data);
      if (GetSelectedTimezoneRes.data.timezoneId.includes('/')) {
        const cities = getCityDataForRegion(
          timeZoneData,
          GetSelectedTimezoneRes.data.timezoneId.split('/')[0],
        );
        setCityData(cities);
      }
      fakeActionTimezone();
    } else if (GetSelectedTimezoneRes.status === false) {
      fakeActionTimezone();
    }
  }, [GetSelectedTimezoneRes, timeZoneData]);

  useEffect(() => {
    if (updateTimezoneRes.status) {
      setLoading(false);
      setOpenConform(false);
      fakeActionTimezone();
    } else if (updateTimezoneRes.status === false) {
      setLoading(false);
      setOpenConform(false);
      if (selectedTimeZone.timezoneId?.includes('/')) {
        const cities = getCityDataForRegion(
          timeZoneData,
          selectedTimeZone.timezoneId.split('/')[0],
        );
        setCityData(cities);
      }
      setSelectedData(selectedTimeZone);
      fakeActionTimezone();
    }
  }, [updateTimezoneRes]);

  const onOkButton = useCallback(() => {
    setLoading(true);
    updateTimezone(finalData);
  }, [finalData]);

  const onCancleButton = useCallback(() => {
    setLoading(false);
    setOpenConform(false);
    if (selectedTimeZone.timezoneId.includes('/')) {
      const cities = getCityDataForRegion(
        timeZoneData,
        selectedTimeZone.timezoneId.split('/')[0],
      );
      setCityData(cities);
    }
    setSelectedData(selectedTimeZone);
    setFinalData([]);
  }, [selectedTimeZone, timeZoneData]);

  const setData = useCallback((e, type) => {
    const timeZoneData1 = [...timeZoneData];
    if (timeZoneData1 && PermissionRO('administration', 'timezone').write) {
      let selectData = { ...selectedData };
      if (type === 'region') {
        const cities = getCityDataForRegion(
          timeZoneData,
          e,
        );
        setCityData(cities);
        selectData = {};
        selectData.timezoneId = e;
        setSelectedData(selectData);
        setFinalData(selectData);
      } else if (type === 'city') {
        const a = timeZoneData.filter((x) => x.city === e);
        selectData.city = e;
        selectData.countryName = a[0].country;
        selectData.timezoneId = a[0].timezone;
        setFinalData(selectData);
        setOpenConform(true);
      } else {
        if (selectedTimeZone.timezoneId.includes('/')) {
          const a = timeZoneData.filter((x) => x.timezone.split('/')[0] === e.timezoneId.split('/')[0]);
          const b = [];
          a.forEach((element) => {
            if (b.findIndex((e1) => e1.value === element.city) === -1) {
              b.push({ name: element.city, value: element.city });
            }
          });
          setCityData(b);
        }
        if (selectedTimeZone.countryName) {
          const a = timeZoneData.filter((x) => x.country === e.countryName);
          const b = [];

          a.forEach((element) => {
            if (b.findIndex((e1) => e1.value === element.city) === -1) {
              b.push({ name: element.city, value: element.city });
            }
          });
          setCityData(b);
        }
        setFinalData(e);
        setOpenConform(true);
      }
    } else {
      Toaster({ title: "you don't have a permission", type: 'error' });
    }
  }, [selectedTimeZone, timeZoneData, selectedData]);

  if (!PermissionRO('administration', 'timezone').read) {
    return <NoData style={{ position: 'absolute' }} id="Admin_Timezone_No_Permission_NoData" message="You don't have permission to access this page" />;
  }

  return (
    <TimezoneWrapper id="Admin_Timezone_Wrapper">
      <div className="selectedData">
        <div style={{ display: 'flex', width: '33%', marginRight: '10px' }}>
          <div style={{ marginRight: '10px', display: 'flex', alignItems: 'center' }}>Region: </div>
          <div style={{ width: '100%' }}>
            <ZsSelect
              selecttype="normal"
              id="Admin_Timezone_Region_Select"
              placeholder="Enter Region"
              disabled={!PermissionRO('administration', 'timezone').write}
              value={selectedData.timezoneId ? selectedData.timezoneId.split('/').length > 0 ? selectedData.timezoneId.split('/')[0] : selectedData.timezoneId : null}
              onChange={(e) => setData(e, 'region')}
              // data={regionData.sort(sortAlphabetically)}
              data={regionData}
            />
          </div>
        </div>
        <div style={{ display: 'flex', width: '33%', marginRight: '10px' }}>
          <div style={{
            marginLeft: '10px',
            marginRight: '10px',
            display: 'flex',
            alignItems: 'center',
          }}
          >
            City:
          </div>
          <div style={{ width: '100%' }}>
            <ZsSelect
              selecttype="normal"
              data-test="timezone_city"
              id="Admin_Timezone_City_Select"
              placeholder="Enter City"
              disabled={!PermissionRO('administration', 'timezone').write}
              value={selectedData.city || null}
              onChange={(e) => { setData(e, 'city'); }}
              // data={cityData.sort(sortAlphabetically)}
              data={cityData}
            />
          </div>
        </div>
      </div>
      <div className="map_contain">
        {timeZoneData && timeZoneData.length > 0
            && (
              <TimezoneMap
                getAllTimezoneData={getAllTimezoneData}
                newtimeZoneData={newtimeZoneData}
                fakeActionTimezone={fakeActionTimezone}
                timeZoneMapData={timeZoneData}
                selectedTimeZone={selectedTimeZone}
                hoverCountery={selectedData.countryName}
                selectRegion={selectedData.timezoneId}
                setData={setData}
              />
            )}
      </div>
      <ZsModal
        id="Admin_Timezone_Update_Confirm_Modal"
        open={openConform}
        modaltype="confirm"
        msg="On change the timezone, have to restart the Ekasha service ?"
        title="Warning"
        className="timezonUpdateConfirm"
        loading={loading}
        onOk={() => {
          onOkButton();
        }}
        onCancel={() => {
          onCancleButton();
        }}
      />
    </TimezoneWrapper>
  );
});
Timezone.propTypes = {
  getSelectedTimezone: PropTypes.func,
  getAllTimezonList: PropTypes.func,
  updateTimezone: PropTypes.func,
  getAllTimezoneData: PropTypes.func,
  fakeActionTimezone: PropTypes.func,
};

Timezone.defaultProps = {
  getSelectedTimezone: null,
  getAllTimezonList: null,
  updateTimezone: null,
  getAllTimezoneData: null,
  fakeActionTimezone: null,
};
export default Timezone;
