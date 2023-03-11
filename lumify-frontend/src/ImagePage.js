import React from 'react'
import './Search.css';
import { NavLink } from 'react-router-dom';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import SearchBar from './SearchBar';
import ImgSklton from './ImgSklton';
function ImagePage() {
    const [image , setImage] = React.useState([])

    React.useEffect(() => {
        let query = window.location.search.split('=')[1]
        let url = 'http://127.0.0.1:8000/imagesearch/'+query
       
        fetch(url).then(response =>{
            response.json().then((result) => {
                setImage(result)
                localStorage.setItem('image', JSON.stringify(result));
            })
        }).catch((error) => {
            console.log(error)
        })
    }, [])
  return (
    <div className='imagepage'>
        <SearchBar/>

        {image.length === 0 &&
            <>
            <div style={{display: 'flex', alignItems: 'center', padding: '10px', flexWrap:'wrap', justifyContent: 'center'}}>
                    <ImgSklton />
                    <ImgSklton />
                    <ImgSklton />
                    <ImgSklton />
                    <ImgSklton />
                    <ImgSklton />
            </div>
            </>
        }
        <div className="grid">
            <div className="grid-item">
            
            {image.map((currElem) => {
                const {image_desc, image_url} = currElem;
                
                return (

                    <div className="image">
                        <a href={image_url} target="_blank">
                            <img src={image_url} alt="" style={{width: '100%', height: '70%', objectFit: 'contain'}}/>
                        </a>
                        
                    </div>
                )
            })}
            </div>
        </div>
    </div>
  )
}

export default ImagePage