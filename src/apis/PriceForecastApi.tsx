// api.js (or any suitable name for your API module)
import axios from 'axios'

const fetchChartData = async () => {
  try {
    const param = {
      user_id: localStorage.getItem('userId'),
    }

    const response = await axios.post(process.env.REACT_APP_API_SERVER_URL + '/api/oil_predict', param)

    console.log('response', response.data)

    return response.data
  } catch (error) {
    console.error('error:', error)
    throw error // Re-throw the error to handle it in the component
  }
}

export default fetchChartData
