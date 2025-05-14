import React from 'react'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import HomeMain from '../Components/HomeMain'
import PageContainer from '../container/PageContainer'
const Home = () => {
  return (
    <div>
      <PageContainer>
        <Navbar />
        <HomeMain />
      </PageContainer>
      <Footer />

    </div>
  )
}

export default Home