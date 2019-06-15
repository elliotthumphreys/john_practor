import React, { useState, useEffect } from 'react'
import { Markdown } from 'react-showdown'
import { CreateHat, GetHat, UpdateHat, CheckTokenAuthentication } from '../../util'
import ImageEditorRc from 'react-cropper-image-editor';
import 'cropperjs/dist/cropper.css';
import config from '../../../config.json'

const Add = ({ history, match }) => {
    const [id, setId] = useState()
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')
    const [credit, setCredit] = useState('')

    const [previewCoverImage, setPreviewCoverImage] = useState()
    const [coverImage, setCoverImage] = useState()
    const [parsedCoverImage, setParsedCoverImage] = useState()

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
            setDescription(hat.description)
            setCategory(hat.category)
            setCredit(hat.credit)
            setOldImages(hat.images)
            setPreviewCoverImage(`${config.BaseImageUrl}${hat.coverImage}`)
        } else {
            history.push({ pathname: '/admin/login' })
        }
    }

    const add = async () => {
        const { success } = await CreateHat({
            description,
            category,
            credit,
            images,
            coverImage: parsedCoverImage
        })

        setIsSuccessful(success)

        if (success) {
            setDescription('')
            setCategory('')
            setCredit('')
            setCoverImage()
            setPreviewCoverImage()
            setParsedCoverImage()
            setImages([])

            //images is an uncontrolled input so have to do this to reset its fields
            document.getElementById("add-product-form").reset();
        }
    }

    const update = async () => {
        const { success, hat } = await UpdateHat(id, {
            description,
            category,
            credit,
            images,
            coverImage: parsedCoverImage,
            deletedImages
        })

        if (success) {
            setDescription(hat.description)
            setCategory(hat.category)
            setCredit(hat.credit)
            setOldImages(hat.images)
            setDeletedImages([])
            setImages([])
            setCoverImage()
            setPreviewCoverImage()
            setParsedCoverImage()

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

    const onCoverImageChange = file => {
        const url = URL.createObjectURL(file)
        setCoverImage(url)
    }

    const dataURLtoFile = (dataurl, filename) => {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    }

    const saveImage = image => {
        const file = dataURLtoFile(image, 'temp')
        setPreviewCoverImage(image)
        setParsedCoverImage(file)
    }

    return (
        <div className="add">
            <nav>
                <a onClick={() => history.push({ pathname: `/admin/edit-main-content` })}><span className="fas fa-edit"></span> Edit main content</a>
                <a onClick={() => history.push({ pathname: `/admin/view-all` })}><span className="fas fa-plus-circle"></span> View All</a>
            </nav>
            <form id="add-product-form" onSubmit={e => { e.preventDefault() }}>
                <label>
                    Description
                    <textarea onChange={_ => setDescription(_.target.value)} value={description} required></textarea>
                </label>
                <div className='descriptionPreview'>
                    <Markdown markup={description} />
                </div>
                <label>
                    Category
                    <input type="text" onChange={_ => setCategory(_.target.value)} value={category} required />
                </label>
                <label>
                    Credit
                    <span className="form-hint">
                        Comma seperated list of people/brands/artists you would like to give credit to.
                    </span>
                    <input type="text" onChange={_ => setCredit(_.target.value)} value={credit} />
                </label>

                <label>
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
                                <img src={`${config.BaseImageUrl}300/${images.path}`} />
                            </div>
                        ))}
                    </div>
                }

                <label>
                    Cover image
                    <input
                        className="no-border"
                        name="images"
                        type="file"
                        onChange={_ => onCoverImageChange(_.target.files[0])} />
                </label>
                {coverImage && <ImageEditorRc
                    src={coverImage}
                    className='image-cropper'
                    aspectRatio={243817 / 365067}
                    guides={true}
                    rotatable={true}
                    guides={false}
                    saveImage={saveImage}
                    responseType='blob/base64'
                />}
                {previewCoverImage && <div className="imageContainer">
                    <img className='previewCoverImage' src={previewCoverImage} />
                </div>}

                {isSuccessful === true && <div className="form-success"><p>Product upload was successful</p></div>}
                {isSuccessful === false && <div className="form-fail"><p>Product was not uploaded, please try again</p></div>}

                <button type="submit" disabled={isLoading} onClick={onFormSubmit}>
                    {isLoading ? <span className="fa fa-spinner fa-spin" /> : 'Save and continue'}
                </button>
            </form>
        </div>
    )
}

export default Add;