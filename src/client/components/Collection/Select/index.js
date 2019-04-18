import React, { useState } from 'react'

const Select = ({ options, setCategory }) => {
    const [selected, setSelected] = useState(options[0])

    const [clickedP, setClickedP] = useState(false)

    const onChange = (option) => {
        setSelected(option)
        setCategory(option)
        setClickedP(!clickedP)
    }

    return <section className="filter">
        <a onClick={_ => setClickedP(!clickedP)}><span class="fas fa-filter" /><span>{selected}</span></a>
        <ul className={clickedP ? 'show' : 'hide'}>
            {options.filter(option => option !== selected).map(option =>
                <li onClick={_ => onChange(option)}>{option}</li>)}
        </ul>
    </section>

}

export default Select