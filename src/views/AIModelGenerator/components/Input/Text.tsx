import styled from '@emotion/styled'

export const Text = styled.div`
  color: #002d65;
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif';
`

export const Title = styled(Text)`
  font-weight: bolder;
`
export const MenuTitle = styled(Title)`
  font-size: 32px;
`

export const SubTitle = styled(Title)`
  font-size: 20px;
  width: 100%;
`

export const FileName = styled(Title)`
  font-size: 12px;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-word;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`
