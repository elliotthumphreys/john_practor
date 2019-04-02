import React, { useState, useEffect } from 'react'
import { GetHats, GetContent } from '../../util'
import ProductCard from './ProductCard'
import Masonry from './Masonry';
import Header from '../Header';
import Footer from '../Footer';

import "../../sass/main.scss"

const Collection = ({ history }) => {
    const [content, setContent] = useState()
    const [hats, setHats] = useState([])

    const getHatsAsync = async () => {
        const { success, hats } = await GetHats()

        if (success) {
            setHats(hats)
        }
    }

    const getContentAsync = async () => {
        const { success, content } = await GetContent()

        if (success) {
            setContent(content.pages.find(_ => _.slug === 'home').data)
        }
    }

    const masonryConfiguration = {
        className: 'masonry',
        gap: '1px',
        columnOptions: [
            {
                window: 500,
                columns: 4
            },
            {
                window: 0,
                columns: 3
            }
        ]
    }

    useEffect(() => {
        getContentAsync()
        getHatsAsync()
    }, [])

    return (
        <div className="home">
            {content && <Header {...{
                'header': content.header[0],
                'coverImage': `http://localhost:4000/images/${content.images.filter(_ => _.id === 'coverImage')[0].path}`,
                'pageTitle': 'Collection'
            }}
            />}
            <Masonry configuration={masonryConfiguration}>
                {hats.map(({ id, price, images }, index) => <ProductCard
                    id={id}
                    path={`http://localhost:4000/images/${images[0].path}`}
                    history={history}
                    price={price}
                    isSold={index % 3 === 0}
                />)}
            </Masonry>
            <Footer />
        </div>
    )
}

export default Collection