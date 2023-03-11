import React from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
function Sklton() {
  return (
    <div>
        <SkeletonTheme color="whitesmoke" highlightColor="whitesmoke">
            <div class="snippet fdb " data-loc="main" data-pos="0" data-type="web" data-ref-pos="0" id="snippets">
                <a href="" class="result-header" target="_self">
                    <span class="snippet-title" style={{display: 'flex'}}>
                            {/* Add a skeleton image */}
                            <Skeleton width={20} height={20} class="favicon" />
                            &nbsp;
                            <Skeleton width={200} height={20} />
                    </span>
                </a>
                <br/>
                <p class="snippet-description">
                    <Skeleton width={600} height={20} />
                </p>
                <p class="snippet-description">
                    <Skeleton width={500} height={20} />
                </p>
                <cite class="snippet-url">
                    <span class="netloc">
                        <a href="" style={{color: '#6d78a0'}}>
                            <Skeleton width={200} height={20} />
                        </a>
                    </span>
                </cite>
            </div>
        </SkeletonTheme>
    </div>
  )
}

export default Sklton