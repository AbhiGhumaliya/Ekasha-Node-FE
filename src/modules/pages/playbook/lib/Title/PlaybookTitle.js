/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import ZsButton from '../../../../../components/forms/button';
import ZsInput from '../../../../../components/forms/input';
import Icons from '../../../../../components/icons';
import AddNotes from '../blocks/addNotes';
import { PlaybookTitleWrapper } from './PlaybookTitleWrapper';

const PlaybookTitle = (props) => {
  const {
    actionTaskType, setActionTaskType, EditTitleTask, fakePlaybookActionAPI, addTask,
    setSubDrawer, titleLoading, setTitleLoading,
  } = props;

  const [addNotes, setAddNotes] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mainData, setMainData] = useState({
    note: {},
  });

  useEffect(() => {
    if (EditTitleTask !== undefined && EditTitleTask.type === 'EDIT_TITLE_TASK') {
      setMainData(EditTitleTask.payload.data);
      setActionTaskType('edit');
      if (EditTitleTask.payload.addNotes) {
        setAddNotes(true);
      }
      //   if (EditTitleTask.payload.preview) {
      //     setPreview(true);
      //   }
      fakePlaybookActionAPI();
    }
  }, [EditTitleTask]);

  const addNote = (e) => {
    const dataSet = mainData;
    dataSet.type = 'title';
    dataSet.note = { cNotes: e };
    setMainData({ ...dataSet });
    setAddNotes(false);
    addTask('title', mainData);
  };

  const setDataFun = (e, field) => {
    const dataSet = mainData;
    dataSet[field] = e;
    setMainData({ ...dataSet });
  };
  const save = () => {
    setSubmitted(true);
    setTimeout(() => {
      const dataSet = mainData;
      if (!(dataSet.assetName && dataSet.actionName)) {
        return;
      }
      setTitleLoading(true);
      dataSet.type = 'title';
      setMainData({ ...dataSet });
      addTask('title', dataSet);
    }, 200);
  };
  return (
    <PlaybookTitleWrapper>
      <div className="playbookTitleBody">
        {!addNotes ? (
          <>
            <div className="actionTopPart">
              <div
                id="PlaybookTitle_actionBack"
                className={actionTaskType === 'edit' ? 'actionBackBtnDisable' : 'actionBackBtn'}
                onClick={() => setSubDrawer(false)}
              >
                <Icons type="actionBack" icontype="common" className="iconLeft" />
              </div>
              <div className="actionTitle">
                <Icons type="playbookTitle" icontype="globle" className="iconLeft" style={{ cursor: 'default' }} />
                <span className="openBlockName">Title</span>
              </div>
            </div>
            <div className="titleWrap">
              <div className="spacing" style={{ height: '80px' }}>
                <ZsInput
                  inputtype="normal"
                  id="add_note_playbook"
                  label="Title"
                  requiredentry
                  maxLength="normal"
            //   disabled={preview}
                  value={mainData.assetName || null}
                  placeholder="Enter title"
                  onChange={(e) => setDataFun(e.target.value, 'assetName')}
                  error={submitted && !mainData.assetName}
                  errormsg="Title is required."
                />
              </div>
              <div className="spacing" style={{ height: '280px' }}>
                <ZsInput
                  rows={4}
                  inputtype="normal"
                  id="Admin_Assets_description"
                  textarea
                  label="Description"
                  requiredentry
                  maxLength="sixFiveZero"
                  autoSize={{ minRows: 12.7, maxRows: 12.7 }}
                  value={mainData.actionName || null}
                //   maxLength="twoFiftyFive"
                  onChange={(e) => setDataFun(e.target.value, 'actionName')}
                  placeholdertext="Enter description"
                  error={submitted && !mainData.actionName}
                  errormsg="Description is required."
                />
              </div>
            </div>
            <div style={{ marginTop: '7px' }}>
              <ZsButton
                id="action_launch"
                style={{ width: '100%' }}
                className="playbookSaveBtn"
                onClick={() => save()}
                loading={titleLoading}
                title="Add"
              />
            </div>
          </>
        ) : (
          <AddNotes
            // previewNote={preview}
            cNotes={mainData.note.cNotes || ''}
            closeNotes={() => setAddNotes(false)}
            onChange={(e) => addNote(e)}
          />
        )}
      </div>
    </PlaybookTitleWrapper>
  );
};
export default PlaybookTitle;
