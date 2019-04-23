import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { ContentContext } from '../Context'

const Header = ({ header, desktopCoverImage, mobileCoverImage, pageTitle, nav = [], currentPage }) => {
    const [url, setUrl] = useState('')

    useEffect(() => {
        const changeUrl = () => {
            const imageUrl = window.innerWidth > window.innerHeight? desktopCoverImage : mobileCoverImage
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
            <SectionWithBackground className="home-banner-container">
                <header>
                    <h1>
                        <span>{header[0]}</span>
                        <span>{header[1].split('').join(' ')}</span>
                    </h1>
                </header>
                <nav>
                    <div>
                        {nav.map((_, key) =>
                            <Link key={key} to={`/${_.slug}`}>
                                <span className={currentPage == `/${_.slug}` ? 'active' : ''}>
                                    {console.log(currentPage, _.slug)}{_.name}
                                </span>
                            </Link>)}
                    </div>
                </nav>
            </SectionWithBackground>

            {pageTitle && <div className="headercontiner">
                <h2 className="header"><span>{pageTitle}</span></h2>
            </div>}
        </Fragment>
    )

}

export const SmallHeader = ({currentPageSlug}) => {
    const {home: {['header-top']: headerTop, ['header-bottom']: headerBottom}, navigation} = useContext(ContentContext)

    return <section className="small-header">
        <header>
            <h1>
                <span>{headerTop[0]}</span>
                <span>{headerBottom[0].split('').join(' ')}</span>
            </h1>
        </header>
        <nav>
            {navigation.map((_, key) =>
                <Link key={key} to={`/${_.slug}`}>
                    <span className={currentPageSlug == `/${_.slug}` ? 'active' : ''}>
                        {_.name}
                    </span>
                </Link>)}
        </nav>
    </section>
}

export default Header