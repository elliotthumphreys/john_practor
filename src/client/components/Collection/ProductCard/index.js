import React from 'react'

const ProductCard = ({ id, path, history: { push } }) => {
    return (
        <div className="product-card">
            <a href='#' onClick={e => {
                e.preventDefault()
                push({ pathname: `/product/${id}` })
            }}>
                <img src={path} />
            </a>
        </div>
    )
}

export default ProductCard