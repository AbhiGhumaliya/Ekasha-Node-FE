import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const listPreviewTab = (props) => {
  const { getSinglePreviewAction, fakeListAction } = props;

  const [previewListData, setPreviewListData] = useState([]);

  const SinglePreviewRes = useSelector((state) => (state.Lists.SinglePreviewResponse || {}));

  useEffect(() => {
    getSinglePreviewAction({ listToken: props.match.params.dataToken });
  }, []);

  useEffect(() => {
    if (SinglePreviewRes.status) {
      setPreviewListData([...SinglePreviewRes.data]);
      fakeListAction();
    } else if (SinglePreviewRes.status === false) {
      setPreviewListData([]);
      fakeListAction();
    }
  }, [SinglePreviewRes]);

  return (
    <div data-test="Admin_Preview_List_Tab_Container" style={{ height: '100vh', background: '#fff', overflow: 'auto' }}>
      {previewListData.map((d) => (
        <div>{d.value}</div>
      ))}
    </div>
  );
};
export default listPreviewTab;
