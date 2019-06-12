import React, { useEffect, useState, Fragment } from 'react'
import ImageLoader from 'react-load-image'
import { BaseImageUrl } from '../../../../config.json'
import uuid from 'uuid4'
import styles from 'styled-components'

const ProductCard = ({ id, path, history: { push } }) => {
    const [height, setHeight] = useState(0)
    const uniqueId = uuid()

    useEffect(() => {
        const image = document.getElementsByClassName(`placeholder-image-${uniqueId}`)[0]

        const listernerFunction = () => {
            const container = document.getElementsByClassName(`placeholder-container-${uniqueId}`)[0]

            console.log('Width', container.offsetWidth)

            setHeight(container.offsetWidth / (243817 / 365067))
        }

        image.addEventListener('load', listernerFunction)
        listernerFunction()

        return () => image.removeEventListener('load', listernerFunction)
    }, [])

    const PreloadedImage = () => {
        const Placeholder = styles.div`
            display: flex;
            height: ${height}px;
            flex-direction: column;
            justify-content: center;
        `

        const Img = styles.img`
            width: 50px!important;
            margin: auto;
        `
        return (
            <Placeholder className={`placeholder-container-${uniqueId}`}>
                <Img className={`placeholder-image-${uniqueId}`} src={`${BaseImageUrl}logo-white.svg`} />
            </Placeholder>
        )
    }

    const ErrorImage = () => <Fragment />

    return (
        <div className="product-card">
            <a href='#' onClick={e => {
                e.preventDefault()
                push({ pathname: `/product/${id}` })
            }}>
                <ImageLoader src={path}>
                    <img />
                    <ErrorImage />
                    <PreloadedImage />
                </ImageLoader>
            </a>
        </div>
    )
}

export default ProductCard