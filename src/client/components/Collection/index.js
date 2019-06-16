import React, { useState, useEffect, useContext } from 'react'
import { GetHats } from '../../util'
import ProductCard from './ProductCard'
import Masonry from './Masonry';
import { SmallHeader as Header } from '../Header'
import Footer from '../Footer';
import Select from './Select'
import { HatsContext } from '../Context'

import "../../sass/main.scss"

import { BaseImageUrl } from '../../../config.json'

const CONFIGURATION = {
    className: 'masonry',
    gap: '1px',
    columnOptions: [
        {
            window: 680,
            columns: 4
        },
        {
            window: 450,
            columns: 3
        },
        {
            window: 0,
            columns: 2
        }
    ]
}

const Collection = ({ history, match: { url, params: { category } } }) => {
    const hats = useHats()
    const [selectedCategory, setSelectedCategory] = useState('')
    const [filteredHats, setFilteredHats] = useState([])

    useEffect(() => {
        setFilteredHats(hats.filter(hat => !category || hat.category.toLowerCase() === category.toLowerCase()))
    }, [hats, category])

    useEffect(() => {
        setFilteredHats(hats.filter(hat => selectedCategory.toLowerCase() === 'all' || hat.category.toLowerCase() === selectedCategory.toLowerCase()))
    }, [selectedCategory])

    const categoryOptions = ['all', ...new Set(hats.map(_ => _.category))]

    return (
        <section className="collection">
            <Header currentPageSlug={url} />
            <div className={`body ${!category ? 'all' : ''}`}>
                {!category && <Select options={categoryOptions} setCategory={setSelectedCategory} />}
                <Masonry configuration={CONFIGURATION}>
                    {filteredHats
                        .map(({ id, coverImage }, index) => <ProductCard
                            id={id}
                            path={`${BaseImageUrl}400/${coverImage}`}
                            history={history}
                            isSold={index % 3 === 0}
                            key={index}
                        />)}
                </Masonry>
            </div>
            <Footer />
        </section>
    )
}

function useHats() {
    const [ hats, setHats ] = useState([])
    const { getHats } = useContext(HatsContext)

    const getHatsAsync = async () => {
        const hatsResponse = await getHats()

        if (hatsResponse) {
            setHats(hatsResponse)
        }
    }

    useEffect(() => {
        getHatsAsync()
    }, [])

    return hats
}

export default Collection