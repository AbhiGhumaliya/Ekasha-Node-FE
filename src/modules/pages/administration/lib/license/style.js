import styled from 'styled-components';

export const LicenseWrapper = styled.div`
.leftData{
  border-bottom: 1px solid #272726;
  .overviewTitle{
    font-size: 14px;
    color: #335099;
    font-weight: 400;
  }
  .dataBlock {
    display: flex;
    margin: 6px 0;
    .dataKey{
      font-size: 12px;
      color: #808284;
      width: 50%;
      line-height: 31px;
      padding-right: 5px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .dataValue{
      color: #ffffff;
      font-size: 12px;
      width: 50%;
      line-height: 31px;
    }
    .overflowText{
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
.uploadLicenseLink {
    margin-top: 20px;
    font-size: 13px;
    color: #4e8bff;
    display: flex;
    justify-content: flex-end;
    #ZsButton{
      min-width: 66px;
      height: 28px;
      line-height: 0px;
      letter-spacing: 0.69px;
      font-weight: bolder;
    }
  }
`;
