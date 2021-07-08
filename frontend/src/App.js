import React, { useContext } from 'react'
import HomePage from './components/HomePage'
import { ActiveSite } from './index'
import Container from 'react-bootstrap/Container'

let App= () => {

    const site=useContext(ActiveSite)

    return (
        // <Container fluid>
            <div className="App">
                <HomePage display={site} />
            </div>
        // </Container>
    )
}

export default App

