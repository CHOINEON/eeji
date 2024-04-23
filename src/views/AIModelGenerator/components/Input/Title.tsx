import styled from '@emotion/styled'

export const Title = styled.span`
  display: block;
  float: left;
  font-size: 30px;
  color: #002d65;
  font-weight: bolder;
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif';
`

export const SubTitle = styled(Title)`
  font-size: 20px;
  width: 100%;
`

export const FileName = styled(Title)`
  display: inline-block;
  font-size: 17px;
  width: 330px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  margin-left: 2vw;
`
