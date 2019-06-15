import React, { useState, useEffect, Fragment } from 'react'
import { GetContent, UpdateContent } from '../../util'
import { Markdown } from 'react-showdown'
import Navigation from '../Navigation'
import config from '../../../config.json'

const UpdateContentComponent = ({ history }) => {
    const [editableContent, setEditableContent] = useState([])
    const [currentContent, setCurrentContent] = useState()

    const [isSuccessful, setIsSuccessful] = useState()
    const [isLoading, setIsLoading] = useState(false)

    const getContent = async () => {
        const result = await GetContent()

        console.log(result)

        if (result.authenticated) {
            setEditableContent(result.content)
            setCurrentContent(result.content.find(_ => _.slug === "home"))
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

        const { success, data } = await UpdateContent(currentContent)

        if (success) {
            setCurrentContent(data)

            //image upload has uncontrolled upload so have to do this to reset it
            document.getElementById("add-product-form").reset();
        }

        setIsSuccessful(success)

        setIsLoading(false)
    }

    const onChange = (index, value) => {
        let content = { ...currentContent }
        content.data[index].value = value

        setCurrentContent(content)
        setIsSuccessful(undefined)
    }

    const onImageChange = (index, file) => {
        let content = { ...currentContent }

        content.data[index].file = file;

        setCurrentContent(content)

        setIsSuccessful(undefined)
    }

    return (
        <div className="add">
            <nav>
                <a onClick={() => history.push({ pathname: `/admin/add` })}><span className="fas fa-edit"></span> Add</a>
                <a onClick={() => history.push({ pathname: `/admin/view-all` })}><span className="fas fa-plus-circle"></span> View All</a>

                <div className="page-navigation">
                    {editableContent.map((_, key) => {
                        const className =
                            currentContent && (
                                (_.type === 'navigation' && currentContent.type === 'navigation') ||
                                (_.type === 'social' && currentContent.type === 'social') ||
                                (_.slug && _.slug === currentContent.slug)
                            ) ? 'active' : '';
                        const displayText =
                            _.name ?
                                _.name.charAt(0).toUpperCase() + _.name.slice(1) :
                                _.type.charAt(0).toUpperCase() + _.type.slice(1)

                        return <a key={key}
                            href='#'
                            onClick={() => setCurrentContent(_)}
                            className={className}>{displayText}</a>
                    })}
                </div>
            </nav>
            <form id="add-product-form" onSubmit={onFormSubmit}>

                {currentContent &&
                    currentContent.type === 'navigation' &&
                    <Navigation navOptions={currentContent.data} onChange={newValue => {
                        let contentCopy = Object.assign({}, currentContent)
                        contentCopy.data = newValue
                        setCurrentContent(contentCopy)
                        setIsSuccessful(undefined)
                    }} />}

                {currentContent &&
                    currentContent.type !== 'navigation' &&
                    currentContent.data.map(({ type, name, value }, index) => {
                        const currentContentValue = currentContent.data[index].value;
                        switch (type) {
                            case 'text':
                                return <label>
                                    {name.replace(/\b\w/g, letter => letter.toUpperCase())}
                                    <input type="text" onChange={event => onChange(index, event.target.value)} value={currentContentValue} />
                                </label>
                            case 'textarea':
                                return <Fragment>
                                    <label className='low-margin'>
                                        {name.replace(/\b\w/g, letter => letter.toUpperCase())}
                                        <textarea onChange={event => onChange(index, event.target.value)} value={currentContentValue} />
                                    </label>

                                    <div className='descriptionPreview'>
                                        <Markdown markup={currentContentValue} />
                                    </div>
                                </Fragment>
                            case 'image':
                                return <Fragment>
                                    <label className='low-margin'>
                                        {name.replace('Image', '').replace(/\b\w/g, letter => letter.toUpperCase())}
                                        <input className="no-border" type="file" onChange={_ =>
                                            onImageChange(index, _.target.files[0])
                                        } />
                                    </label>
                                    <div className='imageContainer'>
                                        <div className='image'>
                                            <img src={`${config.BaseImageUrl}300/${value}`} />
                                        </div>
                                    </div>
                                </Fragment>
                            default:
                                return
                        }
                    })
                }

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
