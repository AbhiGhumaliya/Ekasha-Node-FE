import React, { lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import { retryLazy } from '../../helpers/envData';
import ZsTooltip from '../tooltip';

const globalIcons = lazy(() => retryLazy(() => import('./globleIcons')));
const ChartIcons = lazy(() => retryLazy(() => import('./chartIcon')));
const CommonIcon = lazy(() => retryLazy(() => import('./commonIcon')));

const Icons = (props) => {
  const {
    icontype, iconClass, id, iconTooltipTitle, iconTooltipType, iconTooltipSubType, ...rest
  } = props;
  const componentsList = {
    globle: globalIcons,
    chart: ChartIcons,
    common: CommonIcon,
  };
  const TagName = componentsList[icontype];
  const IconDiv = () => (
    <span
      id={id}
      style={{ cursor: 'pointer' }}
      className={iconClass}
      {...rest}
    >
      <Suspense fallback={false}>
        <TagName {...props} />
      </Suspense>
    </span>
  );
  return (
    <>
      {iconTooltipType === 'normal' ? (
        <ZsTooltip autoRight subType={iconTooltipSubType || 'iconTool'} title={iconTooltipTitle}>
          {IconDiv()}
        </ZsTooltip>
      ) : (
        IconDiv()
      )}
    </>
  );
};
Icons.propTypes = {
  icontype: PropTypes.string,
  iconClass: PropTypes.string,
  iconTooltipTitle: PropTypes.oneOfType([PropTypes.any]),
  iconTooltipType: PropTypes.string,
  iconTooltipSubType: PropTypes.string,
  id: PropTypes.string,
};

Icons.defaultProps = {
  icontype: null,
  iconClass: '',
  iconTooltipType: '',
  iconTooltipTitle: '',
  iconTooltipSubType: '',
  id: '',
};

export default Icons;
