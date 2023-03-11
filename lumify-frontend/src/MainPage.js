import React from 'react'
import './Main.css'
import SearchBarBox from './SearchBarBox'

function MainPage() {
     let query = window.location.search.split('=')[1]

  return (
    <div className='mainpage'>
        <div id="main">
            <div className="container-flex">
                <div className="row">
                    <h1 className="heading">
                        <img src='/lumify/build/images/logo.png' style={{width: 90,height:'auto',marginRight: 6,marginBottom: 3}}/>
                        LuMiFy
                    </h1>

                    <div className="searchform-container">
                        <center>
                            <SearchBarBox />
                        </center>
                    </div>
                </div>
                <br/>
            </div>
        </div>

    </div>
  )
}

export default MainPage