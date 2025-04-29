import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { NoteWrapper } from './style';
import Icons from '../../../../../../components/icons';
import NoData from '../../../../../../components/NoData';
import { convertTimeBaseTimeZoneFunction, PermissionRO } from '../../../../../../helpers/lib/StorageHandlers';
import Toaster from '../../../../../../components/toaster';
import ZsInput from '../../../../../../components/forms/input';
import ZsToggle from '../../../../../../components/forms/toggle';
import ZsModal from '../../../../../../components/modal';
import ZsTooltip from '../../../../../../components/tooltip';
import { stompClient } from '../../../../../../helpers/lib/SocketHandlers';
import { ZsSpin } from '../../../../../../components/Spin';
import ZsList from '../../../../../../components/list/ZsList';

let subscribe;

const Note = (props) => {
  const {
    IncidentId, getAllNotesAction, fakeNoteAction, addNoteAction, selectIncident,
    updateNoteAction, deleteNoteAction, MarkAsEvidenceAction, fakeEvidenceAction,
  } = props;

  const GetallNotesRes = useSelector((state) => (state.Note.GetallNotesResponse || {}));
  const AddNotesRes = useSelector((state) => (state.Note.AddNotesResponse || {}));
  const UpdateNotesRes = useSelector((state) => (state.Note.UpdateNotesResponse || {}));
  const DeleteNotesRes = useSelector((state) => (state.Note.DeleteNotesResponse || {}));
  const MarkAsEvidenceRes = useSelector((state) => (state.Evidence.MarkAsEvidenceResponse || {}));

  const [saveNote, setSaveNote] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [removeConfirm, setRemoveConfirm] = useState(false);
  const [valueEdited, setValueEdited] = useState(true);
  const [type, setType] = useState('new');
  const [notesData, setNotesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState([]);
  const [addNoteData, setAddNoteData] = useState([]);
  const [newNote, setNewNote] = useState(false);
  // const [newNoteData, setNewNoteData] = useState({});
  const [searchText, setSearchText] = useState('');
  const [newConfirm, setNewConfirm] = useState(false);
  const [saveConfirm, setSaveConfirm] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [noteDes, setNoteDes] = useState('');

  const noteUpdateStatus = (dataRes) => {
    setNotesData((prevState) => {
      const index = prevState.findIndex((e) => e.token === dataRes.data.token);
      if (index !== -1) {
        const a = prevState;
        a[index].evidence = dataRes.data.evidence;
        return [...a];
      }
      return prevState;
    });
  };

  const noteDeleteSock = (dataRes) => {
    if (dataRes.status) {
      setNotesData((prevState) => (prevState.filter((e) => e.token !== dataRes.data)));
      setNotesData((prevState) => {
        setSelectedNote((select) => {
          let a = select;
          if (select !== undefined && select.token === dataRes.data) {
            a = prevState;
            return a[0];
          }
          return select;
        });
        return prevState;
      });
    }
  };

  const onNotesdataReceived = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'note') {
      switch (dataRes.operation) {
        case 'add':
          if (dataRes.status) {
            if (parseInt(dataRes.data.incidentId) === IncidentId && dataRes.data.customerID === localStorage.getItem('customerID')) {
              setNotesData((prevState) => {
                setSelectedNote((pre) => {
                  if (prevState.length < 1) {
                    return dataRes.data;
                  }
                  return pre;
                });
                return [dataRes.data, ...prevState];
              });
            }
          }
          break;
        case 'delete':
          noteDeleteSock(dataRes);
          break;
        case 'updateStatus':
          noteUpdateStatus(dataRes);
          break;
        case 'update':
          if (dataRes.status) {
            if (parseInt(dataRes.data.incidentId) === IncidentId) {
              let searchTemp = '';
              setSearchText((pre) => { searchTemp = pre; return pre; });
              setNotesData((prevState) => {
                const index = prevState.findIndex((e) => e.token === dataRes.data.token);
                if (index !== -1) {
                  const a = prevState;
                  a[index] = dataRes.data;
                  const filterData = a.filter(
                    (d) => d.name?.toLowerCase()?.includes(searchTemp?.toLowerCase()),
                  );
                  return filterData;
                }
                return prevState;
              });
              setSelectedNote((prevState) => {
                if (prevState.token === dataRes.data.token) {
                  let a = prevState;
                  a = dataRes.data;
                  return a;
                }
                return prevState;
              });
            }
          }
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    if (stompClient && stompClient.connected) {
      const channelSub = () => {
        subscribe = stompClient.subscribe('/topic/broadcast', onNotesdataReceived);
      };
      channelSub();
      window.addEventListener('stompClientChanged', channelSub);
    }
    return () => {
      if (subscribe) { subscribe.unsubscribe(); }
      window.removeEventListener('stompClientChanged', null);
    };
  }, [stompClient.connected]);

  const setNoteDescription = useCallback((e) => {
    setValueEdited(false);
    if (e.target.innerHTML === '&nbsp;') {
      document.getElementsByClassName('editArea')[0].innerText = '';
      setNoteDes('');
      e.preventDefault();
    }
    if (e.target.innerText.length <= 650) {
      setNoteDes(e.target.innerText);
    } else {
      e.preventDefault();
    }
  }, []);

  const onKeyDwn = useCallback((e) => {
    const maxLength = 650;
    // const currentTextLength = e.target.innerText.length;
    if (document.getElementsByClassName('editArea')[0].innerText?.length >= maxLength && e.keyCode !== 8) {
      e.preventDefault();
    }
    if (document.getElementsByClassName('editArea')[0].innerText?.length >= 649 && e.keyCode === 13) {
      e.preventDefault();
    }
  }, []);

  const onPaste = useCallback((e) => {
    e.preventDefault();
    const text = e.clipboardData?.getData('text/plain');
    document.execCommand('insertText', false, text);
    const maxLength = 650;
    const currentTextLength = document.getElementsByClassName('editArea')[0].innerText?.length;
    if (currentTextLength === maxLength || currentTextLength > maxLength) {
      document.getElementsByClassName('editArea')[0].innerText = document.getElementsByClassName('editArea')[0].innerText?.substring(0, maxLength);
      setNoteDes(document.getElementsByClassName('editArea')[0].innerText);
    }
    if (document.getElementsByClassName('editArea')[0].innerText?.split('')[0].trim() === '') {
      document.getElementsByClassName('editArea')[0].innerText = '';
      setNoteDes('');
    }
  }, []);

  const addNewNote = useCallback(() => {
    // if (PermissionRO('incidents', 'notes').write) {
    if (selectIncident.status === 'Closed') {
      Toaster({ title: 'Incident is closed, you are not allowed to update incident data', type: 'error' });
    } else {
      setSubmitted(false);
      setValueEdited(true);
      setNoteDes('');
      if (document.getElementById('noteDesc') !== null) {
        document.getElementById('noteDesc').innerHTML = '';
      }
      setType('edit');
      setNewNote(true);
      setTimeout(() => {
        if (document.getElementById('notes_newName')) {
          document.getElementById('notes_newName').focus();
        }
      }, 100);
      const x = {
        createdDate: new Date(),
        description: '',
        incidentId: IncidentId,
        name: '',
        token: 'createNote',
        evidence: false,
        ownerName: JSON.parse(localStorage.getItem('U_PROFILE')).fullname,
        ownerToken: JSON.parse(localStorage.getItem('U_TOKENS')).userToken,
        type: 'note',
        createStatus: false,
      };
      // setNewNoteData(x);
      setSelectedNote(x);
      setAddNoteData(x);
    }
    // } else {
    //   Toaster({ title: "You don't have permission.", type: 'error' });
    // }
  }, [selectIncident]);

  const SingledNotes = useCallback((token) => {
    setNoteDes('');
    setNoteDes(token.description);
    setSelectedNote(token);
    const selecteAddNoteData = { ...addNoteData };
    if (newNote) {
      const x = document.getElementById('noteDesc').innerHTML;
      selecteAddNoteData.description = x;
      selecteAddNoteData.createStatus = true;
      if (selecteAddNoteData.createStatus) {
        setNotesData((prevState) => [selecteAddNoteData, ...prevState]);
      }
      setAddNoteData(selecteAddNoteData);
    }
    if (token.createStatus) {
      setNewNote(true);
      setSelectedNote(selecteAddNoteData);
      setType('edit');
      setNotesData((pre) => {
        const data = [...pre];
        data.splice(0, 1);
        return [...data];
      });
      // setNotesData((pre) => pre.shift());
    } else {
      setNewNote(false);
      setType('new');
    }
    // setNewNoteData({});
  }, [addNoteData, newNote, notesData, selectedNote]);

  const closeNewNote = useCallback(() => {
    setSaveNote(false);
    setType('new');
    setNewNote(false);
    notesData.forEach((element) => {
      if (element.token === selectedNote.token) {
        setSelectedNote(element);
        setNoteDes(element.description);
      } else {
        setSelectedNote(notesData[0]);
        setNoteDes(notesData[0].description);
      }
    });
  }, [notesData, selectedNote]);

  const notesOpen = useCallback((typeNote) => {
    if (PermissionRO('incidents', 'notes').write) {
      if (typeNote === 'edit') {
        if (selectIncident.status === 'Closed') {
          Toaster({ title: 'Incident is closed, you are not allowed to update incident data', type: 'error' });
        } else {
          setValueEdited(true);
          setType('edit');
        }
      }
    } else {
      Toaster({ title: "You don't have permission.", type: 'error' });
    }
    setSaveNote(false);
  }, [selectIncident]);

  const setNewData = useCallback((e, typeNew) => {
    setValueEdited(false);
    // const newNoteDataSet = newNoteData;
    const selectedNoteSet = { ...selectedNote };
    const selecteAddNoteData = { ...addNoteData };
    // newNoteDataSet[typeNew] = e.target.value;
    selectedNoteSet[typeNew] = e.target.value;
    selecteAddNoteData[typeNew] = e.target.value;
    // setNewNoteData({ ...newNoteDataSet });
    setAddNoteData({ ...selecteAddNoteData });
    setSelectedNote({ ...selectedNoteSet });
  }, [addNoteData, selectedNote]);

  const getCommand = useCallback((command) => {
    document.execCommand(command, false, '');
  }, []);

  const addNote = useCallback(() => {
    if (document.getElementById('noteDesc') !== null) {
      const x = document.getElementById('noteDesc').innerHTML;
      selectedNote.description = x;
      // if (!(selectedNote.name && selectedNote.description)) {
      //   setSaveConfirm(false);
      //   return;
      // }
      if (newNote) {
        setSaveNote(true);
        setSubmitLoading(true);
        addNoteAction({ ...selectedNote, incidentId: IncidentId, customerID: localStorage.getItem('customerID') });
      } else {
        setSaveNote(true);
        setSubmitLoading(true);
        setSearchText('');
        updateNoteAction({ ...selectedNote, incidentId: IncidentId, customerID: localStorage.getItem('customerID') });
      }
    }
  }, [selectIncident, selectedNote, IncidentId]);

  const saveNoteFunc = useCallback(() => {
    // setValueEdited(true);
    setSubmitted(true);
    if (!(selectedNote.name && noteDes)) {
      return;
    }
    setSaveConfirm(true);
  }, [selectedNote, noteDes]);

  const markAsEvidence = useCallback((e) => {
    if (selectIncident.status === 'Closed') {
      Toaster({ title: 'Incident is closed, you are not allowed to update incident data', type: 'error' });
    } else {
      MarkAsEvidenceAction({
        incidentId: IncidentId, type: 'note', typeViseData: e, customerID: localStorage.getItem('customerID'),
      });
    }
  }, [selectIncident, IncidentId]);

  useEffect(() => {
    const filterData = notesData.filter(
      (e) => e.name.toLowerCase().includes(searchText.toLowerCase()),
    );
    if (filterData?.length > 0 && selectedNote.length !== 0 && selectedNote[0]?.token !== 'createNote') {
      setSelectedNote(filterData[0]);
    }
  }, [searchText]);

  useEffect(() => {
    if (IncidentId > 0) {
      getAllNotesAction(IncidentId, localStorage.getItem('customerID'));
    }
  }, [IncidentId]);

  useEffect(() => {
    if (AddNotesRes.status) {
      setType('new');
      setSaveNote(false);
      setNewNote(false);
      setSubmitLoading(false);
      setSaveConfirm(false);
      setSelectedNote(AddNotesRes.data);
      fakeNoteAction();
    } else if (AddNotesRes.status === false) {
      setType('new');
      setSaveNote(false);
      setNewNote(false);
      setSubmitLoading(false);
      setSaveConfirm(false);
      setSelectedNote(notesData[0]);
      fakeNoteAction();
    }
  }, [AddNotesRes]);

  useEffect(() => {
    if (UpdateNotesRes.status) {
      setSaveConfirm(false);
      setNewNote(false);
      setType('new');
      setSaveNote(false);
      setSubmitLoading(false);
      setSelectedNote(UpdateNotesRes.data);
      setSearchText('');
      fakeNoteAction();
    } else if (UpdateNotesRes.status === false) {
      setSaveConfirm(false);
      setNewNote(false);
      setType('new');
      setSaveNote(false);
      setSubmitLoading(false);
      fakeNoteAction();
    }
  }, [UpdateNotesRes]);

  useEffect(() => {
    if (DeleteNotesRes.status) {
      setNewConfirm(false);
      setSubmitLoading(false);
      fakeNoteAction();
    } else if (DeleteNotesRes.status === false) {
      setNewConfirm(false);
      setSubmitLoading(false);
      fakeNoteAction();
    }
  }, [DeleteNotesRes]);

  useEffect(() => {
    if (MarkAsEvidenceRes.status || MarkAsEvidenceRes.status === false) {
      fakeEvidenceAction();
    }
  }, [MarkAsEvidenceRes]);
  useEffect(() => {
    if (GetallNotesRes.status) {
      if (GetallNotesRes.data.length > 0) {
        setNotesData(GetallNotesRes.data);
        if (GetallNotesRes.data && selectedNote?.token === GetallNotesRes.data.token) {
          setNoteDes(GetallNotesRes.data[0].description);
        }
        if (GetallNotesRes.data) {
          setSelectedNote((prevState) => {
            if (prevState.length < 1 && GetallNotesRes.data.length > 0) {
              let a = prevState;
              a = GetallNotesRes.data;
              return a[0];
            }
            return prevState;
          });
        }
      } else {
        setNotesData([]);
      }
      setLoading(false);
      fakeNoteAction();
    } else if (GetallNotesRes.status === false) {
      setNotesData([]);
      setLoading(false);
      fakeNoteAction();
    }
  }, [GetallNotesRes]);

  const Row = useCallback(({ index, style }) => {
    const temp = notesData.filter((e) => e.name.toLowerCase().includes(searchText.toLowerCase()));
    const n = temp[index];
    return (
      <div style={{ ...style }}>
        <div data-test="note_card" id={`note_card_${index}`} key={index} style={{ width: '207px' }} className={n.token === selectedNote?.token ? 'notesBodyContent selectedNote' : 'notesBodyContent'} onClick={() => SingledNotes(n)}>
          <div className="notesName">{n.name ? (n.token === selectedNote?.token ? selectedNote.name : n.name) : 'Enter title'}</div>
          <div className="notesTime">{n.createdDate ? convertTimeBaseTimeZoneFunction(n.createdDate) : ''}</div>
          <div className="nContent overflowText" dangerouslySetInnerHTML={{ __html: n.description ? (n.token === selectedNote?.token ? selectedNote.description : n.description) : 'Description' }} />
          <div className="nContent overflowText" style={{ display: 'flex' }}>
            Evidence:
            {' '}
            <span style={{ paddingLeft: '5px', opacity: PermissionRO('incidents', 'notes').write && n.createStatus === undefined ? '1' : '0.4', pointerEvents: n.createStatus === undefined ? 'auto' : 'none' }}>
              {' '}
              <ZsToggle data-test="notes_evidence" id={`notes_evidence_${index}`} style={{ padding: '3px 0 0 6px' }} value={n.evidence} onChange={PermissionRO('incidents', 'notes').write && n.createStatus === undefined ? () => markAsEvidence(n) : () => Toaster({ title: "You don't have permission.", type: 'error' })} />
            </span>
          </div>
        </div>
      </div>
    );
  }, [notesData, selectedNote, searchText]);

  // permission read
  if (!PermissionRO('incidents', 'notes').read) {
    return <NoData data-test="dont_have_pr_notes" message="You don't have permission to access this page" />;
  }
  return (
    <NoteWrapper data-test="note_wrapper">
      {loading ? <ZsSpin id="IncidentNoteLoading" />
        : (
          <div className="iNotes">
            <div className="iNotesLeft">
              <div className="notesListHeader">
                <div className="iHeadertitle">
                  All Notes
                </div>
                <div className="iHeaderOptions">
                  <Icons
                    id="notes_addBtn"
                    data-test="new_note_create"
                    icontype="globle"
                    type="addNewButtonSmall"
                    style={{ cursor: 'pointer', opacity: PermissionRO('incidents', 'notes').write ? (newNote === false && notesData.length > 0 && notesData[0].createStatus === undefined ? '1' : notesData.length === 0 ? '1' : '0.4') : '0.4', pointerEvents: PermissionRO('incidents', 'notes').write && newNote === false && notesData.length > 0 && notesData[0].createStatus === undefined ? 'auto' : notesData.length === 0 ? 'auto' : 'none' }}
                    onClick={PermissionRO('incidents', 'notes').write ? () => addNewNote() : () => Toaster({ title: "You don't have permission.", type: 'error' })}
                    className="addNotesIcon"
                    height={25}
                    width={25}
                  />
                </div>
              </div>
              <div style={{ margin: '0 5px 7px 5px', width: '210px' }}>
                <ZsInput
                  inputtype="search"
                  id="notes_searchText"
                  placeholdertext="Search.."
                  value={searchText || ''}
                  width="210px"
                  onChange={(e) => setSearchText(e.target.value)}
                  searchclear={() => {
                    setTimeout(() => {
                      setSearchText('');
                    }, 200);
                  }}
                />
              </div>
              <div className="notesBody" style={{ height: newNote ? 'calc(100% - 145px)' : 'calc(100% - 85px)' }}>
                {newNote === true && selectedNote.token === 'createNote'
                  ? (
                    <div className="notesBodyContent selectedNote" style={{ minHeight: '50px', width: '207px' }}>
                      <div className="notesName">{selectedNote.name ? selectedNote.name : ''}</div>
                      <div className="notesTime">{convertTimeBaseTimeZoneFunction(new Date())}</div>
                    </div>
                  )
                  : null}
                {notesData.length > 0 && notesData?.filter((e) => e.name.toLowerCase()
                  .includes(searchText.toLowerCase())).length > 0 && (
                    <ZsList
                      id="Incident_Notes_List"
                      data={notesData?.filter((e) => e.name.toLowerCase()
                        .includes(searchText.toLowerCase()))}
                      rowHeight={107}
                      overscanCount={3}
                      Row={Row}
                    />
                )}
                {notesData.filter((e) => e.name.toLowerCase()
                  .includes(searchText.toLowerCase())).length === 0 && (
                    <NoData style={{ height: 'calc(100vh - 430px)' }} />
                )}
              </div>
            </div>
            <div className="iNoteRight">
              {newNote === true || (notesData && notesData.filter((e) => e.name.toLowerCase()
                .includes(searchText.toLowerCase())).length > 0)
                ? (
                  <div className="iRightHeader">
                    <div className="notesDetailTime">{selectedNote && selectedNote.createdDate ? convertTimeBaseTimeZoneFunction(selectedNote.createdDate) : ''}</div>
                    {type === 'new' ? (
                      <span>
                        <Icons
                          id="notes_editIcn"
                          icontype="globle"
                          type="edit"
                          style={{ opacity: PermissionRO('incidents', 'notes').write ? '1' : '0.4' }}
                          className="noteEditIcon"
                          data-test="note_edit"
                          onClick={() => notesOpen('edit')}
                        />
                        <Icons
                          id="notes_deleteIcn"
                          type="delete"
                          icontype="globle"
                          style={{ opacity: PermissionRO('incidents', 'notes').write ? '1' : '0.4' }}
                          className="noteDeleteIcon"
                          data-test="delete_note"
                          onClick={() => {
                            if (PermissionRO('incidents', 'notes').delete) {
                              if (selectIncident.status === 'Closed') {
                                Toaster({ title: 'Incident is closed, you are not allowed to update incident data', type: 'error' });
                              } else {
                                setNewConfirm(true);
                              }
                            } else {
                              Toaster({ title: "You don't have permission.", type: 'error' });
                            }
                          }}
                        />
                      </span>
                    )
                      : (
                        <span>
                          <ZsTooltip autoRight subType="iconTool" title="Save">
                            {saveNote ? <span className="fa fa-spinner fa-spin noteSaveIcon" />
                              : (
                                <Icons
                                  id="notes_saveIcn"
                                  type="save"
                                  icontype="common"
                                  className="noteSaveIcon"
                                  data-test="note_save_icon"
                                  style={{ cursor: 'pointer', opacity: valueEdited ? '0.4' : '1', pointerEvents: valueEdited ? 'none' : 'auto' }}
                                  onClick={() => saveNoteFunc()}
                                />
                              )}
                          </ZsTooltip>

                          <Icons
                            id="notes_pluseIcn"
                            type="plus"
                            icontype="globle"
                            className="adIcon noteCloseIcon"
                            data-test="note_close_icon"
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              setRemoveConfirm(true);
                            }}
                          />
                        </span>
                      )}
                    {type !== 'new' ? (
                      <div className="notesName">
                        <ZsInput
                          onChange={(e) => setNewData(e, 'name')}
                          id="notes_newName"
                          data-test="Title_notes_newName"
                          maxLength="normal"
                          style={{
                            background: 'transparent', fontSize: '14px', padding: '3px 20px 5px', color: '#fff', border: 'transparent', width: '90%', height: '26px', borderRadius: 5, outline: 'none', boxShadow: ' 0 0 0px 1px #2f3133', marginTop: 5,
                          }}
                          className="noteTitle"
                          placeholdertext="Enter title"
                          // whiteSpace={false}
                          inputtype="normal"
                          error={submitted && selectedNote.name === '' ? 'true' : null}
                          errormsg="Title required."
                          value={selectedNote && (selectedNote.name || '')}
                        />
                      </div>
                    )
                      : <div className="notesDetailName">{selectedNote && (selectedNote.name || '')}</div>}
                  </div>
                )
                : null}
              {newNote === true || (notesData && notesData.filter((e) => e.name.toLowerCase()
                .includes(searchText.toLowerCase())).length > 0)
                ? (
                  <div className="iRightBody" id="toolbar">
                    {type !== 'new'
                      ? (
                        <div className="editControls">
                          <div className="controlGroup">
                            <Icons id="notes_bold" data-test="notes_bold" icontype="common" type="bold" className="eControl" onClick={() => getCommand('bold')} />
                            <Icons id="notes_italic" data-test="incidents_notes_italic" icontype="common" type="italic" className="eControl" onClick={() => getCommand('italic')} />
                            <Icons id="notes_underline" data-test="notes_underline" icontype="common" type="underline" className="eControl" onClick={() => getCommand('underline')} />
                          </div>
                          <div className="controlGroup">
                            <Icons id="notes_justifyLeft" data-test="incidents_notes_justifyLeft" icontype="common" type="leftAlign" className="eControl" onClick={() => getCommand('justifyLeft')} />
                            <Icons id="notes_justifyCenter" data-test="incidents_notes_justifyCenter" icontype="common" type="centerAlign" className="eControl" onClick={() => getCommand('justifyCenter')} />
                            <Icons id="notes_justifyRight" data-test="incidents_notes_justifyRight" icontype="common" type="rightAlign" className="eControl" onClick={() => getCommand('justifyRight')} />
                          </div>
                          <div className="controlGroup">
                            <Icons id="notes_indent" data-test="incidents_notes_indent" type="incIndent" icontype="common" className="eControl" onClick={() => getCommand('indent')} />
                            <Icons id="notes_outdent" data-test="incidents_notes_outdent" type="decIndent" icontype="common" className="eControl" onClick={() => getCommand('outdent')} />
                            <Icons id="notes_insertUnorderedList" data-test="incidents_notes_insertUnorderedList" type="bulletList" icontype="common" className="eControl" onClick={() => getCommand('insertUnorderedList')} />
                          </div>
                          <div className="descriptionCount">
                            (
                            {document.getElementsByClassName('editArea')[0]?.innerText !== undefined ? document.getElementsByClassName('editArea')[0]?.innerText.substring(0, 650).length : 0}
                            / 650)
                          </div>
                        </div>
                      )
                      : null}
                    {
                      type === 'edit' && selectedNote
                      && (
                        <>
                          <div
                            ref={function (e) {
                              if (e != null) e.contentEditable = (type !== 'new');
                            }}
                            className="editArea"
                            placeholder="Enter description"
                            id="noteDesc"
                            onInput={(e) => setNoteDescription(e)}
                            onKeyDown={(e) => onKeyDwn(e)}
                            onPaste={(e) => onPaste(e)}
                            onDrop={(e) => onPaste(e)}
                            data-test="note_description"
                            dangerouslySetInnerHTML={{ __html: selectedNote.description || '' }}
                          />
                          {submitted && !noteDes && (
                            <div className="errorMsg">
                              Description required.
                              <sup>*</sup>
                            </div>
                          )}
                        </>
                      )
                    }
                    {selectedNote && type === 'new' && (
                      <>
                        <div
                          ref={function (e) {
                            if (e != null) e.contentEditable = (type !== 'new');
                          }}
                          className="editArea"
                          placeholder="Enter description"
                          id="noteDesc"
                          data-test="note_description"
                          dangerouslySetInnerHTML={{ __html: selectedNote?.description.trim() || '' }}
                        />
                      </>
                    )}
                  </div>
                )
                : (
                  <div className="emptyContent">
                    <div className="mainHeading">You have not added a note yet</div>
                    <div style={{ textAlign: 'left' }} contentEditable={false}>
                      Click on the
                      <span id="new_note_create_when_right_part_empty" className="btnImg" onClick={() => addNewNote()}><Icons icontype="globle" type="plus" className="zsIcon" /></span>
                      {' '}
                      icon to create a new note.
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}
      <ZsModal
        visible={saveConfirm}
        modaltype="confirm"
        msg="Are you sure you want to save this note ?"
        title="Save Note"
        id="save_note_incident"
        type
        data-test="save_note_incident"
        loading={submitLoading}
        onOk={() => addNote()}
        confirmType
        onCancel={() => {
          // notesOpen('new');
          setSaveConfirm(false);
        }}
        closeModal={() => { setSaveConfirm(false); setSubmitLoading(false); }}
      />
      <ZsModal
        visible={removeConfirm}
        // className="saveNotesModal"
        modaltype="confirm"
        msg="Are you sure you want to remove this note ?"
        title="Warning"
        id="remove_note_incident"
        type={false}
        loading={submitLoading}
        onOk={() => {
          closeNewNote();
          setRemoveConfirm(false);
        }}
        onCancel={() => {
          setRemoveConfirm(false);
        }}
      />
      <ZsModal
        visible={newConfirm}
        modaltype="confirm"
        msg="Are you sure to delete this note ?"
        title="Warning"
        type={false}
        id="delete_incident_notes"
        data-test="delete_incident_notes"
        loading={submitLoading}
        onOk={() => { deleteNoteAction(selectedNote.token, IncidentId, localStorage.getItem('customerID')); setSubmitLoading(true); }}
        onCancel={() => {
          setSubmitLoading(false);
          setNewConfirm(false);
        }}
      />
    </NoteWrapper>
  );
};
Note.propTypes = {
  getAllNotesAction: PropTypes.func,
  fakeNoteAction: PropTypes.func,
  addNoteAction: PropTypes.func,
  updateNoteAction: PropTypes.func,
  deleteNoteAction: PropTypes.func,
  MarkAsEvidenceAction: PropTypes.func,
  fakeEvidenceAction: PropTypes.func,
  IncidentId: PropTypes.number,
  selectIncident: PropTypes.oneOfType([
    PropTypes.object,
  ]),
};

Note.defaultProps = {
  getAllNotesAction: null,
  fakeNoteAction: null,
  addNoteAction: null,
  updateNoteAction: null,
  deleteNoteAction: null,
  MarkAsEvidenceAction: null,
  fakeEvidenceAction: null,
  IncidentId: 0,
  selectIncident: {},
};
export default Note;
