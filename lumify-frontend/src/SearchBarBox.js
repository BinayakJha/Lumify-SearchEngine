import React from 'react'
import './Search.css'
import {NavLink, useNavigate} from 'react-router-dom';


function SearchBarBox() {
    const [query, setQuery] = React.useState('')
    const [suggestions, setSuggestions] = React.useState([])
    const navigate = useNavigate()

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

    const handleSubmit = (e) => {
        e.preventDefault()
        navigate(`/search?query=${query}`)
    }

    const handleSuggestionClick = (suggestion) => {
        navigate(`/search?query=${suggestion}`)
    }

    
  return (
    <div>
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
                autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false" aria-label="Search"
                title="Search" aria-autocomplete="both" aria-haspopup="false" maxlength="2048" autofocus=""
                onInput={handleInputChange}
            />
            <input name="source" value="web" type="hidden" />
            <div id="autocomplete" className="svelte-ir7f0d"></div>
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
  )
}

export default SearchBarBox