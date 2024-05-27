import sample from '../../data/modelListData.json'
import ModelStateList, { IModelStateData } from './ModelStateRow'

const ModelList = () => {
  const mockdata: Array<IModelStateData> = sample
  return (
    <>
      <p className="font-['Helvetica Neue'] font-bold text-[23px] text-[#002D65]">Processing(테스트 중)</p>
      <ModelStateList data={mockdata} />
      <p className="font-['Helvetica Neue'] font-bold text-[23px] text-[#002D65]">Completed</p>
    </>
  )
}

export default ModelList
