import React, { useContext } from 'react'
import Footer from '../Footer'
import { SmallHeader as Header } from '../Header'
import { Markdown } from 'react-showdown'
import { ContentContext } from '../Context'

const Generic = ({ match: { path } }) => {
    const { [path.replace('/', '')]: content } = useContext(ContentContext)

    return <section className='generic-page'>
        <Header currentPageSlug={path}/>
        <div className="titleContiner">
            <h2><span>{content.title[0]}</span></h2>
        </div>
        <div className="body">
            <Markdown markup={content.body[0]} />
        </div>
        <Footer />
    </section>
}

export default Generic