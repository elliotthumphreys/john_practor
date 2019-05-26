import React, { useContext } from 'react'
import Footer from '../Footer'
import { SmallHeader as Header } from '../Header'
import { Markdown } from 'react-showdown'
import { ContentContext } from '../Context'
import { BaseImageUrl } from '../../../config.json'

const Generic = ({ match: { path } }) => {
    const { [path.replace('/', '')] : content } = useContext(ContentContext)
    
    return <section className='generic-page'>
        <Header currentPageSlug={path}/>
        <div className="titleContiner">
            <h2><span>{content.title}</span></h2>
        </div>
        <div className="body">
            {content.coverImage && 
                <img className='cover' src={`${BaseImageUrl}${content.coverImage}`} />}
            <Markdown markup={content.body} />
        </div>
        <Footer />
    </section>
}

export default Generic