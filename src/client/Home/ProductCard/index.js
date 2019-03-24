import React from 'react'

const ProductCard = ({ id, path, price, isSold, history: { push } }) => {
    return (
        <div className="product-card">
            <a href='#' onClick={e => {
                e.preventDefault()
                push({ pathname: `/product/${id}` })
            }}>
                <img src={path} />
                <p>&pound;{price}</p>
                {isSold && <span className="fas fa-circle" />}
            </a>
        </div>
    )
}

export default ProductCard