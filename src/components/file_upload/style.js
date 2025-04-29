import styled from 'styled-components';

const FileUploadWrapper = styled.div`
.ant-upload:hover{
  border-color: #335099 !important;
}
.ant-upload-list-text{
  .ant-tooltip{
    display: none;
  }
}
.ant-upload-list-item-name {
  color: #a4a4a4;
}
.ant-upload-list-item-card-actions{
  .gFill{
    fill: #4b4f55;
  }
}
.error{
  color: 'red';
}
.anticon{
  color: rgb(164 169 175) !important;
}
.ant-progress-text{
  color:#000000;
}
.ant-progress-outer {
  width: 0;
}
  width: 340px;
      .fileView{
        width: 200px;
        height: 130px;
        align-items: center;
        margin-top: 10px;
        justify-content: center;
        color: 'red';
        display: flex;
        padding: 0px;
        position: relative;
        .ImageFile{
          position: absolute;
          margin: auto;
          width: 190px;
          height: 100px;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
        }
      }
      .ant-upload-list{
        opacity: 1 !important;
        .ant-upload-list-item-card-actions-btn{
          opacity: 1;
        }

        .ant-upload-list-item:hover{
          .ant-upload-list-item-card-actions-btn{
            opacity: 0.5;
          }
          color: #8c8c8c;
          .ant-upload-list-item-info {
            background-color: #d8484800;
          }
        }
      }
      .hide{
        .ant-upload-btn{
          display: none !important;
        }
      }
      .ant-upload-text-icon{
        top: 4px;
        position: relative;
      }
      .anticon{
        display: none !important;
      }
`;

export default FileUploadWrapper;
