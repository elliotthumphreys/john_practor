import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

const Masonry = ({ children, configuration: { gap, columnOptions, className } }) => {
    const [column, setColumn] = useState()

    const Masonry = styled.section`
        display: flex;
        flex-direction: row;
        margin: auto;
        max-width: 1200px;
        width: 100%;
    `

    const setNumberOfColumns = () => {
        let columns = columnOptions.filter(_ => window.innerWidth > _.window)[0].columns

        setColumn(columns)
    }

    useEffect(() => {
        window.addEventListener("resize", setNumberOfColumns)
        setNumberOfColumns()
    })

    let arrays = []
    for (let i = 0; i < column; i++) {
        arrays = [...arrays, []]
    }

    let count = 0;
    children.forEach((child, index) => {
        const Item = styled.div`
            padding-top: ${arrays[count].length === 0 ? '0em' : gap};
            padding-bottom: ${gap};
        `

        arrays[count] = [...arrays[count], <Item key={index}>{child}</Item>]

        count === arrays.length - 1 ? count = 0 : count++
    });
    
    return (
        <Masonry className={className}>
            {arrays.map((children, index) => {
                const Column = styled.div`
                    margin-left: ${index == 0 ? '0em' : gap};
                    margin-right: ${index == arrays.length - 1 ? '0em' : gap};
                    width: ${100 / column}%
                `

                return <Column key={index}>{children}</Column>
            })}
        </Masonry>
    )
}

export default Masonry