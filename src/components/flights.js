import {Component} from "react";
import React from "react";
import FileSaver from 'file-saver';
import moment from 'moment';

class Flights extends Component {
    constructor(props) {
        super(props);
        this.state = {flights: [], cities: [], code: '', from: '', to: '', departureDate: ''};
        this.handleCodeChange = this.handleCodeChange.bind(this);
        this.searchByCode = this.searchByCode.bind(this);
        this.buyTicket = this.buyTicket.bind(this);
        this.getConfirmation = this.getConfirmation.bind(this);
        this.filterFlights = this.filterFlights.bind(this);
        this.handleFromChange = this.handleFromChange.bind(this);
        this.handleToChange = this.handleToChange.bind(this);
        this.handleDepartureDateChange = this.handleDepartureDateChange.bind(this);
    }

    componentDidMount() {
        fetch('https://localhost:8443/flights')
            .then(result => result.json())
            .then(data => this.setState({flights: data}));

        fetch('https://localhost:8443/cities')
            .then(result => result.json())
            .then(data => this.setState({cities: data}));
    }

    handleCodeChange = (e) => {
        this.setState({code: e.target.value});
    };

    handleFromChange = (e) => {
        this.setState({from: e.target.value});
    };

    handleToChange = (e) => {
        this.setState({to: e.target.value});
    };

    handleDepartureDateChange = (e) => {
        this.setState({departureDate: e.target.value});
    };

    searchByCode(e) {
        e.preventDefault();
        fetch('https://localhost:8443/tickets?code=' + this.state.code)
            .then(result => result.json())
            .then(data => alert(
                "Twój kod biletu: " + data.code + "\n"
                + "Pasażer: " + data.passenger.firstName + ' ' + data.passenger.lastName + "\n"
                + "Lot z: " + data.flight.from.name + "\n"
                + "Lot do: " + data.flight.to.name + "\n"
                + "Data odlotu: " + data.flight.departureDate + "\n"
                + "Godzina odlotu: " + data.flight.departureHour + "\n"
            ))
            .catch(error => alert(error));
    }

    buyTicket(e, id) {
        e.preventDefault();
        fetch('https://localhost:8443/flights/bookFlight/' + id)
            .then(result => result.text())
            .then(data => alert("Twoj kod biletu: " + data))
            .catch(error => alert(error));
    }

    getConfirmation(e) {
        e.preventDefault();
        fetch('https://localhost:8443/tickets/confirmation?code=' + this.state.code)
            .then(response => response.blob())
            .then(data => FileSaver.saveAs(data, "potwierdzenie.pdf"))
            .catch(error => alert(error));
    }

    filterFlights(e) {
        e.preventDefault();
        let url;
        if(this.state.departureDate === '') {
            url = 'https://localhost:8443/flights/byCities?from=' + this.state.from + '&to=' + this.state.to
        } else {
            url = 'https://localhost:8443/flights/byCitiesAndDate?from=' + this.state.from + '&to=' + this.state.to + '&departure=' + moment(this.state.departureDate).toISOString();
        }
        fetch(url)
            .then(response => response.json())
            .then(data => this.setState({flights: data}));
    }

    render() {
        return (
            <div className={"container"}>
                <div className="clearfix">&nbsp;</div>
                <div className="clearfix">&nbsp;</div>

                {/*WYSZUKIWARKA*/}
                <form className={"form-inline"}>
                    <h5>Wyszukaj lot:</h5>
                    <div className={"col"}>
                        <span>Z:&nbsp;</span>
                        <select className={"custom-select form-control"} onChange={this.handleFromChange} value={this.state.from}>
                            {
                                this.state.cities.map(city => {
                                    return <option value={city.name} key={city.id}>{city.name}</option>
                                })
                            }
                        </select>
                    </div>
                    <div className={"col"}>
                        <span>Do:&nbsp;</span>
                        <select className={"custom-select form-control"} onChange={this.handleToChange} value={this.state.to}>
                            {
                                this.state.cities.map(city => {
                                    return <option value={city.name} key={city.id}>{city.name}</option>
                                })
                            }
                        </select>
                    </div>
                    <div className={"col"}>
                        <span>Data:&nbsp;</span>
                        <input className={"form-control required"} type={"datetime-local"} required={true} onChange={this.handleDepartureDateChange} value={this.state.departureDate}/>
                    </div>
                    <button type={"submit"} className={"btn btn-primary"} onClick={this.filterFlights}>Szukaj</button>
                </form>

                <div className="clearfix">&nbsp;</div>
                <div className="clearfix">&nbsp;</div>

                {/*szukajka po kodzie*/}
                <form className={"form-inline"}>
                    <h5>Wpisz swój kod biletu:</h5>
                    <div className={"col"}>
                        <span>Kod:&nbsp;</span>
                        <input className={"form-control required"} type={"text"} required={true} value={this.state.code}
                               onChange={this.handleCodeChange}/>
                    </div>
                    <button type={"submit"} className={"btn btn-primary"} onClick={this.searchByCode}>Szukaj</button>
                </form>

                <div className="clearfix">&nbsp;</div>
                <div className="clearfix">&nbsp;</div>

                {/*pobieraczka*/}
                <form className={"form-inline"}>
                    <h5>Pobierz potwierdzenie po kodzie biletu:</h5>
                    <div className={"col"}>
                        <span>Kod:&nbsp;</span>
                        <input className={"form-control required"} type={"text"} required={true} value={this.state.code}
                               onChange={this.handleCodeChange}/>
                    </div>
                    <button type={"submit"} className={"btn btn-primary"} onClick={this.getConfirmation}>Pobierz</button>
                </form>

                <div className="clearfix">&nbsp;</div>
                <div className="clearfix">&nbsp;</div>

                {/*LISTA LOTOW*/}
                <table className="table table-hover">
                    <thead>
                    <tr>
                        <th>Z</th>
                        <th>Do</th>
                        <th>Data</th>
                        <th>Godzina</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.flights.map((row, i) =>
                        <tr key={i}>
                            <td>{row.from.name}</td>
                            <td>{row.to.name}</td>
                            <td>{row.departureDate}</td>
                            <td>{row.departureHour}</td>
                            <td>
                                <button className={"btn btn-primary"} onClick={e => this.buyTicket(e, row.id)}>Kup bilet</button>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default Flights;