import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import ZsDateTimePicker from '../../../../components/datetimepicker';
import ZsSelect from '../../../../components/forms/select/index';

const JobFilters = ({ errorName, setFields }) => (
  <div className="lContent">
    <div style={{ display: 'flex', width: '20%' }}>
      <div className="lContentText"> Order </div>
      <div className="lTypeDropdown">
        <ZsSelect
          id="jobs_order"
          data-test="jobs_order_select"
          value={errorName.order || ''}
          onChange={(e) => setFields(e, 'order')}
          data={[
            { name: 'Ascending', value: 'ascending' },
            { name: 'Descending', value: 'descending' },
          ]}
          selecttype="normal"
          defaultValue="Descending"
        />
      </div>
    </div>
    <div style={{ display: 'flex', width: '20%' }}>
      <div className="lContentText"> Type </div>
      <div className="lTypeDropdown">
        <ZsSelect
          id="jobs_type"
          data-test="jobs_type_select"
          value={errorName.type || ''}
          onChange={(e) => setFields(e, 'type')}
          data={[
            { name: 'All', value: 'All' },
            { name: 'Report', value: 'Report' },
            { name: 'Playbook', value: 'Playbook' },
            { name: 'Action', value: 'Action' },
            { name: 'Approval', value: 'Approval' },
            { name: 'Email', value: 'Email' },
          ]}
          selecttype="normal"
          defaultValue="All"
        />
      </div>
    </div>
    <div style={{ display: 'flex' }}>
      <div className="lContentText"> From </div>
      <div className="lTime">
        <ZsDateTimePicker
          future
          dateFormat="Do MMMM YYYY, "
          data-test="from_time_select"
          timeFormat="HH:mm:ss"
          placeholder="Select from date"
          id="jobDateTimePickerFrom"
          value={errorName.timeFilter.from ? moment(errorName.timeFilter.from, 'YYYY-MM-DDTHH:mm:ssZ') : ''}
          onChange={(e) => setFields(moment(e).format('YYYY-MM-DDTHH:mm:ssZ'), 'from')}
        />
      </div>
      <div className="lContentText"> To </div>
      <div className="lTime">
        <ZsDateTimePicker
          future
          dateFormat="Do MMMM YYYY, "
          data-test="to_time_select"
          timeFormat="HH:mm:ss"
          placeholder="Select to date"
          id="jobDateTimePickerTo"
          value={errorName.timeFilter.to ? moment(errorName.timeFilter.to, 'YYYY-MM-DDTHH:mm:ssZ') : ''}
          onChange={(e) => setFields(moment(e).format('YYYY-MM-DDTHH:mm:ssZ'), 'to')}
        />
      </div>
    </div>
  </div>
);

JobFilters.propTypes = {
  errorName: PropTypes.shape({
    order: PropTypes.string,
    type: PropTypes.string,
    timeFilter: PropTypes.shape({
      from: PropTypes.string,
      to: PropTypes.string,
    }),
  }).isRequired,
  setFields: PropTypes.func.isRequired,
};

export default JobFilters;
