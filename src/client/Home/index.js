import React, { useState, useEffect } from 'react'
import { GetHats, GetContent } from '../util'
import ProductCard from './ProductCard'
import Masonry from './Masonry';

import "../sass/main.scss"

const Home = ({ history }) => {
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
            setContent(content)
        }
    }

    const masonryConfiguration = {
        className: 'masonry',
        gap: '0.2em',
        columnOptions: [
            {
                window: 960,
                columns: 4
            },
            {
                window: 700,
                columns: 3
            },
            {
                window: 500,
                columns: 2
            },

            {
                window: 0,
                columns: 1
            }
        ]
    }

    useEffect(() => {
        getContentAsync()
        getHatsAsync()
    }, [])

    return (
        <div className="home">
            {content && <img src={`http://localhost:4000/images/${content.images.filter(_ => _.id === 'coverImage')[0].path}`} />}
            <Masonry configuration={masonryConfiguration}>
                {hats.map(({ id, price, images }, index) => <ProductCard
                    id={id}
                    path={`http://localhost:4000/images/${images[0].path}`}
                    history={history}
                    price={price}
                    isSold={index%3===0}
                />)}
            </Masonry>
        </div>
    )
}

export default Home