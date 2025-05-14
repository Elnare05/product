import React from 'react'
import Navbar from '../Components/Navbar'
import ContactUs from '../Components/ContactUs'
import Footer from '../Components/Footer'
import PageContainer from '../container/PageContainer'
const Contact = () => {
  return (
    <div>    <PageContainer>
      <Navbar />
      <ContactUs />
    </PageContainer>
      <Footer />
    </div>
  )
}

export default Contact