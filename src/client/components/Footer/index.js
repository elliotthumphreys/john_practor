import React, { useContext } from 'react'
import { ContentContext } from '../Context'

const Footer = () => {
    const { social } = useContext(ContentContext)

    return <footer>
        <nav>
            <a href={social.Instagram}><span className='fab fa-instagram'></span></a>
            <a href={social.Twitter}><span className='fab fa-twitter'></span></a>
            <a href={social.Facebook}><span className='fab fa-facebook-square'></span></a>
            <a href={social.Pinterest}><span className='fab fa-pinterest'></span></a>
            <a href={social.Youtube}><span className='fab fa-youtube'></span></a>
        </nav>
        <p>&copy; {(new Date()).getFullYear()} johnproctormilliner.com</p>
    </footer>

}

export default Footer