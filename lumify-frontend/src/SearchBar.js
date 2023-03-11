import React from 'react';
import './Search.css';
import SearchBarBox from './SearchBarBox';
import { useNavigate } from 'react-router-dom';
function SearchBar() {
    const [query , setQuery] = React.useState('')
    const [suggestions, setSuggestions] = React.useState([])
    const handleInputChange = async (e) => {
        const inputValue = e.target.value
        setQuery(inputValue)
        if (inputValue.trim()) {
        try {
            const response = await fetch(`https://cors-anywhere.binayak123.repl.co/search.brave.com/api/suggest?q=${inputValue}`)
            let data = await response.json()
            console.log(data)
            // the data is in this form : (2) [inputValue, Array(8)] 
            // so we need to extract the array from the data
            data = data[1]
            
            setSuggestions(data)
        } catch (error) {
            console.error(error)
        }
        } else {
        setSuggestions([])
        }
    }
    const handleSuggestionClick = (suggestion) => {
        window.location.href = `/search?query=${suggestion}`
    }


    const handleSubmit = (e) => {
        e.preventDefault()
        // search without reloading the page
        window.location.href = `/search?query=${query}`

    }
    let navigate = useNavigate()
    let handleSubmitAll = (e) => {
        e.preventDefault()
        console.log('hello')
        // search without reloading the page
        let qu = window.location.search.split('=')[1]
        navigate(`/search?query=${qu}`)
    }

    const handleSubmitImage = (e) => {
        e.preventDefault()
        // search without reloading the page
        let qu = window.location.search.split('=')[1]
        navigate(`/image?q=${qu}`)
    }
                    
  return (
    <div className='searchbar'>
        <div id="main" style={{display: 'flex'}}>
            <h1 className='logoo'>
                <a href="/">
                    <img src="/lumify-frontend/build/images/logo.png" style={{width: '82px', height: 'auto', marginRight: '10px'}}/>
                </a>
            </h1>
            <div className="searchform-container">
                <form className="form" method="GET" id="searchform" onSubmit={handleSubmit}>
                    <span id="search-icon" className="no-display">
                        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M6.57212 13.1442C2.94254 13.1442 0 10.2016 0 6.57173C0 2.94248 2.94268 0 6.57212 0C10.2016 0 13.1442 2.94248 13.1442 6.57173C13.1442 8.05658 12.6519 9.42642 11.8215 10.5269L16.3528 15.0581C16.7103 15.4156 16.7103 15.9952 16.3528 16.3527C15.9953 16.7102 15.4157 16.7102 15.0582 16.3527L10.527 11.8215C9.42657 12.6519 8.05682 13.1442 6.57212 13.1442ZM6.57212 11.2665C3.97956 11.2665 1.87775 9.16463 1.87775 6.57184C1.87775 3.97952 3.97966 1.87775 6.57212 1.87775C9.16458 1.87775 11.2665 3.97952 11.2665 6.57184C11.2665 9.16463 9.16468 11.2665 6.57212 11.2665Z"
                                fill="url(#paint0_linear)">
                            </path>
                            <defs>
                                <linearGradient id="paint0_linear" x1="16.6209" y1="16.6208" x2="-1.90605" y2="3.18655"
                                gradientUnits="userSpaceOnUse">
                                <stop stop-color="#BF14A2"></stop>
                                <stop offset="1" stop-color="#F73A1C"></stop>
                                </linearGradient>
                            </defs>
                        </svg>
                    </span>
                    <input name="query" id='query' type="text" className="form-input search__bar__input"
                        placeholder="Illuminating Your Digital Search Experience.." value={query} onChange={(e) => setQuery(e.target.value)}
                        title="Search"  maxlength="2048" autofocus="" 
                        onInput={handleInputChange}
                        />
                    <input name="source" value="web" type="hidden" />
                    <div id="autocomplete" className="svelte-ir7f0d">
                    </div>
                    <div className="search__suggestions autocomplete-items" id="auto1">
                    <ul className="search__suggestions__list" id="suggestionList">
                        {suggestions.map((currElem, index) => (
                            <li key={index} className="search__suggestions__list__result" onClick={() => handleSuggestionClick(currElem)}>
                            {currElem}
                            </li>
                        ))}
                    </ul>
                    </div>
                </form>
            </div>
            <br/>
        </div>
        <div style={{display: 'flex', paddingLeft: '23px', color: 'var(--page-color)', marginBottom: '-14px !important'}}>
        <h1 style={{visibility: 'hidden', marginBottom: '0rem !important'}}>
        
        
        </h1>
        <div id="navbar-tabs">
            <div className="container-80" id="nav-tabs-container">

                <nav id="nav-tabs">
                    <ul id="primary-tabs">
                        <li>

                            <a href="/" onClick={handleSubmitAll}>
                                <span className="icon-wrapper">
                                    <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="18" height="17"
                                        viewBox="0 0 18 17">
                                        <path fill-rule="evenodd"
                                            d="M1.6 7.336a5.736 5.736 0 1 1 11.471 0 5.736 5.736 0 0 1-11.471 0ZM7.336 0a7.336 7.336 0 1 0 4.957 12.743l3.56 3.561a.8.8 0 0 0 1.132-1.131l-3.636-3.636A7.336 7.336 0 0 0 7.335 0Z"
                                            clip-rule="evenodd"></path>
                                    </svg> </span>
                                <span>
                                    All
                                </span>
                            </a>
                        </li>

                        <li>
                            <a href="/" onClick={handleSubmitImage}>
                                <span className="icon-wrapper">
                                    <svg className="icon" width="17" height="17" viewBox="0 0 17 17"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M12.492 2.093h-8a2.6 2.6 0 00-2.6 2.6v8a2.6 2.6 0 002.6 2.6h8a2.6 2.6 0 002.6-2.6v-8a2.6 2.6 0 00-2.6-2.6zm-8-1.4a4 4 0 00-4 4v8a4 4 0 004 4h8a4 4 0 004-4v-8a4 4 0 00-4-4h-8zm5.46 7.048a.7.7 0 01.514.156l2.971 2.447a.7.7 0 01-.89 1.08L10.12 9.427l-2.172 2.676a.7.7 0 01-1.001.088l-1.142-.987L4.55 12.86a.7.7 0 01-1.116-.845L5.14 9.763a.7.7 0 011.016-.107l1.16 1.003 2.162-2.663a.7.7 0 01.473-.255zM4.34 5.291a.5.5 0 111 0 .5.5 0 01-1 0zm.5-1.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z">
                                        </path>
                                    </svg> 
                                </span>
                                <span>
                                    Images
                                </span>
                            </a>
                        </li>

                        <li>
                            <a href="#">
                                <span className="icon-wrapper">
                                    <svg className="icon" width="17" height="17" viewBox="0 0 17 17"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M12.317 2.093h-.225a.8.8 0 00-.575.768v2.133h3.022a.575.575 0 00.378-.14v-.161a2.6 2.6 0 00-2.6-2.6zm0-1.4c.685 0 1.33.172 1.893.475a3.556 3.556 0 012.104 3.359c.002.055.003.11.003.166v8a4 4 0 01-4 4h-8a4 4 0 01-4-4v-8a4 4 0 014-4h8zm2.222 5.501c.13 0 .256-.014.378-.04v6.539a2.6 2.6 0 01-2.6 2.6h-8a2.6 2.6 0 01-2.6-2.6v-8a2.6 2.6 0 012.6-2.6h6.153a1.994 1.994 0 00-.153.768v2.333a1 1 0 001 1h3.222zM3.615 4.808a.6.6 0 000 1.2h4a.6.6 0 000-1.2h-4zm-.6 2.937a.6.6 0 01.6-.6h8a.6.6 0 110 1.2h-8a.6.6 0 01-.6-.6zm.6 1.866a.6.6 0 000 1.2h8a.6.6 0 000-1.2h-8z">
                                        </path>
                                    </svg> 
                                </span>
                                <span>
                                    News
                                </span>
                            </a>
                        </li>

                        <li>
                            <a href="#">
                                <span className="icon-wrapper">
                                    <svg className="icon" width="16" height="17" viewBox="0 0 16 17"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd"
                                            d="M10.283 1.408h2.161c.2 0 .395.026.58.073L10.296 4.21H7.483l2.78-2.78a.462.462 0 00.02-.02zm-1.507 0H6.067a.544.544 0 01-.02.022l-2.78 2.78h2.708l2.8-2.802zM1.759 4.21l2.8-2.8H3.557a2.311 2.311 0 00-2.312 2.31v.49h.515zm10.046 0h2.95v-.49c0-.676-.29-1.284-.753-1.707L11.805 4.21zM1.245 5.454h13.51v7.154a2.311 2.311 0 01-2.31 2.311h-8.89a2.311 2.311 0 01-2.31-2.31V5.453zM0 3.719A3.556 3.556 0 013.556.164h8.888A3.556 3.556 0 0116 3.719v8.89a3.556 3.556 0 01-3.556 3.555H3.556A3.556 3.556 0 010 12.608V3.72zm7.22 8.674l2.933-1.694a.978.978 0 000-1.693L7.22 7.312a.978.978 0 00-1.466.847v3.387a.978.978 0 001.466.847zm-.222-3.772l2.133 1.232-2.133 1.231V8.621z"
                                            clip-rule="evenodd"></path>
                                    </svg> 
                                </span>
                                <span>
                                    Videos
                                </span>
                            </a>
                        </li>
                    </ul>
                    <ul id="secondary-tabs">
                        <li id="tools-info"><button className="btn btn--icon btn--sm svelte-amqj0r" title="Info" tp-type="button"><div className="icon-wrapper"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M15.891 15.8931C14.3172 17.4667 12.2242 18.3333 9.99711 18.3333C7.77067 18.3333 5.6777 17.4667 4.10327 15.8924C0.854454 12.6431 0.854454 7.35625 4.10327 4.10764C5.6777 2.53333 7.77067 1.66667 9.99711 1.66667C12.2242 1.66667 14.3172 2.53333 15.891 4.10764C17.4661 5.68125 18.3333 7.77431 18.3333 10C18.3333 12.2257 17.4661 14.3188 15.891 15.8931ZM14.9091 5.08958C13.5974 3.77778 11.8532 3.05556 9.99711 3.05556C8.14175 3.05556 6.39749 3.77778 5.08581 5.08958C2.37789 7.79722 2.37789 12.2028 5.08581 14.9104C6.39749 16.2222 8.14175 16.9444 9.99711 16.9444C11.8532 16.9444 13.5974 16.2222 14.9091 14.9104C16.2215 13.5993 16.9441 11.8549 16.9441 10C16.9441 8.14514 16.2215 6.40139 14.9091 5.08958ZM11.3871 14.8611H8.60857C8.22562 14.8611 7.91394 14.55 7.91394 14.1667C7.91394 13.7833 8.22562 13.4722 8.60857 13.4722H9.3032V10.6944H8.60857C8.22562 10.6944 7.91394 10.3833 7.91394 10C7.91394 9.61667 8.22562 9.30556 8.60857 9.30556H9.99782C10.3815 9.30556 10.6924 9.61667 10.6924 10V13.4722H11.3871C11.7707 13.4722 12.0817 13.7833 12.0817 14.1667C12.0817 14.55 11.7707 14.8611 11.3871 14.8611ZM9.99781 7.91667C9.2319 7.91667 8.60856 7.29306 8.60856 6.52708C8.60856 5.76181 9.2319 5.13889 9.99781 5.13889C10.7644 5.13889 11.3871 5.76181 11.3871 6.52708C11.3871 7.29306 10.7644 7.91667 9.99781 7.91667Z"></path></svg>
                        </div></button></li>
                        <li className="tabs-divider"></li>
                    </ul>
                </nav>  
            </div>
        </div>
        </div>
        <hr/>

    </div>
  )
}

export default SearchBar