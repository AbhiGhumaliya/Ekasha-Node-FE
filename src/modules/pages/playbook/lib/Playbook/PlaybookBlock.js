/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ZsButton from '../../../../../components/forms/button';
import ZsInput from '../../../../../components/forms/input';
import Icons from '../../../../../components/icons';
import NoData from '../../../../../components/NoData';
import { ZsSpin } from '../../../../../components/Spin';
import AddNotes from '../blocks/addNotes';
import { PlaybookBlockWrapper } from './PlaybookBlockWrapper';

const PlaybookBlock = (props) => {
  const {
    setPlaybookType, setSubDrawer, getNewAllPlaybookBlockActionAPI, fakePlaybookActionAPI,
    addTask, playbookData, setPlaybookData, selectPlaybookToken, setSelectPlaybookToken,
    playbookBlockType, playbookNoteStatus, setPlaybookNoteStatus, match,
    setPlaybookValueEdited, playbookValueEdited, taskDrawerClose,
  } = props;
  const [searchPlaybook, setSearchPlaybook] = useState('');
  const [playbookBlockList, setPlaybookBlockList] = useState([]);
  const [playbookBlockLoading, setPlaybookBlockLoading] = useState(false);

  // redux state
  const GetNewAllPlaybookBlockRes = useSelector(
    (state) => (state.PlayBook.GetNewAllPlaybookBlockResponse || {}),
  );

  useEffect(() => {
    if (GetNewAllPlaybookBlockRes.status) {
      setPlaybookBlockList(GetNewAllPlaybookBlockRes.data);
      setPlaybookBlockLoading(false);
      fakePlaybookActionAPI();
    } else if (GetNewAllPlaybookBlockRes.status === false) {
      setPlaybookBlockList([]);
      setPlaybookBlockLoading(false);
      fakePlaybookActionAPI();
    }
  }, [GetNewAllPlaybookBlockRes]);

  useEffect(() => {
    setPlaybookValueEdited(true);
    setSelectPlaybookToken('');
    getNewAllPlaybookBlockActionAPI();
    setPlaybookBlockLoading(true);
  }, []);

  const selectPlaybookBlockHandler = (data) => {
    const dataSet = playbookData;
    setPlaybookValueEdited(false);
    setSelectPlaybookToken(data.id);
    dataSet.assetName = data.name;
    dataSet.actionToken = data.id;
    dataSet.scriptarguments = { playbook: data.id };
    setPlaybookData({ ...dataSet });
  };

  const savePlaybookBlock = () => {
    const dataSet = playbookData;
    dataSet.type = 'playbook';
    dataSet.isPlaybook = true;
    dataSet.configrationStatus = true;
    dataSet.playbookToken = selectPlaybookToken;
    setPlaybookData({ ...dataSet });
    addTask('playbook', dataSet);
  };
  useEffect(() => {
    if (document.getElementById('viewScroll')) {
      const dd = document.getElementById('viewScroll');
      dd.scrollIntoView();
    }
  }, [playbookBlockList]);

  const addNote = (e) => {
    const dataSet = playbookData;
    dataSet.note = { cNotes: e };
    dataSet.type = 'playbook';
    dataSet.isPlaybook = true;
    dataSet.playbookToken = selectPlaybookToken;
    setPlaybookData({ ...dataSet });
    addTask('playbook', dataSet);
  };

  return (
    <PlaybookBlockWrapper>
      <div className="rightData">
        <div className="rightModal" style={{ height: '100%' }}>
          <div className="ant-modal-header">
            <div className="configHeaderText"> </div>
            <div className="configCloseBtn" id="PlaybookBlock_closeBtn" onClick={() => taskDrawerClose()}>
              <Icons icontype="globle" style={{ cursor: 'pointer' }} type="close" />
            </div>
          </div>
          {!playbookNoteStatus ? (
            <>
              <div className="actionTopPart">
                <div
                  id="PlaybookBlock_playbookBlockTypeBtn"
                  className={playbookBlockType === 'edit' ? 'actionBackBtnDisable' : 'actionBackBtn'}
                  onClick={() => { setPlaybookType(false); setSubDrawer(false); }}
                >
                  <Icons type="actionBack" icontype="common" className="iconLeft" />
                </div>
                <div className="actionTitle">
                  <Icons type="playbookBlock" icontype="globle" className="iconLeft" style={{ cursor: 'default' }} />
                  <span className="openBlockName">Playbook</span>
                </div>
              </div>
              <div className="searchContent">
                <ZsInput
                  inputtype="search"
                  id="Playbook_playbook_block_playbook_Search"
                  placeholdertext="Search..."
                  width="270px"
                  value={searchPlaybook || ''}
                  onChange={(e) => setSearchPlaybook(e.target.value)}
                  searchclear={() => setSearchPlaybook('')}
                />
              </div>
              <div className="wrapContent" id="playbookWrap">
                {playbookBlockLoading ? <ZsSpin size="middle" id="PlaybookBlockLoading" />
                  : (
                    <>
                      {playbookBlockList.length > 0 && playbookBlockList.filter(
                        (e) => e.name.toLowerCase().includes(
                          searchPlaybook.toLowerCase(),
                        ),
                      ).map((d, i) => (
                        <div
                          key={i}
                          className="wrap"
                          id={selectPlaybookToken === d.id ? 'viewScroll' : 'view'}
                          style={{
                            border: selectPlaybookToken === d.id ? '1px solid #5985C4' : '1px solid #1A1C1D',
                            opacity: (match.params.type === 'edit' && match.params.playbookId === d.id) || d.isDeleted ? 0.4 : 1,
                            pointerEvents: (match.params.type === 'edit' && match.params.playbookId === d.id) || d.isDeleted ? 'none' : 'auto',
                          }}
                          onClick={() => selectPlaybookBlockHandler(d)}
                        >
                          <div className="overflowText">{d.name}</div>
                        </div>
                      ))}
                    </>
                  )}
                {!playbookBlockLoading && playbookBlockList.length === 0 && (<NoData />)}
              </div>
              <div style={{ marginTop: '10px' }}>
                <ZsButton
                  id="action_launch"
                  style={{ width: '100%' }}
                  className="playbookSaveBtn"
                  // loading={actionLoading}
                  disabled={playbookValueEdited}
                  onClick={() => savePlaybookBlock()}
                  title="Add"
                />
              </div>

            </>
          )
            : (
              <AddNotes
            // previewNote={preview}
                cNotes={playbookData.note.cNotes ? playbookData.note.cNotes : ''}
                closeNotes={() => setPlaybookNoteStatus(false)}
                onChange={(e) => addNote(e)}
              />
            )}
        </div>
      </div>
    </PlaybookBlockWrapper>
  );
};
export default PlaybookBlock;
