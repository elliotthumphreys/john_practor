import React, { useState } from 'react'

const Navigation = ({ navOptions, onChange }) => {
    const [navJSON, setNavJSON] = useState(navOptions)

    const onInputChange = (link, key) => {
        setNavJSON([...navJSON.slice(0, key), link, ...navJSON.slice(key + 1)])
        onChange(navJSON)
    }

    const deleteLink = key => {
        setNavJSON([...navJSON.slice(0, key), ...navJSON.slice(key + 1)])
    }

    const navJSX = (link, key) =>
        <div className="nav" key={key}>
            <label>
                Label
                <input value={link.name} onChange={event => onInputChange({ ...link, name: event.target.value }, key)} />
            </label>
            <label>
                Slug
                <input value={link.slug} onChange={event => onInputChange({ ...link, slug: event.target.value }, key)} />
            </label>
            <span className="fas fa-times" onClick={() => deleteLink(key)} />
        </div>

    return <section className="navContianer">
        <label>Navigation</label>
        {
            navJSON.map((link, key) => navJSX(link, key))
        }
        <button className="add-more" onClick={() => {
            setNavJSON([...navJSON, {
                name: '',
                slug: ''
            }])
        }} >Add more</button>
    </section>
}

export default Navigation