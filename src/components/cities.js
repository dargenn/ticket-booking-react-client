import {Component} from "react";
import React from "react";

class Cities extends Component {
    constructor(props) {
        super(props);
        this.state = {cities: []};
    }

    componentDidMount() {
        fetch('https://localhost:8443/cities')
            .then(result => result.json())
            .then(data => this.setState({cities: data}));
    }

    render() {
        return (
            <div>
                <h3>Loty z miast: <span className="badge badge-primary">10</span></h3>
                <ul className={"list-inline"}>
                    {this.state.cities.map(city => <li className={"list-inline-item"} key={city.id}>{city.name}</li>)}
                </ul>
            </div>
        );
    }
}

export default Cities;