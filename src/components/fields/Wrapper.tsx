import styled from '@emotion/styled'

export const Wrapper = styled.div`
  width: 100%;
  height: 48px;
  border: 1px solid #d5dcef;
  border-radius: 10px;
  opacity: 1;
  margin: 11px 0;
  min-width: 318px;
`
export const Label = styled.div<{ hasFileName: boolean }>`
  font-family: 'Helvetica Neue', sans-serif;
  font-weight: ${(props: any) => (props.hasFileName ? 400 : 'bold')};
  display: inline-block;
  color: #002d65;
  height: 100%;
  font-size: ${(props: any) => (props.hasFileName ? '11px' : '13px')};
  line-height: ${(props: any) => (props.hasFileName ? '16px' : '24px')};
  padding: ${(props: any) => (props.hasFileName ? '5px 12px' : '10px')};
`

export const UploadBtn = styled.button`
  width: 75px;
  height: 28px;
  border: 1px solid #d5dcef;
  border-radius: 5px;
  opacity: 1;
  font-size: 13px;
  margin: 9px;
  float: right;
  color: #002d65;
`
