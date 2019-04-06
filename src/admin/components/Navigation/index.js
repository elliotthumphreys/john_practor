import React, { useState, useEffect } from 'react'

const Navigation = ({ navOptions }) => {
    const [navJSON, setNavJSON] = useState(navOptions)

    const navJSX = (key, label, slug) => <div className="nav" key={key}>
        <label>
            Label
            <input type="text" value={label}/>
        </label>
        <label>
            Slug
            <input type="text" value={slug}/>
        </label>
    </div>

    const [nav, setNav] = useState(navOptions.map((option, key) => navJSX(key, option.name, option.slug)))

    return <section className="navContianer">
        <label>
            Navigation
        </label>
        {nav}
        <button className="add-more" onClick={() => {
            setNav([...nav, navJSX(nav.length)])
            setNavJSON([...navJSON, {
                name: '',
                slug: ''
            }])
            }} >Add more <span className="fas fa-plus-circle" /></button>
    </section>
}

export default Navigation