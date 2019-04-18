import React, { useContext } from 'react'
import Header from '../Header';
import {ContentContext} from '../Context'


const Home = ({match}) => {
    const {home, navigation} = useContext(ContentContext)

    return <div className="home">
        <Header {...{
            'header': [home['header-top'][0], home['header-bottom'][0]],
            'coverImage': `http://localhost:4000/images/${home.images.filter(_ => _.id === 'coverImage')[0].path}`,
            'nav': navigation,
            'currentPage': match.path
        }} />
    </div>
}

export default Home