import sample from './data/modelListData.json'

const ModelList = () => {
  const data = sample

  return (
    <>
      <p className="font-['Helvetica Neue'] font-bold text-[23px] text-[#002D65]">Processing(테스트중)</p>
      {data.length > 0 &&
        data.map((d: any, i: number) => (
          <div
            className="flex justify-center w-100 h-[71px] bg-white border-solid border-[#d5dcef] shadow-[0_0_10_#0000001a] rounded-xl my-5"
            key={i}
          >
            <div className="flex-none leading-[71px] text-center font-['Helvetica Neue'] text-22 text-bold basis-2/7">
              {d.name}
            </div>
            <div className="flex-none leading-[71px] text-center font-['Helvetica Neue'] text-14 basis-1/7">
              {d.isClassification}
            </div>
            <div className="flex-none leading-[71px] text-center font-['Helvetica Neue'] text-14 basis-1/7">
              {d.target}
            </div>
            <div className="flex-none leading-[71px] text-center font-['Helvetica Neue'] text-14 basis-1/7">
              {d.descr}
            </div>
            <div className="flex-none leading-[71px] text-center font-['Helvetica Neue'] text-14 basis-1/7">
              {d.target}
            </div>
            <div className="flex-none leading-[71px] text-center font-['Helvetica Neue'] text-14 basis-1/7">
              {d.accuracy}
            </div>
            <div className="flex-none leading-[71px] text-center font-['Helvetica Neue'] text-14 basis-1/7">
              {d.errorRate}
            </div>
            <div className="flex-none leading-[71px] text-center font-['Helvetica Neue'] text-14 basis-1/7">
              {d.created}
            </div>
            <div className="flex-none leading-[71px] text-center font-['Helvetica Neue'] text-14 basis-1/7">
              {d.updated}
            </div>
            <div className="flex-none leading-[71px] text-center font-['Helvetica Neue'] text-14 basis-1/7">
              {d.createdby}
            </div>
            <div className="block m-auto">
              <button className="h-30 bg-[#4338F7] text-white rounded-[10px] w-[91px] h-[30px] inline-block">
                Run
              </button>
            </div>
          </div>
        ))}
      <p className="font-['Helvetica Neue'] font-bold text-23 text-[#002D65]">Completed</p>
    </>
  )
}

export default ModelList
