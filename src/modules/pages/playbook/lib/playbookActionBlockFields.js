/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import ZsInput from '../../../../components/forms/input';
import Icons from '../../../../components/icons';
import ZsTabs from '../../../../components/tabs';
import NoData from '../../../../components/NoData';

const PlaybookActionBlockFields = (props) => {
  const {
    backButtonHandler, fetchFieldsListData, onChange, setFieldsModel, filedSuggestionList,
    fieldType, setFieldType,
  } = props;
  const [searchField, setSearchField] = useState('');

  const noDataReturn = (type) => (
    <NoData
      id={`playbook_${type}_field_No_Data_Icon`}
      style={{
        height: 'auto',
        width: 'auto',
        position: 'unset',
      }}
    />
  );

  const items = [
    {
      key: 'incident',
      label: 'Incident',
      children: (
        <div className="fieldBody">
          {fetchFieldsListData.length > 0
            ? (fetchFieldsListData.filter((element) => element.name.toLowerCase()
              .includes(searchField.toLowerCase())).map((ele) => (
                <div
                  key={ele.value}
                  id={`fieldValue${ele.value}`}
                  data-test="playbookFieldValue"
                  className="singleField"
                  onClick={() => {
                    if (onChange) {
                      onChange(`\${${ele.name}}`);
                      setFieldsModel(false);
                    }
                  }}
                >
                  {ele.name}
                </div>
            ))) : (
              noDataReturn('incident')
            )}
        </div>
      ),
    },
    {
      key: 'action',
      label: 'Action',
      children: (
        <div className="fieldBody">
          {filedSuggestionList.length > 0
            ? filedSuggestionList.map((element) => (
              <div key={element.taskId}>
                {element.actionFields.filter((eleField) => eleField.name.toLowerCase()
                  .includes(searchField.toLowerCase())).length !== 0 && (
                    <div style={{ fontWeight: 'bold', color: 'rgb(76,140,236)', fontSize: '13px' }}>{element.displayName}</div>
                )}
                <div style={{ margin: '0px 10px' }}>
                  {element.actionFields.filter((eleField) => eleField.name.toLowerCase()
                    .includes(searchField.toLowerCase())).map((ele) => (
                      <div key={element.taskId.concat(ele.token)}>
                        <div
                          className="singleField"
                          id={`fieldValue${ele.value}`}
                          data-test={`actionfieldValue${ele.value}`}
                          onClick={() => {
                            if (onChange) {
                              onChange(`\${${ele.name}}/${element.taskId}`);
                              setFieldsModel(false);
                            }
                          }}
                        >

                          {ele.name}
                        </div>
                      </div>
                  ))}
                </div>
              </div>
            ))
            : (
              noDataReturn('action')
            )}
        </div>
      ),
    }];
  return (
    <div className="rightModal" style={{ height: '100%' }}>
      <div className="ant-modal-header">
        <div className="configHeaderText"> </div>
        <div className="configCloseBtn" id="configCloseBtnIcon" data-test="configCloseBtn" onClick={() => { backButtonHandler(); setFieldsModel(false); }}>
          <Icons icontype="globle" style={{ cursor: 'pointer' }} type="close" />
        </div>
      </div>
      <div className="actionTopPart">
        <div className="actionBackBtn" id="actionBackBtn" data-test="actionBackBtnIcon" onClick={() => { backButtonHandler(); setFieldsModel(false); }}>
          <Icons type="actionBack" icontype="common" className="iconLeft" />
        </div>
        <div className="actionTitle">
          <Icons type="actionBlock" icontype="globle" className="iconLeft" />
          <span className="openBlockName">Actions</span>
        </div>
      </div>
      <div className="searchContent">
        <ZsInput
          inputtype="search"
          id="Playbook_Action_block_Field_Search"
          placeholdertext="Search..."
          width="270px"
          value={searchField || ''}
          onChange={(e) => setSearchField(e.target.value)}
          searchclear={() => setSearchField('')}
        />
      </div>
      <div>
        <ZsTabs
          id="playbookFields"
          className="playbookFieldsBlock"
          scrollbtn
          tabType="box"
          data-test="playbookFields"
          defaultSetActiveTab={fieldType}
          onTabClick={(element) => setFieldType(element)}
          items={items}
        />
      </div>
    </div>
  );
};
export default PlaybookActionBlockFields;
