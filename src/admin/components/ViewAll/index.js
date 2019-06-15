import React, { useEffect, useState } from 'react'
import { GetHats, DeleteHat, CheckTokenAuthentication } from '../../util'

import { BaseImageUrl } from '../../../config.json'

const ViewAll = ({ history }) => {
    const [hats, setHats] = useState([])

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
            setHats(hats.filter(hat => hat._id !== id))
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

                    return <div key={hat._id}>
                        <h3>{displayDate}</h3>
                        <div>
                            <button onClick={() => deleteHat(hat._id)}>Delete</button>
                            <button onClick={() => history.push({ pathname: `/admin/update/${hat._id}` })}>Update</button>
                        </div>
                        <img src={`${BaseImageUrl}300/${hat.coverImage}`} />
                    </div>
                }
                )}
            </section>
        </div>
    )
}

export default ViewAll;