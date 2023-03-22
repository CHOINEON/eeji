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
registerLicense(
  'Mgo+DSMBaFt/QHRqVVhkVFpFdEBBXHxAd1p/VWJYdVt5flBPcDwsT3RfQF5jSn9WdkdjXH9ed3RWTg==;Mgo+DSMBPh8sVXJ0S0J+XE9AflRDX3xKf0x/TGpQb19xflBPallYVBYiSV9jS31TdURmWX1edXRVQWJYWQ==;ORg4AjUWIQA/Gnt2VVhkQlFacldJXGFWfVJpTGpQdk5xdV9DaVZUTWY/P1ZhSXxQdkZiXH9ccHFVRmdYWEw=;MTMzMDM2MUAzMjMwMmUzNDJlMzBDYzhHbHc3SzMvaisrUGxCVW11d0hDTlJiL0dhVnA3cVcyU2pzV0JkUFlZPQ==;MTMzMDM2MkAzMjMwMmUzNDJlMzBnT0ZjOHVkTnd3MG1udjNrRHlHUjZXaXkrMGNzOXlQOU5ucnZ3dmJCU2FjPQ==;NRAiBiAaIQQuGjN/V0Z+WE9EaFtKVmJLYVB3WmpQdldgdVRMZVVbQX9PIiBoS35RdUVgWHpecnRQRmBUVEd+;MTMzMDM2NEAzMjMwMmUzNDJlMzBpV2xNL2hHWEFLTDRoNitheEtXeUlWcjhaVUcya2h2djFUVU9RSmtvcnFnPQ==;MTMzMDM2NUAzMjMwMmUzNDJlMzBVd2JjdkRLcmtoV2U4V004ZHpwSDF1RWpwTGZ5aEdoRTFHaEwyS01EcVJvPQ==;Mgo+DSMBMAY9C3t2VVhkQlFacldJXGFWfVJpTGpQdk5xdV9DaVZUTWY/P1ZhSXxQdkZiXH9ccHFVRmlZV0Y=;MTMzMDM2N0AzMjMwMmUzNDJlMzBDUmlaWGtrajBEMWhtYWUrT3hkNERHSTc1REs2WmxQQWhOd3J6VGhLYk1jPQ==;MTMzMDM2OEAzMjMwMmUzNDJlMzBsRWEzS1MyWFZQTEFzK0NzZGsyK2M4Y3JPSlVFK0VMQ3dSMk5rTTJZTTFnPQ==;MTMzMDM2OUAzMjMwMmUzNDJlMzBpV2xNL2hHWEFLTDRoNitheEtXeUlWcjhaVUcya2h2djFUVU9RSmtvcnFnPQ=='
)

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <React.StrictMode>
      <BrowserRouter>
        <Switch>
          <Route path={`/auth`} component={AuthLayout} />
          <Route path={`/admin`} component={AdminLayout} />
          <Route path={`/login`} component={Login} />
          <Redirect from="/" to="/login" />
        </Switch>
      </BrowserRouter>
    </React.StrictMode>
  </ChakraProvider>,
  document.getElementById('root')
)
