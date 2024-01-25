// api.js (or any suitable name for your API module)
import axios from 'axios'

const fetchChartData = async () => {
  try {
    const param = {
      user_id: localStorage.getItem('userId'),
    }

    const response = await axios.get(
      process.env.REACT_APP_NEW_API_SERVER_URL + `/api/index_predict?user_id=${param.user_id}`
    )
    return response.data
  } catch (error) {
    console.error('error:', error)
    throw error // Re-throw the error to handle it in the component
  }
}

export default fetchChartData
