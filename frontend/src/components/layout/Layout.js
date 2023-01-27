import React from 'react'
import Footer from '../footer/Footer'
import Header from '../header/Header'

const Layout = ({childern}) => {
  return (
    <>
        <Header/>
        <div style={{minHeight: "80vh"}} className="--pad">
            {childern}
        </div>
        <Footer/>
    </>
  )
}

export default Layout