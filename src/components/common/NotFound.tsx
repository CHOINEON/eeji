import { Button, Result } from 'antd'

const NotFound = () => {
  return (
    <div className="pt-[130px] md:pt-[80px] xl:pt-[80px] relative z-[1000]">
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={<Button type="primary">Back Home</Button>}
      />
    </div>
  )
}

export default NotFound
