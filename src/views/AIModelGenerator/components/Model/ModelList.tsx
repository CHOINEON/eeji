import sample from '../../data/modelListData.json'
import ModelStateList, { IModelStateData } from './ModelStateRow'

const ModelList = () => {
  const mockdata: Array<IModelStateData> = sample
  return (
    <div className="p-10">
      <p className="font-['Helvetica Neue'] font-bold text-[23px] text-[#002D65]">Processing</p>
      <ModelStateList data={mockdata} />
    </div>
  )
}

export default ModelList
