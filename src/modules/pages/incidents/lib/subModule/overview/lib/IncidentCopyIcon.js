import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import Icons from '../../../../../../../components/icons';
import Toaster from '../../../../../../../components/toaster';
import ZsTooltip from '../../../../../../../components/tooltip';

const IncidentCopyIcon = React.memo((props) => {
  const copyToClipboard = useCallback((value) => {
    if (value) {
      const dummy = document.createElement('input');
      dummy.style.position = 'absolute';
      document.body.appendChild(dummy);
      dummy.setAttribute('id', 'dummy_id');
      document.getElementById('dummy_id').value = JSON.stringify(value).replace(/"/g, '');
      dummy.select();
      document.execCommand('copy');
      document.body.removeChild(dummy);
      Toaster({ title: `${value} copied`, type: 'success' });
    }
  }, []);

  const style = {
    display: 'flex',
    width: '50%',
    justifyContent: 'space-between',
    cursor: props.value ? 'pointer' : 'initial',
    color: props.color || '#fff',
  };

  return (
    <div
      className={props.className}
      style={style}
    >
      {props.tooltipStatus ? (
        <div style={{ textTransform: 'unset', overflow: 'hidden' }}>
          <ZsTooltip
            autoRight
            title={props.tooltipTitle ? props.tooltipTitle : props.value}
            ids={props.tooltipID}
            style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
          >
            <div className="overflowText" id={props.tooltipID}>{props.tooltipTitle ? props.tooltipTitle : props.value || '-'}</div>
          </ZsTooltip>
        </div>
      ) : (
        <div className="overflowText">
          {props.value || '-'}
        </div>
      )}
      {props.value && (
        <div>
          <Icons
            id={props.iconID}
            iconTooltipType="normal"
            iconTooltipTitle={`Copy ${props.tooltipTitle ? props.tooltipTitle : props.value}`}
            type="copy2"
            icontype="globle"
            onClick={() => copyToClipboard(props.tooltipTitle ? props.tooltipTitle : props.value)}
            className="copyIncidentDetail"
          />
        </div>
      )}
    </div>
  );
});

IncidentCopyIcon.propTypes = {
  value: PropTypes.string.isRequired,
  color: PropTypes.string,
  className: PropTypes.string,
  tooltipStatus: PropTypes.bool,
  tooltipID: PropTypes.string,
  tooltipTitle: PropTypes.string,
  iconID: PropTypes.string,
};

IncidentCopyIcon.defaultProps = {
  color: '#fff',
  className: '',
  tooltipStatus: false,
  tooltipID: '',
  tooltipTitle: '',
  iconID: '',
};

export default IncidentCopyIcon;
