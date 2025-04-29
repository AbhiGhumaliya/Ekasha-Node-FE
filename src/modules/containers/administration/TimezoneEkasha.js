/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Timezone from '../../pages/administration/lib/timezone';
import {
  getSelectedTimezone,
  getAllTimezoneData,
  getAllTimezonList,
  updateTimezone,
  timeZoneList,
  changeTimeZone,
  fakeActionTimezone,
} from '../../../apis/administration/timezone/timezone.action';

const mapStateToProps = (state) => ({
  GetAllTimezoneResponse: state.TIMEZONE.GetAllTimezoneResponse,
  GetAllTimezoneDataResponse: state.TIMEZONE.GetAllTimezoneDataResponse,
  GetSelectedTimezoneResponse: state.TIMEZONE.GetSelectedTimezoneResponse,
  GetAllTimezoneListResponse: state.TIMEZONE.GetAllTimezoneListResponse,
  ChangeTimezoneResponse: state.TIMEZONE.ChangeTimezoneResponse,
  UpdateTimezoneResponse: state.TIMEZONE.UpdateTimezoneResponse,
}
);

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    getSelectedTimezone,
    getAllTimezoneData,
    getAllTimezonList,
    updateTimezone,
    timeZoneList,
    changeTimeZone,
    fakeActionTimezone,
  }, dispatch,
);

const TimezoneEkasha = connect(mapStateToProps, mapDispatchToProps)(Timezone);

export default TimezoneEkasha;
