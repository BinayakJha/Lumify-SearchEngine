import React from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import './Main.css'
function ImgSklton() {
  return (
    <div>
        <SkeletonTheme color="whitesmoke" highlightColor="whitesmoke">
            <div className="image">
                <a href="" >
                </a>
                <p style={{fontSize: '13px', color: 'black !important' , padding: '10px'}}>
                    <a href=""  style={{color: 'black !important'}}>
                        <Skeleton width={'100%'} height={200} />
                    </a>
                </p>
            </div>
           
        </SkeletonTheme>
        <SkeletonTheme color="whitesmoke" highlightColor="whitesmoke">
            <div className="imagee">
                <a href="" >
                </a>
                <p style={{fontSize: '13px', color: 'black !important' , padding: '10px'}}>
                    <a href=""  style={{color: 'black !important'}}>
                        <Skeleton width={'100%'} height={200} />
                    </a>
                </p>
            </div>

        </SkeletonTheme>

       
    </div>
  )
}

export default ImgSklton