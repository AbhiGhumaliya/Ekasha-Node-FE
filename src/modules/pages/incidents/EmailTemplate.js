import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ZsModal from '../../../components/modal';
import ZsInput from '../../../components/forms/input';
import { RegexList } from '../../../helpers/lib/RegexList';
import Icons from '../../../components/icons';
import { EmailModelWrapper } from './lib/IncidentsWrapper';
import { ChipColorArray } from '../../../helpers/envData';

const EmailTemplate = React.memo((props) => {
  const {
    templateData, submitTemplate,
    errorStatus, setErrorStatus, submitLoading, closeHandler, setValueEdited,
    modalVisible, toMailData, setToMailData, ccMailData, setCcMailData, subjectData,
  } = props;

  const [emailData, setEmailData] = useState({ toname: '', tocc: '', subject: subjectData });
  const [invalidTo, setInvalidTo] = useState(false);
  const [dataDragValue, setDataDragValue] = useState([]);

  const getColor = (index) => ChipColorArray[index % ChipColorArray.length];

  const valueBlurFunc = useCallback((findex, sindex) => {
    errorStatus[findex].errorData[sindex].valueError = false;
    setErrorStatus([...errorStatus]);
  }, [errorStatus]);

  const setData = useCallback((value, findex) => {
    setValueEdited(false);
    if (typeof findex === 'string') {
      emailData[findex] = value;
    }
    if (value === '') {
      setInvalidTo(false);
    }
    setEmailData({ ...emailData });
  }, [emailData]);

  const checkValidMail = useCallback((value, type) => {
    const re = RegexList.email;
    const vals = [...toMailData];
    const vals1 = [...ccMailData];
    if (value !== '') {
      if (re.test(value)) {
        if (type === 'toname') {
          if (!toMailData.includes(value)) {
            vals.push(value);
          }
          emailData.toname = '';
          setToMailData([...vals]);
          setEmailData(emailData);
          setInvalidTo(false);
        }
        if (type === 'tocc') {
          if (!ccMailData.includes(value)) {
            vals1.push(value);
          }
          emailData.tocc = '';
          setCcMailData([...vals1]);
          setEmailData(emailData);
        }
      } else if (type === 'toname') {
        setInvalidTo(true);
      }
    } else {
      setInvalidTo(false);
    }
  }, [emailData, toMailData, ccMailData]);

  const removeMe = useCallback((index, type) => {
    if (type === 'toname') {
      const emailFields = [...toMailData];
      emailFields.splice(index, 1);
      setValueEdited(false);
      setToMailData(emailFields);
      document.getElementById('IncidentDetailView_EmailTemplate_To_Field_Input').focus();
    } else if (type === 'tocc') {
      const emailFields = [...ccMailData];
      emailFields.splice(index, 1);
      setValueEdited(false);
      setCcMailData(emailFields);
      document.getElementById('IncidentDetailView_EmailTemplate_Cc_Field_Input').focus();
    }
  }, [toMailData, ccMailData]);

  const editTag = useCallback((data, index, type) => {
    if (type === 'toname') {
      const emailFields = [...toMailData];
      emailFields.splice(index, 1);
      setToMailData(emailFields);
      emailData.toname = data;
      setEmailData(emailData);
      document.getElementById('IncidentDetailView_EmailTemplate_To_Field_Input').focus();
    }
    if (type === 'tocc') {
      const emailFields = [...ccMailData];
      emailFields.splice(index, 1);
      setCcMailData(emailFields);
      emailData.tocc = data;
      setEmailData(emailData);
      document.getElementById('IncidentDetailView_EmailTemplate_Cc_Field_Input').focus();
    }
  }, [emailData, toMailData, ccMailData]);

  const drop = useCallback((event, type) => {
    event.preventDefault();
    const dataddd = [...dataDragValue];
    if (type === 'cc') {
      if (dataddd[2].typ === 'to') {
        const d = [...toMailData];
        d.splice(dataddd[1].ind, 1);
        setToMailData([...d]);
      }
      if (ccMailData[dataddd[1].ind] !== dataddd[0].ddd) {
        const dadd = [...ccMailData, dataddd[0].ddd];
        setCcMailData([...dadd]);
      }
    }
    if (type === 'to') {
      if (dataddd[2].typ === 'cc') {
        const d = [...ccMailData];
        d.splice(dataddd[1].ind, 1);
        setCcMailData([...d]);
      }
      if (toMailData[dataddd[1].ind] !== dataddd[0].ddd) {
        const dadd = [...toMailData, dataddd[0].ddd];
        setToMailData([...dadd]);
      }
    }
  }, [dataDragValue, toMailData, ccMailData]);

  const mouseDown = useCallback((value) => {
    const re = RegexList.email;
    const vals = [...toMailData];
    const vals1 = [...ccMailData];
    if (value.toname !== '') {
      if (re.test(value.toname)) {
        if (!toMailData.includes(value.toname)) {
          vals.push(value.toname);
        }
        emailData.toname = '';
        setToMailData([...vals]);
        setEmailData(emailData);
        setInvalidTo(false);
      } else {
        setInvalidTo(true);
      }
    } else if (value.toname === '') {
      setInvalidTo(false);
    }
    if (value.tocc !== '') {
      if (re.test(value.tocc)) {
        if (!ccMailData.includes(value.tocc)) {
          vals1.push(value.tocc);
        }
        emailData.tocc = '';
        setCcMailData([...vals1]);
        setEmailData(emailData);
      } else {
        emailData.tocc = '';
        setEmailData({ ...emailData });
      }
    }
  }, [emailData, toMailData, ccMailData]);

  const onDragSt = useCallback((data, index, type) => {
    if (type === 'to') {
      const datad = [];
      setDataDragValue([...datad, { ddd: data }, { ind: index }, { typ: type }]);
    }
    if (type === 'cc') {
      const datad = [];
      setDataDragValue([...datad, { ddd: data }, { ind: index }, { typ: type }]);
    }
  }, []);

  const backRemove = useCallback((e, type) => {
    if (e.keyCode === 8) {
      if (type === 'to') {
        if (emailData.toname === '') {
          if (toMailData.length > 0) {
            toMailData.splice(toMailData.length - 1, 1);
            setToMailData([...toMailData]);
          }
        }
      }
      if (type === 'cc') {
        if (emailData.tocc === '') {
          if (ccMailData.length > 0) {
            ccMailData.splice(ccMailData.length - 1, 1);
            setCcMailData([...ccMailData]);
          }
        }
      }
    } else if (e.keyCode === 9) {
      mouseDown(emailData);
    }
  }, [emailData, toMailData, ccMailData]);

  const dragOver = useCallback((event) => {
    event.preventDefault();
  }, []);

  const getCommand = useCallback((command) => {
    document.execCommand(command, false, '');
  }, []);

  const onKeyDwn = useCallback((e) => {
    const maxLength = 200;
    const currentTextLength = e.target.innerText.length;
    if (currentTextLength === maxLength && e.keyCode !== 8) {
      e.preventDefault();
    }
  }, []);

  const onPaste = useCallback((e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  }, []);

  const submitData = useCallback(() => {
    const data = {
      subject: emailData.subject,
      emailBody: ((document.getElementById('getHtmlCode').innerHTML)
        .split('margin-bottom: 2px;')
        .join('margin-bottom: 6px;')
        .split('padding: 6px 10px;')
        .join('padding: 1px 15px;')
        .split('padding-bottom: 2px;')
        .join('padding-bottom: 4px;')),
    };
    if (!invalidTo) {
      submitTemplate(data);
    }
  }, [emailData, invalidTo]);

  useEffect(() => {
    if (document.getElementById('IncidentDetailView_EmailTemplate_Email_Body')) {
      document.getElementById('IncidentDetailView_EmailTemplate_Email_Body').focus();
    }
    if (closeHandler) {
      setToMailData([]);
      setCcMailData([]);
    }
  }, []);

  return (
    <ZsModal
      id="IncidentDetailView_EmailTemplate_Modal"
      modaltype="simple"
      title="Email"
      onHide={() => closeHandler()}
      className="createIncidentEmailTemplate"
      show={modalVisible}
      centered
    >
      <EmailModelWrapper>
        <div
          id="IncidentDetailView_EmailTemplate_MainEmailBody"
          style={{ border: '1px solid #262525', fontSize: '12px' }}
          className="mainEmailBody"
          onMouseDown={() => mouseDown(emailData)}
        >
          <div style={{ borderBottom: '1px solid #262525', padding: '10px 25px' }}>
            <div
              id="IncidentDetailView_EmailTemplate_Send_Mail_Button"
              className="preButtonAction"
              style={{ opacity: (toMailData.length === 0 || submitLoading) ? 0.6 : 1, pointerEvents: (toMailData.length === 0 || submitLoading) ? 'none' : 'auto' }}
              onClick={() => submitData()}
            >
              {submitLoading
            && (
            <>
              {' '}
              <Icons
                className="loadingReport"
                style={{
                  cursor: 'pointer', lineHeight: '30px', marginRight: '8px', marginLeft: '5px',
                }}
                icontype="globle"
                type="loading"
              />
            </>
            )}
              {!submitLoading
            && (
            <>
              {' '}
              <Icons
                icontype="common"
                type="sendEmail"
                style={{
                  cursor: 'pointer', lineHeight: '30px', marginRight: '8px', marginLeft: '5px',
                }}
              />
            </>
            )}
              <div className="preHeaderBtnText">Send</div>
            </div>
          </div>
          <div style={{ borderBottom: '1px solid #262525' }}>

            <div
              id="IncidentDetailView_EmailTemplate_To_Field"
              style={{
                padding: '5px 25px', display: 'flex', alignItems: 'center',
              }}
              onDrop={(e) => drop(e, 'to')}
              onDragOver={(e) => dragOver(e)}
            >
              To
              <div
                className="mailRecipient"
                style={{
                  display: 'flex', flexWrap: 'wrap', paddingLeft: '25px', width: '100%',
                }}
              >
                {toMailData.length > 0 && toMailData.map((d, i) => (
                  <span className="tags" style={{ background: getColor(i) }} key={i} onDragStart={() => onDragSt(d, i, 'to')} draggable="true">
                    <Icons type="userIcon" icontype="common" className="actionApprove" />
                    <span
                      id={`IncidentDetailView_EmailTemplate_To_Field_ChipTag_${i}`}
                      onClick={() => editTag(d, i, 'toname')}
                      data-test="ekasha_edit_field"
                      style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
                    >
                      {d}
                    </span>
                    <Icons
                      id={`IncidentDetailView_EmailTemplate_To_Field_ChipTag_Remove_${i}`}
                      data-test="ekasha_remove_field"
                      icontype="globle"
                      type="close"
                      className="closeChip"
                      style={{ marginLeft: '6px', marginTop: '-2px', cursor: 'pointer' }}
                      onClick={() => removeMe(i, 'toname')}
                    />
                  </span>
                ))}
                <ZsInput
                  inputtype="normal"
                  id="IncidentDetailView_EmailTemplate_To_Field_Input"
                  maxLength="threeTwoZero"
                  width="100%"
                  style={{ marginTop: '3px' }}
                  onKeyDown={(e) => backRemove(e, 'to')}
                  onPressEnter={(e) => checkValidMail(e.target.value, 'toname')}
                  onChange={(e) => setData(e.target.value, 'toname')}
                  value={emailData.toname ? emailData.toname : ''}
                />
              </div>
            </div>
            {invalidTo && (
            <span style={{ fontSize: '11px', paddingLeft: '25px', color: 'red' }}>
              Enter valid email
            </span>
            )}
          </div>
          <div style={{ borderBottom: '1px solid #262525' }}>

            <div
              id="IncidentDetailView_EmailTemplate_Cc_Field"
              style={{
                padding: '5px 25px', display: 'flex', alignItems: 'center',
              }}
              onDrop={(e) => drop(e, 'cc')}
              onDragOver={(e) => dragOver(e)}
            >
              CC
              <div
                className="mailRecipient"
                style={{
                  display: 'flex', flexWrap: 'wrap', paddingLeft: '24px', width: '100%',
                }}
              >
                {ccMailData.length > 0 && ccMailData.map((d, i) => (
                  <span className="tags" style={{ background: getColor(i) }} key={i} onDragStart={() => onDragSt(d, i, 'cc')} draggable="true">
                    <Icons type="userIcon" icontype="common" className="actionApprove" />
                    <span
                      id={`IncidentDetailView_EmailTemplate_Cc_Field_ChipTag_${i}`}
                      onClick={() => editTag(d, i, 'tocc')}
                      data-test="ekasha_edit_field"
                      style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
                    >
                      {d}
                    </span>
                    <Icons
                      id={`IncidentDetailView_EmailTemplate_Cc_Field_ChipTag_Remove_${i}`}
                      data-test="ekasha_remove_field"
                      icontype="globle"
                      type="close"
                      className="closeChip"
                      style={{ marginLeft: '6px', marginTop: '-2px', cursor: 'pointer' }}
                      onClick={() => removeMe(i, 'tocc')}
                    />
                  </span>
                ))}
                <ZsInput
                  inputtype="normal"
                  id="IncidentDetailView_EmailTemplate_Cc_Field_Input"
                  maxLength="threeTwoZero"
                  width="100%"
                  style={{ marginTop: '3px' }}
                  onKeyDown={(e) => backRemove(e, 'cc')}
                  onPressEnter={(e) => checkValidMail(e.target.value, 'tocc')}
                  onChange={(e) => setData(e.target.value, 'tocc')}
                  value={emailData.tocc ? emailData.tocc : ''}
                />
              </div>
            </div>
          </div>
          <div style={{ borderBottom: '1px solid #262525' }}>
            <div
              className="mailRecipient"
              style={{
                padding: '5px 15px',
              }}
            >
              <ZsInput
                inputtype="normal"
                id="IncidentDetailView_EmailTemplate_Subject_Field_Input"
                maxLength="normal"
                placeholdertext="Enter subject"
                onChange={(e) => setData(e.target.value, 'subject')}
                value={emailData.subject ? emailData.subject : ''}
              />
            </div>
          </div>
          <div style={{ width: '100%' }}>
            <div className="editControls" style={{ userSelect: 'none' }}>
              <div className="controlGroup">
                <Icons
                  id="IncidentDetailView_EmailTemplate_Bold_Button"
                  icontype="common"
                  type="bold"
                  className="eControl"
                  onClick={() => getCommand('bold')}
                />
                <Icons
                  id="IncidentDetailView_EmailTemplate_Italic_Button"
                  icontype="common"
                  type="italic"
                  className="eControl"
                  onClick={() => getCommand('italic')}
                />
                <Icons
                  id="IncidentDetailView_EmailTemplate_Underline_Button"
                  icontype="common"
                  type="underline"
                  className="eControl"
                  onClick={() => getCommand('underline')}
                />
              </div>
              <div className="controlGroup">
                <Icons
                  id="IncidentDetailView_EmailTemplate_JustifyLeft_Button"
                  icontype="common"
                  type="leftAlign"
                  className="eControl"
                  onClick={() => getCommand('justifyLeft')}
                />
                <Icons
                  id="IncidentDetailView_EmailTemplate_JustifyCenter_Button"
                  icontype="common"
                  type="centerAlign"
                  className="eControl"
                  onClick={() => getCommand('justifyCenter')}
                />
                <Icons
                  id="IncidentDetailView_EmailTemplate_JustifyRight_Button"
                  icontype="common"
                  type="rightAlign"
                  className="eControl"
                  onClick={() => getCommand('justifyRight')}
                />
              </div>
              <div className="controlGroup">
                <Icons
                  id="IncidentDetailView_EmailTemplate_Indent_Button"
                  type="incIndent"
                  icontype="common"
                  className="eControl"
                  onClick={() => getCommand('indent')}
                />
                <Icons
                  id="IncidentDetailView_EmailTemplate_Outdent_Button"
                  type="decIndent"
                  icontype="common"
                  className="eControl"
                  onClick={() => getCommand('outdent')}
                />
                <Icons
                  id="IncidentDetailView_EmailTemplate_InsertUnorderedList_Button"
                  type="bulletList"
                  icontype="common"
                  className="eControl"
                  onClick={() => getCommand('insertUnorderedList')}
                />
              </div>
            </div>
            <div id="getHtmlCode" className="getHtmlCode">
              <div
                id="IncidentDetailView_EmailTemplate_Body_Field"
                style={{ padding: '10px 20px 0px', width: '96%', outline: 'none' }}
                ref={function (e) { if (e != null) e.contentEditable = true; }}
                onPaste={(e) => onPaste(e)}
                // onDrop={(e) => onPaste(e)}
                dangerouslySetInnerHTML={{ __html: 'The following incident is reported to you for reference' }}
              />
              <div
                id="IncidentDetailView_EmailTemplate_Email_Body"
                style={{ padding: '10px 20px 0px', width: '96%', outline: 'none' }}
                ref={function (e) { if (e != null) e.contentEditable = true; }}
                onPaste={(e) => onPaste(e)}
                // onDrop={(e) => onPaste(e)}
              />
              <div
                className="mainBodyContent"
                style={{
                  padding: '20px', width: '96%', height: 'auto', color: 'black',
                }}
              >
                <div
                  className="bodyContent"
                  style={{
                    padding: '20px 20px 10px 20px', background: '#ededed', height: 'auto', overflow: 'auto',
                  }}
                >
                  {templateData && templateData.map((d, i) => (
                    <div className="wrapContent" key={`wrapContent_${i}`} style={{ marginBottom: '8px', minHeight: 'auto', display: 'flex' }}>
                      <div className="leftContent" style={{ width: '30%' }}>
                        <div
                          className="wrapLeft"
                          style={{
                            border: '1px solid #d7dce0',
                            minHeight: '100%',
                            display: 'flex',
                            background: '#d7dce0',
                            boxSizing: 'border-box',
                          }}
                        >
                          <div
                            id="SearchHuntName"
                            className="title1"
                            style={{
                              display: 'block',
                              margin: 'auto 15px',
                              cursor: 'text',
                              textAlign: 'left',
                              wordBreak: 'break-all',
                              fontSize: '11px',
                              lineHeight: '23px',
                              width: '100%',
                            }}
                          >
                            <div
                              ref={function (e) { if (e != null) e.contentEditable = false; }}
                              className="editArea"
                              placeholder="Enter category"
                              id={`IncidentDetailView_EmailTemplate_Category_Name_${i}`}
                              dangerouslySetInnerHTML={{ __html: templateData[i].category ? templateData[i].category : '' }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="rightContent" style={{ width: '70%', marginLeft: '4px', display: 'grid' }}>
                        {d.categoryData.map((c, j) => (
                          <div
                            className="rightWrap"
                            key={j}
                            style={{
                              display: 'flex',
                              height: 'auto',
                              marginBottom: j === d.categoryData.length - 1 ? '0' : '4px',
                            }}
                          >
                            <div
                              className="left"
                              style={{
                                width: '100%',
                              }}
                            >
                              <div
                                className="rightContentWrapLeft"
                                style={{
                                  border: '1px solid #d7dce0',
                                  background: '#d7dce0',
                                  padding: '6px 10px 6px 10px',
                                  display: 'flex',
                                  height: '100%',
                                  boxSizing: 'border-box',
                                }}
                                key={`left_${j}`}
                              >
                                <div
                                  id="SearchHuntName"
                                  className="title1"
                                  style={{
                                    width: '100%',
                                    display: 'block',
                                    margin: 'auto',
                                    alignSelf: 'center',
                                    cursor: 'text',
                                    textAlign: 'left',
                                    wordBreak: 'break-all',
                                    fontSize: '11px',
                                    lineHeight: '23px',
                                  }}
                                >
                                  <div
                                    id={`IncidentDetailView_EmailTemplate_Fields_Name_${i}_${j}`}
                                    ref={function (e) { if (e != null) e.contentEditable = false; }}
                                    className="editArea"
                                    placeholder="Enter field"
                                    dangerouslySetInnerHTML={{ __html: templateData[i].categoryData[j].field ? templateData[i].categoryData[j].field : '' }}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="right" style={{ marginLeft: '4px', width: '100%' }}>
                              <div
                                className="rightContentWrapLeft"
                                style={{
                                  border: !errorStatus[i].errorData[j].valueError
                                    ? '1px solid #d7dce0' : '1px solid #427dbe',
                                  background: '#d7dce0',
                                  padding: '6px 10px 6px 10px',
                                  display: 'flex',
                                  height: '100%',
                                  boxSizing: 'border-box',
                                }}
                                key={`right_${j}`}
                              >
                                <div
                                  id={`IncidentDetailView_EmailTemplate_Fields_Value_${i}_${j}`}
                                  className="title1"
                                  onClick={() => {
                                    setTimeout(() => {
                                      // focus input
                                      if (document.getElementById(`IncidentDetailView_EmailTemplate_Value_HTML_${i}_${j}`)) {
                                        document.getElementById(`IncidentDetailView_EmailTemplate_Value_HTML_${i}_${j}`).focus();
                                      }
                                    }, 500);
                                    errorStatus[i].errorData[j].valueError = true;
                                    setErrorStatus([...errorStatus]);
                                  }}
                                  style={{
                                    width: '100%',
                                    display: 'block',
                                    margin: 'auto',
                                    alignSelf: 'center',
                                    cursor: 'text',
                                    textAlign: 'left',
                                    wordBreak: 'break-all',
                                    fontSize: '11px',
                                    lineHeight: '23px',
                                  }}
                                >
                                  <div
                                    ref={function (e) { if (e != null) e.contentEditable = true; }}
                                    className="editArea"
                                    placeholder="Enter value"
                                    id={`IncidentDetailView_EmailTemplate_Value_HTML_${i}_${j}`}
                                    onKeyDown={(e) => onKeyDwn(e)}
                                    onPaste={(e) => onPaste(e)}
                                    // onDrop={(e) => onPaste(e)}
                                    onBlur={() => valueBlurFunc(i, j)}
                                    dangerouslySetInnerHTML={{ __html: templateData[i].categoryData[j].value ? templateData[i].categoryData[j].value : '-' }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                </div>
              </div>
              <div
                id="IncidentDetailView_EmailTemplate_Email_Body_Contain"
                style={{ padding: '10px 20px 10px 20px', width: '96%', outline: 'none' }}
                ref={function (e) { if (e != null) e.contentEditable = true; }}
                onPaste={(e) => onPaste(e)}
                // onDrop={(e) => onPaste(e)}
              />
            </div>
            <div
              id="IncidentDetailView_EmailTemplate_Thank_You_Field"
              style={{ padding: '10px 20px 10px 20px', width: '96%', outline: 'none' }}
              ref={function (e) { if (e != null) e.contentEditable = true; }}
              onPaste={(e) => onPaste(e)}
              // onDrop={(e) => onPaste(e)}
            >
              Thank you
            </div>
          </div>
        </div>
      </EmailModelWrapper>
    </ZsModal>
  );
});

EmailTemplate.propTypes = {
  submitTemplate: PropTypes.func,
  setErrorStatus: PropTypes.func,
  closeHandler: PropTypes.func,
  setValueEdited: PropTypes.func,
  submitLoading: PropTypes.bool,
  subjectData: PropTypes.string,
  modalVisible: PropTypes.bool,
  templateData: PropTypes.oneOfType([
    PropTypes.array,
  ]),
  setToMailData: PropTypes.func,
  setCcMailData: PropTypes.func,
  toMailData: PropTypes.oneOfType([
    PropTypes.array,
  ]),
  ccMailData: PropTypes.oneOfType([
    PropTypes.array,
  ]),
  errorStatus: PropTypes.oneOfType([
    PropTypes.array,
  ]),
};

EmailTemplate.defaultProps = {
  submitTemplate: null,
  setErrorStatus: null,
  closeHandler: null,
  setValueEdited: null,
  submitLoading: false,
  subjectData: '',
  modalVisible: false,
  templateData: [],
  errorStatus: [],
  setToMailData: null,
  setCcMailData: null,
  ccMailData: [],
  toMailData: [],
};
export default EmailTemplate;
