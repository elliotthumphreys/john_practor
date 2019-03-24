import React, { useState, useEffect, Fragment } from 'react'
import { GetHat, GetContent } from '../util'

const Product = ({ history }) => {
    const [ content, setContent ] = useState({})
    const [ hat, setHat ] = useState([])

    const getHatAsync = async () => {
        const { success, hat } = await GetHat()

        if(success){
            setHat(hat)
        }
    }

    const getContentAsync = async () => {
        const { success, content } = await GetContent()

        if(success){
            setContent(content)
        }
    }

    useEffect(() => {
        getContentAsync()
        getHatAsync()
    }, [])

    return (
        <Fragment>
            <h1>Prodcut page</h1>
        </Fragment>
    )
}

export default Product