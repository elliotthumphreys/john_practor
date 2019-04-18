import React, { useState, useEffect } from 'react'
import { Markdown } from 'react-showdown'
import { CreateHat, GetHat, UpdateHat, CheckTokenAuthentication } from '../../util'

const Add = ({ history, match }) => {
    const [id, setId] = useState()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [category, setCategory] = useState('')
    const [credit, setCredit] = useState('')
    const [images, setImages] = useState([])

    const [oldImages, setOldImages] = useState([])
    const [deletedImages, setDeletedImages] = useState([])

    const [isLoading, setIsLoading] = useState(false)
    const [isSuccessful, setIsSuccessful] = useState(null)

    const checkAuthentication = async () => {
        const { authenticated } = await CheckTokenAuthentication()

        if (!authenticated) {
            history.push({ pathname: '/admin/login' })
        }
    }

    const getHat = async id => {
        const { hat, authenticated } = await GetHat(id)

        if (authenticated) {
            setTitle(hat.title)
            setDescription(hat.description)
            setPrice(hat.price)
            setCategory(hat.category)
            setCredit(hat.credit)
            setOldImages(hat.images)
        } else {
            history.push({ pathname: '/admin/login' })
        }
    }

    const add = async () => {
        const { success } = await CreateHat({
            title,
            description,
            price,
            category,
            credit,
            images
        })

        setIsSuccessful(success)

        if (success) {
            setTitle('')
            setDescription('')
            setPrice('')
            setCategory('')
            setCredit('')
            setImages([])

            //images is an uncontrolled input so have to do this to reset its fields
            document.getElementById("add-product-form").reset();
        }
    }

    const update = async () => {
        const { success, hat } = await UpdateHat({
            id,
            title,
            description,
            price,
            category,
            credit,
            images,
            deletedImages
        })

        if (success) {
            setTitle(hat.title)
            setDescription(hat.description)
            setPrice(hat.price)
            setCategory(hat.category)
            setCredit(hat.credit)
            setOldImages(hat.images)
            setDeletedImages([])
            setImages([])

            //images is an uncontrolled input so have to do this to reset its fields
            document.getElementById("add-product-form").reset();
        }

        setIsSuccessful(success)
    }

    useEffect(() => {
        checkAuthentication()
        if (match.params.hasOwnProperty('id')) {
            getHat(match.params.id)
            setId(match.params.id)
        } else {
            //check authentication
        }
    }, [])

    const onFormSubmit = async event => {
        event.preventDefault()

        setIsLoading(true)

        if (id) {
            await update()
        } else {
            await add()
        }

        setIsLoading(false)
    }

    const deleteImageOnClick = id => {
        if (deletedImages.findIndex(_ => _ === id) >= 0) {
            setDeletedImages(deletedImages.filter(_ => _ !== id))
        } else {
            setDeletedImages([...deletedImages, id])
        }
    }

    return (
        <div className="add">
            <nav>
                <a onClick={() => history.push({ pathname: `/admin/edit-main-content` })}><span className="fas fa-edit"></span> Edit main content</a>
                <a onClick={() => history.push({ pathname: `/admin/view-all` })}><span className="fas fa-plus-circle"></span> View All</a>
            </nav>
            <form onSubmit={onFormSubmit} id="add-product-form">
                <label>
                    Title
                    <input type="text" onChange={_ => setTitle(_.target.value)} value={title} />
                </label>
                <label>
                    Description
                    <textarea onChange={_ => setDescription(_.target.value)} value={description} required></textarea>
                </label>
                <div className='descriptionPreview'>
                    <Markdown markup={ description } />
                </div>
                <label>
                    Price
                    <input type="text" onChange={_ => setPrice(_.target.value)} value={price} required/>
                </label>
                <label>
                    Category
                    <input type="text" onChange={_ => setCategory(_.target.value)} value={category} required/>
                </label>
                <label>
                    Credit
                    <span className="form-hint">
                        Comma seperated list of people/brands/artists you would like to give credit to.
                    </span>
                    <input type="text" onChange={_ => setCredit(_.target.value)} value={credit} />
                </label>
                <label >
                    Images
                    <input className="no-border" name="images" type="file" multiple onChange={_ => setImages(_.target.files)} />
                </label>

                {oldImages.length > 0 &&
                    <div className="imageContainer">
                        {oldImages.map((images, key) => (
                            <div key={key} className='image'>
                                {deletedImages.findIndex(id => id == images._id) === -1 ?
                                    <button type="button" className='remove-button' onClick={() => deleteImageOnClick(images._id)}>remove image</button>
                                    :
                                    <button type="button" className='add-button' onClick={() => deleteImageOnClick(images._id)}>add image</button>
                                }
                                <img src={`http://localhost:4000/images/${images.path}`} />
                            </div>
                        ))}
                    </div>
                }

                {isSuccessful === true && <div className="form-success"><p>Product upload was successful</p></div>}
                {isSuccessful === false && <div className="form-fail"><p>Product was not uploaded, please try again</p></div>}

                <button type="submit" disabled={isLoading}>
                    {isLoading ? <span className="fa fa-spinner fa-spin" /> : 'Save and continue'}
                </button>
            </form>
        </div>
    )
}

export default Add;