/* eslint-disable */
// Chakra Imports
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Flex, Link, Text, useColorModeValue } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import AdminNavbarLinks from 'components/navbar/NavbarLinksAdmin'
import UploadIcon from 'assets/img/ineeji/ico_upload_mini.svg'
import styled from '@emotion/styled'
import { importModalAtom } from 'views/DataAnalysis/store/modal/atom'
import { useRecoilState } from 'recoil'
export default function AdminNavbar(props: {
  secondary: boolean
  message: string | boolean
  brandText: string
  logoText: string
  fixed: boolean
  onOpen: (...args: any[]) => any
}) {
  const [scrolled, setScrolled] = useState(false)
  const [importOpen, setImportOpen] = useRecoilState(importModalAtom)

  useEffect(() => {
    window.addEventListener('scroll', changeNavbar)

    return () => {
      window.removeEventListener('scroll', changeNavbar)
    }
  })

  const { secondary, brandText } = props

  // Here are all the props that may change depending on navbar's type or state.(secondary, variant, scrolled)
  let mainText = useColorModeValue('navy.700', 'white')
  // let secondaryText = useColorModeValue('gray.700', 'white')
  let secondaryText = '#A3AFCF'
  let navbarPosition = 'fixed' as const
  let navbarFilter = 'none'
  let navbarBackdrop = 'blur(20px)'
  let navbarShadow = 'none'
  let navbarBg = useColorModeValue('rgba(143, 155, 186, 0)', 'rgba(35,35,35,0.78)')
  let navbarBorder = 'transparent'
  let secondaryMargin = '0px'
  let paddingX = '15px'
  let gap = '0px'
  const changeNavbar = () => {
    if (window.scrollY > 1) {
      setScrolled(true)
    } else {
      setScrolled(false)
    }
  }

  //버튼 컴포넌트

  const handleClick = () => {
    setImportOpen(true)
  }

  return (
    <Box
      style={{ zIndex: 1001 }}
      position={navbarPosition}
      boxShadow={navbarShadow}
      bg={navbarBg}
      borderColor={navbarBorder}
      filter={navbarFilter}
      backdropFilter={navbarBackdrop}
      backgroundPosition="center"
      backgroundSize="cover"
      borderRadius="16px"
      borderWidth="1.5px"
      borderStyle="solid"
      transitionDelay="0s, 0s, 0s, 0s"
      transitionDuration=" 0.25s, 0.25s, 0.25s, 0s"
      transition-property="box-shadow, background-color, filter, border"
      transitionTimingFunction="linear, linear, linear, linear"
      alignItems={{ xl: 'center' }}
      display={secondary ? 'block' : 'flex'}
      minH="75px"
      justifyContent={{ xl: 'center' }}
      lineHeight="25.6px"
      mx="auto"
      mt={secondaryMargin}
      pb="8px"
      right={{ base: '12px', md: '30px', lg: '30px', xl: '30px' }}
      px={{
        sm: paddingX,
        md: '10px',
      }}
      ps={{
        xl: '12px',
      }}
      pt="8px"
      top={{ base: '12px', md: '16px', xl: '18px' }}
      w={{
        base: 'calc(100vw - 6%)',
        md: 'calc(100vw - 8%)',
        lg: 'calc(100vw - 6%)',
        xl: 'calc(100vw - 350px)',
        '2xl': 'calc(100vw - 365px)',
      }}
    >
      <Flex
        w="100%"
        flexDirection={{
          sm: 'column',
          md: 'row',
        }}
        alignItems={{ xl: 'center' }}
        mb={gap}
      >
        <Box mb={{ sm: '8px', md: '0px' }}>
          <Breadcrumb>
            <BreadcrumbItem color={secondaryText} fontSize="sm" mb="5px">
              <BreadcrumbLink href="#" color={secondaryText}>
                INFINITE-OPTIMAL
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem color={secondaryText} fontSize="sm">
              <BreadcrumbLink href="#" color={secondaryText}>
                {brandText}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          {/* Here we create navbar brand, based on route name */}
          <Link
            color={mainText}
            href="#"
            bg="inherit"
            borderRadius="inherit"
            fontWeight="bold"
            fontSize="38px"
            _hover={{ color: { mainText } }}
            _active={{
              bg: 'inherit',
              transform: 'none',
              borderColor: 'transparent',
            }}
            _focus={{
              boxShadow: 'none',
            }}
          >
            {brandText}
          </Link>
        </Box>
        <Box style={{ height: '66px', padding: '30px 0px 0px 20px' }}>
          <DatasetAddButton className="ant-btn ant-btn-primary" onClick={handleClick}>
            <span style={{ marginLeft: '30px', letterSpacing: '0.5px', fontSize: '14px', fontWeight: 500 }}>
              Upload
            </span>
            <img style={{ top: '-22px', left: '14px', position: 'relative' }} src={UploadIcon} />
          </DatasetAddButton>
        </Box>
        <Box ms="auto" w={{ sm: '100%', md: 'unset' }}>
          <AdminNavbarLinks onOpen={props.onOpen} secondary={props.secondary} fixed={props.fixed} />
        </Box>
      </Flex>
    </Box>
  )
}

const DatasetAddButton = styled.button`
  width: 140px;
  height: 35px;
  padding: 5px 3px 5px 0;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  color: #fff !important;
  background-color: #4338f7;
  box-shadow: 0 2px 0 rgba(55, 5, 255, 0.06);
  margin-bottom: 20px;
`
