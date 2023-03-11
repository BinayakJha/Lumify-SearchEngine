import React from 'react'
import './Search.css';
import SearchBar from './SearchBar';
import { NavLink, useNavigate } from 'react-router-dom';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import Sklton from './Sklton';



function SearchPage() {
    
    let query = window.location.search.split('=')[1]
    const [deta, setDeta] = React.useState([])
    React.useEffect(() => {
        // get the query from the url
        let query = window.location.search.split('=')[1]
        let url = 'http://127.0.0.1:8000/searchjs/' + query
        fetch(url).then(response =>{
            response.json().then((result) => {
                setDeta(result)
                localStorage.setItem('deta', JSON.stringify(result));
            })
        }).catch((error) => {
            console.log(error)
        })
    }, [])



    const [sidedeta, setSidedeta] = React.useState([])
    React.useEffect(() => {
        // get the query from the url
        let query = window.location.search.split('=')[1]
        let url = 'http://127.0.0.1:8000/sidesearch/' + query
        fetch(url).then(response =>{
            response.json().then((result) => {
                setSidedeta(result)
                localStorage.setItem('sidedeta', JSON.stringify(result));
            })
        }).catch((error) => {
            console.log(error)
        })
    }, [])

    const [related, setRelated] = React.useState([])
    React.useEffect(() => {
        // get the query from the url
        let query = window.location.search.split('=')[1]
        let url = `https://cors-anywhere.binayak123.repl.co/search.brave.com/api/suggest?q=${query}`
        fetch(url).then(response =>{
            response.json().then((result) => {
                // / the data is in this form : (2) [inputValue, Array(8)] 
            // so we need to extract the array from the data
                result = result[1]
                setRelated(result)
                console.log(result)
                localStorage.setItem('related', JSON.stringify(result));
                console.log(localStorage.getItem('related'))
            })
        }).catch((error) => {
            console.log(error)
        })
    }, [])

    const handleRelatedClick = (related) => {
        window.location.href = `/search?query=${related}`
    }
    


  return (
    <div className='searchpage'>
        <SearchBar/>
        <div class="container-flex">
            <div class="row">
                <div id="result" class="section col-xs-12 col-sm-11 col-lg-7">
                    {/* keep this skeleton until the data is loaded */}
                    {deta.length === 0 &&
                        <>
                            <Sklton/>
                            <Sklton/>
                            <Sklton/>
                            <Sklton/>
                        </>
                    }
                    {deta.map((currElem) => {
                        const {title, link, favicon, yt_url, text, cite} = currElem;
                        
                        return (
                            <>
                                <div class="snippet fdb " data-loc="main" data-pos="0" data-type="web" data-ref-pos="0" id="snippets">
                                        <a href={link} class="result-header" target="_self">
                                            <span class="snippet-title">
                                                <img alt="🌐" class="favicon" src={favicon}
                                                    loading="lazy" width="16" height="16" />
                                                    {title}
                                            </span>
                                        </a>
                                        <br/>
                                        <p class="snippet-description">
                                            {text}

                                            {yt_url? <img src={yt_url} width="25%" height="100%" style={{borderRadius: '8px', marginLeft: '10px'}} alt="logo"/> : null}
                                        
                                        </p>
                                        <cite class="snippet-url">
                                            <span class="netloc">
                                                <a href={link} style={{color: '#6d78a0'}}>
                                                    {cite}
                                                </a>
                                            </span>
                                        </cite>
                                </div>
                            </>
                        )
                    })}
                </div>

                
                {/* side right */}

                <div id="side-right" class="section col-md-5 col-sm-12">
                    <div id="infobox" class="infobox fdb" data-loc="side" data-pos="0" data-type="infobox" data-subtype="generic" data-ref-pos="0">
                        {/* if the data is 0 then show Related searches */}
                        {sidedeta.length === 0 &&
                            <>
                            </>
                        }
                        {sidedeta.map((currElem) => {
                            const {title, links, favicon, description, cite} = currElem;
                            return (
                                <>
                                    <div class="infobox-header">
                                        <div class="infobox-header-text">
                                            <br/>
                                            <a class="infobox-title" href="/" target="_self" style={{marginLeft: '-19px', textAlign: 'inherit', marginTop: '5px', fontSize: '25px'}}>
                                                {title}
                                            </a>
                                            <br/>
                                            <div class="infobox-description" style={{padding: '0px', textAlign: 'justify'}}>
                                                {description}

                                            </div>
                                        </div>
                                    </div>

                                    <div class="body">
                                        <div class="attribution text-xs">
                                                Data from
                                                    <a href={links} id="source" style={{color: '#1841D2', fontWeight: '500'}}> Click Here</a> 
                                                <hr/>
                                        </div>
                                    </div>
                                </>
                            )
                        })}

                        <div class="infobox-header" style={{
                            paddingTop: '0rem',
                        }}>
                                <div class="infobox-header-text">
                                    <br/>
                                    <a class="infobox-title" href="/" target="_self" style={{marginLeft: '-5px', textAlign: 'inherit', marginTop: '5px', fontSize: '25px'}}>
                                        Related Searches
                                    </a>
                                    <br/>
                                    <div class="infobox-description" style={{padding: '0px', textAlign: 'justify'}}>
                                        <ul style={{listStyleType: 'none', paddingLeft: '1rem'}}>
                                            <hr />
                                            {related.length === 0 &&
                                                <>
                                                    <li>
                                                        No Related Searches
                                                    </li>
                                                    <hr />
                                                </>
                                            }
                                            {related.map((currElem) => {   
                                                return (
                                                    <>
                                                        <li>
                                                            <NavLink  style={{color: '#1841D2', textDecoration: 'none'}} onClick={() => handleRelatedClick(currElem)}>
                                                                {currElem}
                                                            </NavLink>
                                                        </li>
                                                        <hr />
                                                    </>
                                                )
                                            })}
                                        </ul>
                                    </div>
                                </div>
                        </div>
                    </div>
                </div>


            </div>

            
        </div>
    </div>
  )
}

export default SearchPage