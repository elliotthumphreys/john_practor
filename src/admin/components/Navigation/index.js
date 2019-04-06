import React, { useState, Fragment, useEffect } from 'react'

const Navigation = ({ navOptions }) => {
    const [initNavOptions] = useState(navOptions)

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

    const getNavJSX = (options) => options.map((option, key) => navJSX(key, option.name, option.slug))

    const [nav, setNav] = useState(getNavJSX(initNavOptions))

    useEffect(
        () => {
            if (navOptions !== initNavOptions) {
                setNav(getNavJSX(navOptions))
            }
        }, [navOptions]
    )

    return <section className="navContianer">
        <label>
            Navigation
        </label>
        {nav}
        <button className="add-more" onClick={() => setNav([...nav, navJSX(nav.length - 1)])} >Add more<span className="fas fa-plus-circle" /></button>
    </section>
}

export default Navigation