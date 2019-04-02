import React from 'react'
import Header from '../Header';

const Home = ({content, nav, match}) => {
    return <div className="home">
        {content && <Header {...{
            'header': content.header[0],
            'coverImage': `http://localhost:4000/images/${content.images.filter(_ => _.id === 'coverImage')[0].path}`,
            'nav': nav,
            'currentPage': match.path
        }} />}
    </div>
}

export default Home