import IndexApi from 'apis/IndexApi'
import { IFeatureImportance } from 'apis/type/IndexResponse'
import { useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { useQuery } from 'react-query'
import { useRecoilValue } from 'recoil'
import { SymbolState } from '../stores/atom'

const GlobalFeatureImportance = () => {
  const symbol = useRecoilValue(SymbolState)
  const [featureImportance, setFeatureImportance] = useState([])
  const [series, setSeries] = useState([])

  const { data } = useQuery(
    ['globalExplanation', symbol.symbol_id, symbol.selectedHorizon],
    () => IndexApi.getGlobalExplanation(symbol.symbol_id, symbol.selectedHorizon.toString()),
    {
      enabled: !!symbol.symbol_id && !!symbol.selectedHorizon,
      refetchOnWindowFocus: false,
    }
  )

  useEffect(() => {
    if (data) {
      setFeatureImportance(data?.feature_importance)
      setSeries(
        data?.feature_importance?.map((el: IFeatureImportance) => ({
          name: el.feature_name,
          data: [(el.importance * 100).toFixed(1)],
        }))
      )
    }
  }, [data])

  const options = {
    chart: {
      width: 380,
      type: 'donut' as const,
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            show: false,
          },
        },
      },
    ],
    legend: {
      show: false,
      position: 'bottom' as const,
      offsetY: 0,
      height: 230,
    },
    labels: series.map((s) => s.name), // Series 이름을 표시
  }

  return (
    <div className="m-3 mt-5">
      <h3 className="text-black text-lg font-bold">Global Feature Importance</h3>
      <div className="m-5 h-[220px]">
        {featureImportance?.length > 0 && (
          <>
            <ReactApexChart options={options} series={series.map((s) => Number(s.data[0]))} type="donut" height={180} />
            <div className="my-5">
              가장 영향력이 큰 변수는 <strong>{featureImportance[0]?.feature_name} </strong>입니다.
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default GlobalFeatureImportance
