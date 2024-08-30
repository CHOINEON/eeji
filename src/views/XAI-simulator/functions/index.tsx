export const transformDataByRow = (limit: number, offset: number, rawData: any, total: number) => {
  const transformedData: Array<unknown> = []
  const max: number = offset + limit > total ? total : offset + limit

  for (let i = offset; i < max; i++) {
    const newDataPoint: any = {}

    for (const feature in rawData) {
      newDataPoint[feature] = rawData[feature][i]
    }
    transformedData.push(newDataPoint)
  }

  return transformedData
}
