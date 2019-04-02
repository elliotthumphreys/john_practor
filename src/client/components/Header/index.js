import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Header = ({ header, coverImage, pageTitle, nav = [], currentPage }) => {
    const SectionWithBackground = styled.section`
        background-image: url("${coverImage}");
    `
    return (
        <Fragment>
            
            <SectionWithBackground className="home-banner-container">
                <h1>{header}</h1>
               
                <nav>
                    {nav.map((_, key) => 
                        <Link key={key} to={`/${_.slug}`}>
                            <span className={currentPage == `/${_.slug}` ? 'active' : ''}>
                                {console.log(currentPage, _.slug)}{_.name}
                            </span>
                        </Link>)}
                </nav>
            </SectionWithBackground>

            {pageTitle && <div className="headercontiner">
                <h2 className="header"><span>{pageTitle}</span></h2>
            </div>}
        </Fragment>
    )

}

export default Header