import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { ContentContext } from '../Context'
import { BaseImageUrl } from '../../../config.json'

const Header = ({ header, desktopCoverImage, mobileCoverImage, pageTitle, nav = [], currentPage }) => {
    const [url, setUrl] = useState('')

    useEffect(() => {
        const changeUrl = () => {
            const imageUrl = window.innerWidth > window.innerHeight ? desktopCoverImage : mobileCoverImage
            setUrl(imageUrl)
        }
        changeUrl()

        window.addEventListener('resize', changeUrl)

        return () => window.removeEventListener('resize', changeUrl)
    })

    const SectionWithBackground = styled.section`
        background-image: url("${url}");
    `

    return (
        <Fragment>
            <SectionWithBackground className="home-banner-container desktop">
                <header>
                    <img src={`${BaseImageUrl}logo-white.svg`} />
                    <h1>
                        <span>{header[0]}</span>
                        <span>{header[1].split('').join(' ')}</span>
                    </h1>
                </header>
                <nav>
                    <div>
                        {Object.keys(nav).map((name, key) => {
                            if (name === 'slug' || name === 'name') return
                            return <Link key={key} to={`/${nav[name]}`}>
                                <span className={currentPage == `/${nav[name]}` ? 'active' : ''}>
                                    {name}
                                </span>
                            </Link>
                        })}
                    </div>
                </nav>
            </SectionWithBackground>
            <section className="home-banner-container mobile">
                
            <img src={`${BaseImageUrl}logo-black.svg`} />
                <header>
                    <h1>
                        <span>{header[0]}</span>
                        <span>{header[1].split('').join(' ')}</span>
                    </h1>
                </header>
                <SectionWithBackground />
                <nav>
                    <div>
                        {Object.keys(nav).map((name, key) => {
                            if (name === 'slug' || name === 'name') return
                            return <Link key={key} to={`/${nav[name]}`}>
                                <span className={currentPage == `/${nav[name]}` ? 'active' : ''}>
                                    {name}
                                </span>
                            </Link>
                        })}
                    </div>
                </nav>
            </section>

            {pageTitle && <div className="headercontiner">
                <h2 className="header"><span>{pageTitle}</span></h2>
            </div>}
        </Fragment>
    )

}

export const SmallHeader = ({ currentPageSlug }) => {
    const { home: { ['header-top']: headerTop, ['header-bottom']: headerBottom }, navigation } = useContext(ContentContext)

    return <section className="small-header">
        <header>
            <img src={`${BaseImageUrl}logo-black.svg`} />
            <h1>
                <span>{headerTop}</span>
                <span>{headerBottom.split('').join(' ')}</span>
            </h1>
        </header>
        <nav>
            {Object.keys(navigation).map((name, key) => {
                if (name === 'slug' || name === 'name') return
                return <Link key={key} to={`/${navigation[name]}`}>
                    <span className={currentPageSlug == `/${navigation[name]}` ? 'active' : ''}>
                        {name}
                    </span>
                </Link>
            })}
        </nav>
    </section>
}

export default Header