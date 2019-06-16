import React, { useContext } from 'react'
import { Markdown } from 'react-showdown'
import { ContentContext } from '../../components/Context'

const MarkdownWrapper = ({ markup }) => {
    const { home: { ['header-top']: headerTop, ['header-bottom']: headerBottom } } = useContext(ContentContext)

    const CUSTOM_HEADER_JSX = `<section class="custom-inline-header">
            <header>
                <h1>
                    <span>${headerTop}</span>
                    <span>${headerBottom.split('').join(' ')}</span>
                </h1>
            </header>
        </section>`

    const parsedContent = markup.replace(/@custom-header@/, CUSTOM_HEADER_JSX)

    return <Markdown markup={parsedContent} />
}

export default MarkdownWrapper