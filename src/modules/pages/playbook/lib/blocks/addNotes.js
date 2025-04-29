import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// import Icons from '../../../../../components/icons';
import ZsInput from '../../../../../components/forms/input';
import ZsButton from '../../../../../components/forms/button';

const AddNotes = (props) => {
  const {
    onChange, cNotes, previewNote, // closeNotes,
  } = props;
  const [note, setNote] = useState('');
  const [first, setFirst] = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    setPreview(previewNote);
    if (cNotes && !first) {
      setFirst(true);
      setNote(cNotes);
    }
  }, [props]);

  return (
    <div className="playbookAddNotesWrapper">
      <div className="fieldBodyLabel">
        Notes (Block tooltip)
      </div>
      <div className="fieldBody">
        <ZsInput
          textarea
          value={note || null}
          disabled={preview}
          maxLength="sixFiveZero"
          inputtype="normal"
          autoSize={{ minRows: 10, maxRows: 19 }}
          className="textAreaBox"
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
      <div className="fieldFooter">
        <ZsButton
          id="note_submit"
          style={{
            width: '100%',
            background: '#4b8ae9',
            color: '#000000',
            border: '2px solid #4b8ae9',
            // boxShadow: '0 0 3px 0 #4b8ae9 inset, 0 0 5px 1px #4b8ae9',
          }}
          className="fieldFooter2"
          disabled={preview}
          onClick={() => {
            if (onChange) {
              onChange(note);
            }
          }}
          title="Add"
        />
      </div>
    </div>
  );
};
AddNotes.propTypes = {
  onChange: PropTypes.func,
  cNotes: PropTypes.bool,
  previewNote: PropTypes.bool,
};

AddNotes.defaultProps = {
  onChange: null,
  cNotes: false,
  previewNote: false,
};
export default AddNotes;
