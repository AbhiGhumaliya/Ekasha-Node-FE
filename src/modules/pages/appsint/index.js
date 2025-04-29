import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { convertTimeBaseTimeZoneFunction, ekashaPermission, PermissionRO } from '../../../helpers/lib/StorageHandlers';
import ZsInput from '../../../components/forms/input';
import Icons from '../../../components/icons';
import { AppIntWrapper } from './lib/AppsIntWrapper';
import AssetModal from './lib/AssetModal';
import NoData from '../../../components/NoData';
import { ZsSpin } from '../../../components/Spin';
import EkashaDropdown from '../../../components/drop_down';
import ZsTooltip from '../../../components/tooltip';

const AppInt = React.memo((props) => {
  const {
    fakeActionApps, getAllAppsTagsListAction, filterSearchAppsAction, getByAppsDeviceAction,
  } = props;

  const [assetShow, setAssetShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [droupOpen, setDroupOpen] = useState(false);
  const [appPreviewLoad, setAppPreviewLoad] = useState(false);
  const [allAppDevice, setAllAppDevice] = useState([]);
  const [allAppsTags, setAllAppsTags] = useState([]);
  const [allAppsFilterTag, setAllAppsFilterTag] = useState([
    { filterName: 'Only Installed Apps', value: 'non-configured', status: false },
    { filterName: 'Configured Apps', value: 'configured', status: false },
  ]);
  const [filters, setFilters] = useState({
    search: '',
    filter: '',
    tagsValue: '',
  });
  const [timer, setTimer] = useState(null);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);

  const GetAllAppsTagsListRes = useSelector((state) => (
    state.APPS.GetAllAppsTagsListResponse || {}
  ));
  const GetAllSearchAppsRes = useSelector((state) => (state.APPS.GetAllSearchAppsResponse || {}));

  const onSearchChange = useCallback((value) => {
    const filterSet = { ...filters };
    filterSet.search = value;
    setFilters(filterSet);
  }, []);

  const onSelectFilterTag = useCallback((valIndex) => {
    const allAppsFilterTagSet = [...allAppsFilterTag];
    const filterSet = { ...filters };
    allAppsFilterTagSet.forEach((element, index) => {
      if (index === valIndex) {
        allAppsFilterTagSet[index].status = !allAppsFilterTagSet[index].status;
        if (allAppsFilterTagSet[index].status) {
          filterSet.filter = allAppsFilterTagSet[index].value;
        } else {
          filterSet.filter = '';
        }
        setFilters(filterSet);
      } else {
        allAppsFilterTagSet[index].status = false;
      }
    });
    setAllAppsFilterTag(allAppsFilterTagSet);
  }, [allAppsFilterTag]);

  const onSelectTag = useCallback((valIndex) => {
    const allAppsTagsSet = [...allAppsTags];
    const filterSet = { ...filters };
    const tags = [];
    const index = allAppsTagsSet.findIndex((d, i) => i === valIndex);
    if (index !== -1) {
      allAppsTagsSet[index].status = !allAppsTagsSet[index].status;
      setAllAppsTags(allAppsTagsSet);
    }
    allAppsTagsSet.forEach((element) => {
      if (element.status) {
        tags.push(element.tagName);
      }
    });
    filterSet.tagsValue = tags;
    setFilters(filterSet);
  }, [allAppsTags]);

  const handleAssetClose = useCallback(() => {
    setAssetShow(false);
  }, []);

  const handleVisibleChange = useCallback(() => {
    setDroupOpen(!droupOpen);
  }, [droupOpen]);

  const handleDropChange = useCallback(() => {
    setFilterDropdownOpen(!filterDropdownOpen);
  }, [filterDropdownOpen]);

  const onAppsCardSelect = useCallback((token) => {
    setAssetShow(true);
    setAppPreviewLoad(true);
    getByAppsDeviceAction(token);
  }, [getByAppsDeviceAction]);

  useEffect(() => {
    const datas = { ...filters };
    datas.search = datas.search || null;
    datas.filter = datas.filter || null;
    datas.tagsValue = datas.tagsValue.length !== 0 ? datas.tagsValue : null;
    // filterSearchAppsAction(datas);
    clearTimeout(timer);

    const newTimer = setTimeout(() => {
      filterSearchAppsAction(datas);
    }, 500);

    setTimer(newTimer);
  }, [filters]);

  useEffect(() => {
    // getAllConfiguredAction();
    // getAllAppsDeviceAction();
    const callback = () => {
      if (PermissionRO('apps').read) {
        getAllAppsTagsListAction();
      }
    };
    callback();
    window.addEventListener('ekashaPermissionChanged', callback);
    return () => {
      window.removeEventListener('ekashaPermissionChanged', callback);
    };
  }, [ekashaPermission.aclData]);

  useEffect(() => {
    if (GetAllAppsTagsListRes.status) {
      setAllAppsTags(GetAllAppsTagsListRes.data);
      // setLoading(false);
      fakeActionApps();
    } else if (GetAllAppsTagsListRes.status === false) {
      setLoading(false);
      setAllAppsTags([]);
      fakeActionApps();
    }
  }, [GetAllAppsTagsListRes]);

  useEffect(() => {
    if (GetAllSearchAppsRes.status) {
      setAllAppDevice(GetAllSearchAppsRes.data);
      setLoading(false);
      fakeActionApps();
    } else if (GetAllSearchAppsRes.status === false) {
      setLoading(false);
      setAllAppDevice([]);
      fakeActionApps();
    }
  }, [GetAllSearchAppsRes]);

  if (!PermissionRO('apps').read) {
    return <NoData id="AppsInt_NoData" message="You don't have permission to access this page" />;
  }

  return (
    <AppIntWrapper id="AppsInt_Wrapper">
      <div className="appsTab" />
      <div>
        <div className="tabContent">
          <div className="tabpanel">
            <div className="topSearch">
              <div className="searchContent">
                <ZsInput
                  inputtype="search"
                  id="Apps_Free_Search_for_device"
                  width="308px"
                  placeholdertext="Search free text"
                  value={filters.search || ''}
                  onChange={(e) => onSearchChange(e.target.value)}
                  searchclear={() => onSearchChange('')}
                />
              </div>
              <div
                id="userDrpMenu"
              >
                <EkashaDropdown
                  triggerType="click"
                  visible={droupOpen}
                  onOpenChange={() => handleVisibleChange()}
                  showContent={(
                    <div className="dropdown-menu outerStyleAppFilter" style={{ backgroundColor: '#181818' }}>
                      <div style={{ width: 'auto', height: 'auto', padding: '10px 15px' }}>
                        <div className="title">Filter</div>
                        <div className="subFilter">
                          {allAppsFilterTag.map((f, i) => (
                            <div
                              id={`AppInt_selectFilterTag_${i}`}
                              key={i}
                              onClick={() => onSelectFilterTag(i)}
                              className={f.status ? 'filterBody selected' : 'filterBody'}
                            >
                              {f.filterName}
                            </div>
                          ))}
                        </div>
                        <div className="title" style={{ marginTop: '10px' }}>Tags</div>
                        <div className="subTag">
                          {allAppsTags.map((d, i) => (
                            <div
                              id={`AppInt_selectTag_${i}`}
                              key={i}
                              onClick={() => onSelectTag(i)}
                              className={d.status ? 'filterBody selected' : 'filterBody'}
                            >
                              {d.tagName}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                      )}
                >
                  <div className="filterPart" onClick={handleDropChange}>
                    <Icons
                      id="incident_searchBoxIcn"
                      style={{ cursor: 'pointer' }}
                      data-test="search_click"
                      icontype="common"
                      type={filterDropdownOpen ? 'SelectUpArrow' : 'SelectArrow'}
                    />
                  </div>
                </EkashaDropdown>
              </div>
              <div className="dCount">
                {allAppDevice.length}
                &nbsp;
                Devices
              </div>
            </div>
            <div className="bodyPart">
              {loading
                ? <ZsSpin id="AppsDevicesLoading2" />
                : null}
              {allAppDevice.length > 0 && !loading
                && (
                  <div className="iBodyOption">
                    <div className="playbook">
                      {allAppDevice.map((d) => (
                        <div
                          id={`AppInt_AppsCardSelect_${d.token}`}
                          key={d.token}
                          onClick={() => onAppsCardSelect(d.token)}
                          className="playbookBox"
                        >
                          <div className="topContent">
                            {d.isConfigured ? (
                              <div>
                                <ZsTooltip
                                  autoRight
                                  title="Configured"
                                >
                                  <div className="configrationDot" />
                                </ZsTooltip>
                              </div>
                            ) : (<div />)}
                            <span className="playbookTime">{convertTimeBaseTimeZoneFunction(d.time)}</span>
                          </div>
                          <div className="pBodyImg">
                            {d
                            && d?.appLogo !== undefined ? <img alt="deviceImg" src={(`data:image/svg+xml;base64,${d.appLogo}`)} /> : <div className="pBodyImgNot">NA</div>}
                          </div>
                          <div className="pBodyName">
                            <div className="dName">{d.displayName}</div>
                          </div>
                          <div className="pBodyDesc overflowText2">
                            <div style={{ textTransform: 'unset', overflow: 'hidden', display: 'flex' }}>
                              <ZsTooltip
                                autoRight
                                title={d.description}
                                type="LineClapToolTip"
                                ids={`AppInt_Description_${d.description}`}
                                style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
                              >
                                <div className="overflowText2" id={`AppInt_Description_${d.description}`}>{d.description}</div>
                              </ZsTooltip>
                            </div>
                          </div>
                          <div className="cCount">
                            <Icons icontype="common" style={{ marginRight: '5px' }} type="actions" />
                            <span className="aName">{d.actionsCount ? d.actionsCount : 0}</span>
                            <Icons icontype="common" style={{ margin: '0 5px 0 10px' }} type="assets" />
                            <span className="aName">{d.configuredDeviceCount ? d.configuredDeviceCount : 0}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              {allAppDevice.length === 0 && !loading
                  && <NoData data-test="ioc_nodata" style={{ position: 'unset', height: '0%' }} />}
            </div>
          </div>
        </div>
      </div>
      {assetShow
        && (
          <AssetModal
            id="AppsInt_AssetModal"
            visible={assetShow}
            setAssetShow={setAssetShow}
            setAppPreviewLoad={setAppPreviewLoad}
            appPreviewLoad={appPreviewLoad}
            setAllAppDevice={setAllAppDevice}
            // activeDetailTab={activeDetailTab}
            onHide={handleAssetClose}
            {...props}
          />
        )}
    </AppIntWrapper>

  );
});

AppInt.propTypes = {
  getAllConfiguredAction: PropTypes.func,
  getAllDeviceAction: PropTypes.func,
  fakeActionApps: PropTypes.func,
  getAllAppsTagsListAction: PropTypes.func,
  filterSearchAppsAction: PropTypes.func,
  getByAppsDeviceAction: PropTypes.func,
};

AppInt.defaultProps = {
  getAllConfiguredAction: null,
  getAllDeviceAction: null,
  fakeActionApps: null,
  getAllAppsTagsListAction: null,
  filterSearchAppsAction: null,
  getByAppsDeviceAction: null,
};
export default AppInt;
