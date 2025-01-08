import IndexApi from 'apis/IndexApi'
import { IFeatureDescription, IFeatureImportance } from 'apis/type/IndexResponse'
import { useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { useQuery } from 'react-query'
import { useRecoilState, useRecoilValue } from 'recoil'
import { translatePeriodToKorean } from 'utils/TextTranslator'
import { featureDescriptionState, horizonState, symbolState } from '../stores/atom'
import { ComponentTitle } from './CommonComponents'
import DescriptionCollapsePanel from './DescriptionCollapsePanel'

const GlobalFeatureImportance = () => {
  const symbols = useRecoilValue(symbolState)
  const horizon = useRecoilValue(horizonState)

  const [featureImportance, setFeatureImportance] = useState([])
  const [series, setSeries] = useState([])
  const [featureDescriptionList, setFeatureDescriptionList] = useRecoilState(featureDescriptionState)
  const [selectedFeature, setSelectedFeature] = useState<IFeatureDescription | null>(null)

  const { data } = useQuery(
    ['globalExplanation', symbols.selectedSymbolData?.symbol_id, horizon.selectedHorizon],
    () => IndexApi.getGlobalExplanation(symbols.selectedSymbolData?.symbol_id, horizon.selectedHorizon),
    {
      enabled: !!symbols.selectedSymbolData?.symbol_id && !!horizon.selectedHorizon,
      refetchOnWindowFocus: false,
    }
  )

  const { data: featureData } = useQuery({
    queryKey: ['featureDescription', symbols.selectedSymbolData?.symbol_id, horizon.selectedHorizon],
    queryFn: () => IndexApi.getFeatureDescription(symbols.selectedSymbolData?.symbol_id, horizon.selectedHorizon),
    enabled: !!symbols.selectedSymbolData?.symbol_id && !!horizon.selectedHorizon,
    onSuccess: (data: IFeatureDescription[]) => {
      console.log('fetching result::', data)
      setFeatureDescriptionList(data)
    },
  })

  useEffect(() => {
    if (data) {
      setFeatureImportance(data?.feature_importance)
      console.log('data?.feature_importance:', data?.feature_importance)
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
      events: {
        dataPointSelection: (event: any, chartContext: any, config: any) => {
          // 클릭된 데이터 포인트 정보
          // console.log('event::', event)
          // console.log('chartContext::', chartContext)
          // console.log('config::', config)

          const { dataPointIndex } = config
          const clickedSeriesName = config.w.config.series[dataPointIndex]

          console.log('Clicked data point:', dataPointIndex)

          if (featureDescriptionList?.length > 0) {
            const selectedFeature = series[dataPointIndex].name

            const selectedFeatureDescription = featureDescriptionList.find(
              (feature) => feature.feature_name === selectedFeature
            )

            setSelectedFeature(selectedFeatureDescription)
          }
        },
      },
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
    <div className="m-2">
      <ComponentTitle title="Global Feature Importance" />
      <div className="m-5 h-[220px]">
        {featureImportance?.length > 0 && (
          <>
            <ReactApexChart options={options} series={series.map((s) => Number(s.data[0]))} type="donut" height={180} />
            <div className="my-2">
              {`${horizon.selectedHorizon}${translatePeriodToKorean(symbols.selectedSymbolData.period)} `}예측에서 가장
              영향력이 큰 변수는 <strong>{featureImportance[0]?.feature_name} </strong>입니다.
            </div>
            {selectedFeature && <DescriptionCollapsePanel selectedFeature={selectedFeature} />}
          </>
        )}
      </div>
    </div>
  )
}

export default GlobalFeatureImportance
