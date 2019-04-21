import React, { useContext } from 'react'
import Header from '../Header';
import { ContentContext } from '../Context'
import { BaseImageUrl } from '../../../config.json'


const Home = ({ match }) => {
    const { home, navigation } = useContext(ContentContext)

    return <div className="home">
        <Header {...{
            'header': [home['header-top'][0], home['header-bottom'][0]],
            'coverImage': `${BaseImageUrl}${home.images.filter(_ => _.id === 'coverImage')[0].path}`,
            'nav': navigation,
            'currentPage': match.path
        }} />
    </div>
}

export default Home