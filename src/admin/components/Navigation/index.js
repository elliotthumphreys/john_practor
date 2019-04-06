import React, { useState, Fragment } from 'react'

const Navigation = ({ onChange }) => {

    return <Fragment>
        <div className="navigationInputContainer">
            <label>
                Label
                <input />
            </label>
            <label>
                Slug
                <input />
            </label>
        </div>
    </Fragment>
}

export default Navigation