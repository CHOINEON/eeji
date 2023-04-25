import React from 'react'
import ReactDOM from 'react-dom'
import './assets/css/App.css'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import AuthLayout from './layouts/auth'
import AdminLayout from './layouts/admin'
import Login from './layouts/login/login'
import { ChakraProvider } from '@chakra-ui/react'
import theme from './theme/theme'
import { registerLicense } from '@syncfusion/ej2-base'
import PredefinedLayouts from 'views/hmid_config/grid/GridLayoutTest'

// registerLicense(
//   'Mgo+DSMBaFt/QHRqVVhkVFpFdEBBXHxAd1p/VWJYdVt5flBPcDwsT3RfQF5jSn9WdkdjXH9ed3RWTg==;Mgo+DSMBPh8sVXJ0S0J+XE9AflRDX3xKf0x/TGpQb19xflBPallYVBYiSV9jS31TdURmWX1edXRVQWJYWQ==;ORg4AjUWIQA/Gnt2VVhkQlFacldJXGFWfVJpTGpQdk5xdV9DaVZUTWY/P1ZhSXxQdkZiXH9ccHFVRmdYWEw=;MTMzMDM2MUAzMjMwMmUzNDJlMzBDYzhHbHc3SzMvaisrUGxCVW11d0hDTlJiL0dhVnA3cVcyU2pzV0JkUFlZPQ==;MTMzMDM2MkAzMjMwMmUzNDJlMzBnT0ZjOHVkTnd3MG1udjNrRHlHUjZXaXkrMGNzOXlQOU5ucnZ3dmJCU2FjPQ==;NRAiBiAaIQQuGjN/V0Z+WE9EaFtKVmJLYVB3WmpQdldgdVRMZVVbQX9PIiBoS35RdUVgWHpecnRQRmBUVEd+;MTMzMDM2NEAzMjMwMmUzNDJlMzBpV2xNL2hHWEFLTDRoNitheEtXeUlWcjhaVUcya2h2djFUVU9RSmtvcnFnPQ==;MTMzMDM2NUAzMjMwMmUzNDJlMzBVd2JjdkRLcmtoV2U4V004ZHpwSDF1RWpwTGZ5aEdoRTFHaEwyS01EcVJvPQ==;Mgo+DSMBMAY9C3t2VVhkQlFacldJXGFWfVJpTGpQdk5xdV9DaVZUTWY/P1ZhSXxQdkZiXH9ccHFVRmlZV0Y=;MTMzMDM2N0AzMjMwMmUzNDJlMzBDUmlaWGtrajBEMWhtYWUrT3hkNERHSTc1REs2WmxQQWhOd3J6VGhLYk1jPQ==;MTMzMDM2OEAzMjMwMmUzNDJlMzBsRWEzS1MyWFZQTEFzK0NzZGsyK2M4Y3JPSlVFK0VMQ3dSMk5rTTJZTTFnPQ==;MTMzMDM2OUAzMjMwMmUzNDJlMzBpV2xNL2hHWEFLTDRoNitheEtXeUlWcjhaVUcya2h2djFUVU9RSmtvcnFnPQ=='
// )

// registerLicense(
//   'Mgo+DSMBaFt+QHFqVkNrXVNbdV5dVGpAd0N3RGlcdlR1fUUmHVdTRHRcQlliTn5TckFgUXZYdXY=;Mgo+DSMBPh8sVXJ1S0d+X1RPd11dXmJWd1p/THNYflR1fV9DaUwxOX1dQl9gSXpScUVjXXtdeH1dR2I=;ORg4AjUWIQA/Gnt2VFhhQlJBfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hSn5Xd0JjWXtac3xcT2de;MTc0Mjg4OUAzMjMxMmUzMTJlMzMzNWRyL1grVGdhRFV4OERFQkN0TWhOZ0dTVHJCTjZKM3cvQko4MEw4N3ZBYlE9;MTc0Mjg5MEAzMjMxMmUzMTJlMzMzNVd3RGdWSEthRFhVbWJxallraFk2ZmU5aHN3andHaVYvR0hVeWc5djdHWm89;NRAiBiAaIQQuGjN/V0d+XU9Hc1RDX3xKf0x/TGpQb19xflBPallYVBYiSV9jS31TckRkWX9adHdcRmdcUw==;MTc0Mjg5MkAzMjMxMmUzMTJlMzMzNWY1Q1NnTjErZ21va3BXWk9OTERSUDl0bE1EQ3pMS094cUI2RDN5WjV2M3M9;MTc0Mjg5M0AzMjMxMmUzMTJlMzMzNUtZd3RsMEtJOVBSdEZUakwxdlM4a0FpUytjT21wY2tXVERhcXZiQlh2NGs9;Mgo+DSMBMAY9C3t2VFhhQlJBfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hSn5Xd0JjWXtac31XRGhe;MTc0Mjg5NUAzMjMxMmUzMTJlMzMzNVBoczNKTGNudjloQkZXZVpQY0lhKy9oc1NTMndFWlhHdGJqSjB2bWVDZUE9;MTc0Mjg5NkAzMjMxMmUzMTJlMzMzNWZoaEVNZytJdnlBcFFuSTk1UjZ5ZUhFYVNFZlZPSXR6ajhRcVRXREpER3M9;MTc0Mjg5N0AzMjMxMmUzMTJlMzMzNWY1Q1NnTjErZ21va3BXWk9OTERSUDl0bE1EQ3pMS094cUI2RDN5WjV2M3M9'
// )

registerLicense(
  'Mgo+DSMBaFt+QHFqVkNrWU5GckBAXWFKblJ0T2FadVpxZCQ7a15RRnVfRl9nSX5RdUFhX3tadQ==;Mgo+DSMBPh8sVXJ1S0d+X1RPc0BAWXxLflF1VWJbdVxzflFHcC0sT3RfQF5jTXxXdkVhWntcdnFSQw==;ORg4AjUWIQA/Gnt2VFhhQlJBfVpdX2dWfFN0RnNYfVRyd19CYUwgOX1dQl9gSXpRckVjW3xacnJSQWU=;MTgxNzA4NkAzMjMxMmUzMTJlMzMzNVdCV3NKWmRtMU5tRDNnUWRiR3VNTWl1d1hIQjJxY2F2c2s0bVBMZjZTTWM9;MTgxNzA4N0AzMjMxMmUzMTJlMzMzNUxJNDEwREk2WWVpeXlFdE1sTmdzZEJNL3NNd2ExNTJmejBTNStiYkxKbFE9;NRAiBiAaIQQuGjN/V0d+XU9Hc1RHQmFNYVF2R2BJflx6dlZMZF1BNQtUQF1hSn5XdEFjWX1ddHZSQWVZ;MTgxNzA4OUAzMjMxMmUzMTJlMzMzNWxSWm1ybWdNam8zSkJ5ajlOekttNjgrTWJ1Y0RjYkRXRTViMEdOWVNOc1k9;MTgxNzA5MEAzMjMxMmUzMTJlMzMzNUdpVnc3VFMwRnhaWlVPd1E3QjdxUHhjaitlV3M2eXc5bS8ydVZuM2l1eDA9;Mgo+DSMBMAY9C3t2VFhhQlJBfVpdX2dWfFN0RnNYfVRyd19CYUwgOX1dQl9gSXpRckVjW3xacnxTQGU=;MTgxNzA5MkAzMjMxMmUzMTJlMzMzNWZxa1czSFZSSjdKR0dxd3JJS3U1b21lWjFDNWZxN1l5diszdGRQQ0tDajQ9;MTgxNzA5M0AzMjMxMmUzMTJlMzMzNWkrMS8wK3dJd0NXeVNqakhnMVRpNDk0aXhMbTMzejVITDJ4SHdaa2ZNUlU9;MTgxNzA5NEAzMjMxMmUzMTJlMzMzNWxSWm1ybWdNam8zSkJ5ajlOekttNjgrTWJ1Y0RjYkRXRTViMEdOWVNOc1k9'
)
ReactDOM.render(
  <ChakraProvider theme={theme}>
    <React.StrictMode>
      <BrowserRouter>
        <Switch>
          <Route path={`/auth`} component={AuthLayout} />
          <Route path={`/admin`} component={AdminLayout} />
          <Route path={`/login`} component={Login} />
          <Route path={`/admin/maindashboard`} component={PredefinedLayouts} />
          <Redirect from="/" to="/login" />
        </Switch>
      </BrowserRouter>
    </React.StrictMode>
  </ChakraProvider>,
  document.getElementById('root')
)
