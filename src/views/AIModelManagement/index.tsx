import React, { useState, useEffect } from 'react'
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom'
import ModelList from './ModelList'
import { Box } from '@chakra-ui/react'
import ModelTest from './ModelTest'

const AIModelManagement = () => {
  const match = useRouteMatch()

  return (
    <>
      <Box pt={{ base: '130px', md: '80px', xl: '80px' }} style={{ position: 'relative', zIndex: 1000 }}>
        {' '}
        <Switch>
          <Route path={`${match.path}/:modelName`}>
            <ModelTest />
          </Route>
          <Route path={match.path}>
            <ModelList />
          </Route>
        </Switch>
      </Box>
    </>
  )
}

export default AIModelManagement
