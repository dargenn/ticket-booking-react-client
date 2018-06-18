import React, {Component} from 'react';
import './App.css';
import Flights from './components/flights';
import Cities from './components/cities';

class App extends Component {
    render() {
        return (
            <div className={"App"}>
                <div className={"jumbotron"}>
                    <h1><a href={"http://localhost:3000"}> Ticket Booking Application</a></h1>
                </div>
                <Cities/>
                <Flights/>
            </div>
        );
    }
}

export default App;
