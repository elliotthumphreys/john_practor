import React, { useEffect, useState } from 'react'
import { GetHats, DeleteHat, CheckTokenAuthentication } from '../../util'

const ViewAll = ({ history }) => {
    const [ hats, setHats ] = useState([])

    const checkAuthentication = async () => {
        const { authenticated } = await CheckTokenAuthentication()

        if (!authenticated) {
            history.push({ pathname: '/admin/login' })
        }
    }

    const getHats = async () => {
        const response = await GetHats()

        setHats(response.hats)
    }

    const deleteHat = async id => {
        let { response } = await DeleteHat(id)

        if (response === 'success') {
            setHats(hats.map(hat => {
                if(hat._id === id){
                    hat.className = 'removed'
                }
                return hat
            }))
        }
    }

    useEffect(() => {
        checkAuthentication()
        getHats()
    }, []);

    return (
        <div className="viewAll">
            <nav>
                <a onClick={() => history.push({ pathname: `/admin/edit-main-content` })}><span className="fas fa-edit"></span> Edit main content</a>
                <a onClick={() => history.push({ pathname: `/admin/add` })}><span className="fas fa-plus-circle"></span> Add</a>
            </nav>
            <section>
                {hats.map(hat => {
                    const date = new Date(hat.dateCreated)
                    const displayDate = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`

                    return <div key={hat._id} className={hat.className}>
                        {hat.className === 'removed' && <span class="fas fa-window-close"></span>}
                        <h3>{hat.title.slice(0, 30)}</h3>
                        <div>
                            <button onClick={() => deleteHat(hat._id)}>Delete</button>
                            <button onClick={() => history.push({ pathname: `/admin/update/${hat._id}` })}>Update</button>
                        </div>
                        <p>£{hat.price}</p>
                        <p>{hat.category}</p>
                        <p>{hat.credit}</p>
                        <p>{displayDate}</p>
                        <div>
                            {hat.images.map((image, key) => <img key={key} src={`http://localhost:4000/images/${image.path}`} rel={image.description} />)}
                        </div>
                    </div>
                }
                )}
            </section>
        </div>
    )
}

export default ViewAll;