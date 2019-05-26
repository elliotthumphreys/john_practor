import React, { useContext } from 'react'
import Header from '../Header';
import { ContentContext } from '../Context'
import { BaseImageUrl } from '../../../config.json'


const Home = ({ match }) => {
    const { home, navigation } = useContext(ContentContext)

    return <div className="home">
        <Header {...{
            'header': [home['header-top'], home['header-bottom']],
            'desktopCoverImage': `${BaseImageUrl}${home['desktopCoverImage']}`,
            'mobileCoverImage': `${BaseImageUrl}${home['mobileCoverImage']}`,
            'nav': navigation,
            'currentPage': match.path
        }} />
    </div>
}

export default Home