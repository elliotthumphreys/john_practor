import React from 'react'
import styled from 'styled-components'

const Footer = () => {
    return <footer>
        <nav>
            <a><span className='fab fa-instagram'></span></a>
            <a><span className='fab fa-twitter'></span></a>
            <a><span className='fab fa-facebook-square'></span></a>
            <a><span className='fab fa-pinterest'></span></a>
            <a><span className='fab fa-youtube'></span></a>
        </nav>
        <p>&copy; {(new Date()).getFullYear()} John Practor Millinary</p>
    </footer>

}

export default Footer