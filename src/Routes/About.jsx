import React from 'react'
import AboutUs from '../Components/AboutUs'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import PageContainer from '../container/PageContainer'

function About() {
  return (
    <div>
      <PageContainer>
        <Navbar />
        <AboutUs />
      </PageContainer>
      <Footer />
    </div>
  )
}

export default About