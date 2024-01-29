/*eslint-disable*/

import { Flex, Link, List, ListItem, Text, useColorModeValue } from '@chakra-ui/react'
import ineeji_logo from 'assets/img/ineeji/ineeji_logo_main.svg'

export default function Footer() {
  const textColor = useColorModeValue('gray.400', 'white')
  return (
    <div style={{ position: 'absolute', width: '94vw', bottom: 10, textAlign: 'center' }}>
      <Flex
        zIndex="3"
        flexDirection={{
          base: 'column',
          xl: 'row',
        }}
        alignItems={{
          base: 'center',
          xl: 'start',
        }}
        justifyContent="center"
        px={{ base: '40px', md: '50px' }}
        // pb="30px"
        pt="40px"
      >
        <Text
          color={textColor}
          textAlign={{
            base: 'center',
            xl: 'start',
          }}
          // mb={{ base: '10px', xl: '0px' }}
        >
          {' '}
          {/* &copy; {new Date().getFullYear()} */}
          <Text as="span" fontWeight="500" ms="4px">
            <Link mx="3px" color={textColor} href="https://www.ineeji.com" target="_blank" fontWeight="700">
              <img src={ineeji_logo} style={{ marginLeft: '7px' }} />
            </Link>
            Ⓒ INEEJI Corp. All rights reserved.
          </Text>
        </Text>
      </Flex>
    </div>
  )
}
