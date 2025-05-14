import React from 'react'
import Container from '@mui/material/Container';
const PageContainer = ({children}) => {
  return (
    <Container style={{minHeight: '45.99vh'}}>{children}</Container>
  )
}

export default PageContainer