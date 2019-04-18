import React, { useState, useEffect } from 'react'
import { GetHats } from '../../util'
import ProductCard from './ProductCard'
import Masonry from './Masonry';
import { SmallHeader as Header } from '../Header'
import Footer from '../Footer';
import Select from './Select'

import "../../sass/main.scss"

const CONFIGURATION = {
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

const Collection = ({ history, match: { url, params: { category } } }) => {
    const hats = useHats()
    const [selectedCategory, setSelectedCategory] = useState()

    const categoryOptions = ['all', ...new Set(hats.map(_ => _.category))]

    return (
        <section className="collection">
            <Header currentPageSlug={url} />
            <div className="body">
                {!category && <Select options={categoryOptions} setCategory={setSelectedCategory} />}
                <Masonry configuration={CONFIGURATION}>
                    {hats
                        .filter(hat => {
                            if (!category && (!selectedCategory || selectedCategory === 'all')) {
                                return true
                            }
                            return selectedCategory ? hat.category === selectedCategory : hat.category === category
                        })
                        .map(({ id, price, images }, index) => <ProductCard
                            id={id}
                            path={`http://localhost:4000/images/${images[0].path}`}
                            history={history}
                            price={price}
                            isSold={index % 3 === 0}
                        />)}
                </Masonry>
            </div>
            <Footer />
        </section>
    )
}

function useHats() {
    const [hats, setHats] = useState([])

    const getHatsAsync = async () => {
        const response = await GetHats()

        if (response.success) {
            setHats(response.hats)
        }
    }

    useEffect(() => {
        getHatsAsync()
    }, [])

    return hats
}

export default Collection