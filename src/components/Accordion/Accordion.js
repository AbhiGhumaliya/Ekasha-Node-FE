import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AccordionItem from './AccordionItem';
import ZsAcordianWrapper from './styles';

const Accordion = (props) => {
  const {
    defaultIndex, onItemClick, children, apiCall,
  } = props;
  const [bindIndex, setBindIndex] = useState(defaultIndex);

  const changeItem = (itemIndex, id) => {
    if (typeof onItemClick === 'function') onItemClick(itemIndex);
    if (itemIndex !== bindIndex) {
      setBindIndex(itemIndex);
      apiCall(null);
      apiCall(id);
    } else {
      apiCall(null);
      setBindIndex('');
    }
  };

  return (
    <ZsAcordianWrapper>
      {children.map((data, i) => (
        <div className="wrapperData" key={i}>
          <AccordionItem
            isCollapsed={bindIndex !== data.props.index}
            labelDate={data.props.labelDate}
            labelName={data.props.labelName}
            rawlogloading={data.props.rawlogloading}
            handleClick={() => changeItem(data.props.index, data.props.id)}
            dataChildren={data.props.children}
          />
        </div>
      ))}
    </ZsAcordianWrapper>
  );
};
Accordion.propTypes = {
  children: PropTypes.oneOfType([PropTypes.any]),
  onItemClick: PropTypes.func,
  apiCall: PropTypes.func,
  defaultIndex: PropTypes.string,
};

Accordion.defaultProps = {
  children: null,
  onItemClick: null,
  apiCall: null,
  defaultIndex: '',
};
export default Accordion;
