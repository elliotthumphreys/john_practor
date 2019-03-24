import React, { useState, useEffect, Fragment } from 'react'
import { GetContent, UpdateMainContent } from '../../util'

const UpdateContent = ({ history }) => {
    const [header, setHeader] = useState()
    const [oldImages, setOldImages] = useState([])
    const [images, setNewImages] = useState({})

    const [isSuccessful, setIsSuccessful] = useState()
    const [isLoading, setIsLoading] = useState(false)

    const getContent = async () => {
        const result = await GetContent()

        if (result.authenticated) {
            setHeader(result.content[0].data.header)
            setOldImages(result.content[0].data.images)
        } else {
            history.push({ pathname: '/admin/login' })
        }
    }

    const onFormSubmit = async event => {
        event.preventDefault()

        setIsLoading(true)

        const { success, data } = await UpdateMainContent({
            header,
            images
        })

        if (success) {
            setHeader(data.header)
            setOldImages(data.images)
            setNewImages({})

            //images is an uncontrolled input so have to do this to reset its fields
            document.getElementById("add-product-form").reset();
        }

        setIsSuccessful(success)

        setIsLoading(false)
    }

    useEffect(() => {
        getContent()
    }, [])
    
    return (
        <div className="add">
            <nav>
                <a onClick={() => history.push({ pathname: `/admin/add` })}><span className="fas fa-edit"></span> Add</a>
                <a onClick={() => history.push({ pathname: `/admin/view-all` })}><span className="fas fa-plus-circle"></span> View All</a>
            </nav>
            <form id="add-product-form" onSubmit={onFormSubmit}>
                <label>
                    Main Heading
                    <input type="text" onChange={_ => setHeader(_.target.value)} value={header} />
                </label>

                {oldImages.map((image, index) =>
                    <Fragment key={index}>
                        <label>
                            {image.id.replace('Image', '').replace(/\b\w/g, l => l.toUpperCase())}
                            <input className="no-border" type="file" onChange={_ => {
                                setNewImages({ ...images, [image.id]: _.target.files[0] })
                            }} />
                        </label>

                        {!images.hasOwnProperty(image.id) &&
                            <div className='imageContainer'>
                                <div className='image'>
                                    <img src={`http://localhost:4000/images/${image.path}`} />
                                </div>
                            </div>}
                    </Fragment>
                )}

                {isSuccessful === true && <div className="form-success"><p>Content was updated successfully</p></div>}
                {isSuccessful === false && <div className="form-fail"><p>Content was not updated, please try again</p></div>}

                <button type="submit" disabled={isLoading}>
                    {isLoading ? <span className="fa fa-spinner fa-spin" /> : 'Save and continue'}
                </button>
            </form>
        </div>
    )
}

export default UpdateContent