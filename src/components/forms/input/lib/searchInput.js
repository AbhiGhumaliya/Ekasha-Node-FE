/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
import React from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';
import Icons from '../../../icons';
import { ZsSearchInputWrapper } from '../styles';

export const ZsSearchInput = (props) => {
  const {
    width, id, placeholdertext, value, onChange, searchclear, searchclearIcon,
  } = props;

  const suffix1 = (
    <Icons
      id={`Global_search_Icon${id}`}
      icontype="globle"
      type="search"
      className="zsIcon searchIcon"
    />
  );
  const suffix = (
    <Icons
      id={`ekasha_searchInput_clearSearch_${id}`}
      type="error"
      className="clearSerach"
      icontype="common"
      onClick={searchclear}
      data-test={`ekasha_searchInput_clearSearch_${id}`}
    />
  );

  return (
    <ZsSearchInputWrapper>
      <Input
        className="searchBr"
        autoComplete="off"
        id={id}
        data-test={`ekasha_searchInput_${id}`}
        placeholder={placeholdertext}
        style={{ width, border: 'none', borderRadius: '5px' }}
        onChange={onChange}
        value={value}
        suffix={value && searchclearIcon ? suffix : suffix1}
      />
    </ZsSearchInputWrapper>
  );
};
ZsSearchInput.propTypes = {
  id: PropTypes.string.isRequired,
  width: PropTypes.string,
  placeholdertext: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  searchclear: PropTypes.func,
  searchclearIcon: PropTypes.bool,
};

ZsSearchInput.defaultProps = {
  width: '220px',
  placeholdertext: 'Search',
  value: null,
  onChange: null,
  searchclear: null,
  searchclearIcon: true,
};
