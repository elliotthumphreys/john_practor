import React, { useState, useEffect, Fragment } from 'react'
import { GetContent, UpdateContent } from '../../util'
import { Markdown } from 'react-showdown'
import Navigation from '../Navigation'

const UpdateContentComponent = ({ history }) => {
    const [navigation, setNavigation] = useState()
    const [page, setPage] = useState()
    const [pages, setPages] = useState([])
    const [images, setImages] = useState({})

    const [isSuccessful, setIsSuccessful] = useState()
    const [isLoading, setIsLoading] = useState(false)

    const getContent = async () => {
        const result = await GetContent()

        if (result.authenticated) {
            setPages(result.content[0].data.pages)
            setPage(result.content[0].data.pages.find(_ => _.name === 'Home'))
            setNavigation(result.content[0].data.navigation)
        } else {
            history.push({ pathname: '/admin/login' })
        }
    }

    useEffect(() => {
        getContent()
    }, [])

    const onFormSubmit = async event => {
        event.preventDefault()

        setIsLoading(true)

        // Create form multipart data start
        const formData = new FormData();

        formData.append('slug', page.slug)

        for (let key in page.data) {
            if (key !== 'images') {
                formData.append(key, page.data[key][0])
            }
        }

        for (let key in images) {
            formData.append(key, images[key])
        }

        formData.append('navigation', JSON.stringify(navigation))
        // Create form multipart data end

        const { success, data } = await UpdateContent(formData)

        if (success) {
            setPages(data.pages)
            setPage(data.pages.find(_ => page.slug === _.slug))
            setImages([])

            //images is an uncontrolled input so have to do this to reset its fields
            document.getElementById("add-product-form").reset();
        }

        setIsSuccessful(success)

        setIsLoading(false)
    }

    const onChange = (name, value) => {
        let pageCopy = { ...page }
        pageCopy.data[name][0] = value
        setPage(pageCopy)
        setIsSuccessful(undefined)
    }

    return (
        <div className="add">
            <nav>
                <a onClick={() => history.push({ pathname: `/admin/add` })}><span className="fas fa-edit"></span> Add</a>
                <a onClick={() => history.push({ pathname: `/admin/view-all` })}><span className="fas fa-plus-circle"></span> View All</a>

                <div className="page-navigation">
                    {pages.map((_, key) => <a key={key} href='#' onClick={() => setPage(_)} className={page && _.slug === page.slug ? 'active' : ''} >{_.name}</a>)}
                </div>
            </nav>
            <form id="add-product-form" onSubmit={onFormSubmit}>
                {page && page.name == 'Home' && navigation && <Navigation navOptions={navigation} onChange={newValue => {
                    setNavigation(newValue)
                    setIsSuccessful(undefined)
                }} />}
                {page &&
                    Object.keys(page.data).map(_ => {
                        if (_ === 'images') {
                            return page.data.images.map((image, index) => <Fragment key={index}>
                                <label className='low-margin'>
                                    {image.id.replace('Image', '').replace(/\b\w/g, l => l.toUpperCase())}
                                    <input className="no-border" type="file" onChange={_ => {
                                        setImages({ ...images, [image.id]: _.target.files[0] })
                                    }} />
                                </label>

                                {!images.hasOwnProperty(image.id) &&
                                    <div className='imageContainer'>
                                        <div className='image'>
                                            <img src={`http://localhost:4000/images/${image.path}`} />
                                        </div>
                                    </div>}
                            </Fragment>)
                        } else {
                            switch (page.data[_][1]) {
                                case 'text':
                                    return <label>
                                        {_.replace(/\b\w/g, l => l.toUpperCase())}
                                        <input type="text" onChange={event => onChange(_, event.target.value)} value={page.data[_][0]} />
                                    </label>
                                case 'textarea':
                                    return <Fragment>
                                        <label className='low-margin'>
                                            {_.replace(/\b\w/g, l => l.toUpperCase())}
                                            <textarea value={page.data[_][0]} onChange={event => onChange(_, event.target.value)} value={page.data[_][0]} />
                                        </label>

                                        <div className='descriptionPreview'>
                                            <Markdown markup={page.data[_][0]} />
                                        </div>
                                    </Fragment>
                            }

                        }
                    })}

                {isSuccessful === true && <div className="form-success"><p>Content was updated successfully</p></div>}
                {isSuccessful === false && <div className="form-fail"><p>Content was not updated, please try again</p></div>}

                <button type="submit" disabled={isLoading}>
                    {isLoading ? <span className="fa fa-spinner fa-spin" /> : 'Save and continue'}
                </button>
            </form>
        </div>
    )
}

export default UpdateContentComponent
