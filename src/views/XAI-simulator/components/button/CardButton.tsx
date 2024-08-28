import styled from '@emotion/styled'

interface CardButtonItem {
  title: string
  description: string
  icon: any
  handleClick: any
  buttonName: string
}

type CardButtonProps = {
  item: CardButtonItem
}

const CardButton = ({ item }: CardButtonProps) => {
  const { title, description, icon, handleClick, buttonName } = item

  return (
    <Container>
      <IconWrapper>
        <Icon icon={icon} />
      </IconWrapper>
      <Title>
        <b>{title}</b>
        <span> Model</span>
      </Title>
      <Description>{description}</Description>

      <UploadButton onClick={handleClick}>{buttonName}</UploadButton>
    </Container>
  )
}

export default CardButton

const Container = styled.div`
  width: 282px;
  height: 285px;
  background: #ffffff 0% 0% no-repeat padding-box;
  border: 1px solid #d5dcef;
  border-radius: 20px;
  margin-left: 1%;
`

const IconWrapper = styled.div`
  margin-top: 15%;
  margin-bottom: 5%;
`

const Icon = styled.div<{ icon: any }>`
  display: block;
  margin: auto;
  border: 0;
  width: 93px;
  height: 91px;
  background-image: url(${(props: any) => props.icon});
  background-size: contain;
`

const Title = styled.p`
  font-family: 'ITC Avant Garde';
  color: #002d65;
  font-size: 18px;
  //   font-weight: bold;
`

const Description = styled.p`
  font-family: 'Helvetica Neue';
  color: #a3afcf;
  font-size: 10px;
`

const UploadButton = styled.button`
  background-color: #4338f7;
  width: 50%;
  padding: 1%;
  height: 28px;
  border-radius: 10px;
  color: #fff;
  font-family: 'Helvetica Neue';
  font-weight: Bold;
  font-size: 12px;
  margin-top: 30px;
`
