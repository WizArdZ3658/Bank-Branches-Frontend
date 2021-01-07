import React, { Component, Fragment } from "react";
import Header from './Header';
import axios from 'axios';

class App extends Component {
    state = {
        currentPage: 1,
        perPage: 30,
        cityName : "Faridabad",
        bankRecords : []
    };

    componentDidMount() {
        var city = this.state.cityName;
        city = city.toUpperCase();
        axios
            .get(`https://bankbranchfinder.herokuapp.com/api/branches?q=${city}&limit=1500&offset=0`)
            .then((res) => {
                console.log(res.data);
                this.setState({
                    ...this.state,
                    bankRecords : res.data
                })
            })
            .catch((err) => {
                console.log(err);
            });
    }

    cityChangeHandler = (e) => {
        e.preventDefault();
        var cityName = e.target.value;
        console.log(cityName);

        if (cityName !== this.state.cityName) {
            console.log("reload bank records !");

            var city = cityName.toUpperCase();
            axios
                .get(`https://bankbranchfinder.herokuapp.com/api/branches?q=${city}&limit=1500&offset=0`)
                .then((res) => {
                    console.log(res.data);
                    this.setState({
                        ...this.state,
                        bankRecords : res.data,
                        cityName : cityName
                    })
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        
    }

    handlePages = (e) => {
        this.setState({
            ...this.state,
            currentPage : Number(e.target.id)
        })
    }

    perPageHandler = (e) => {
        e.preventDefault();
        var perPage = e.target.value;
        // console.log(perPage);
        this.setState({
            ...this.state,
            perPage : parseInt(perPage)
        });
    }

    render() {
        const { bankRecords, currentPage, perPage } = this.state;

        const indexOfLast = currentPage * perPage;
        const indexOfFirst = indexOfLast - perPage;
        const banks = bankRecords.slice(indexOfFirst, indexOfLast);

        const renderBanks = banks.map((bank) => (
            <tr key={bank.ifsc}>
                <td>{bank.ifsc}</td>
                <td>{bank.branch}</td>
                <td>{bank.bank_id}</td>
                <td>{bank.city}</td>
                <td>
                    <button className="btn btn-primary">
                        Address
                    </button>
                </td>
                <td>
                    <button className="btn btn-primary">
                        Favourite
                    </button>
                </td>
            </tr>
        ))

        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(bankRecords.length / perPage); i++) {
            pageNumbers.push(i);
        }

        const renderPageNumbers = pageNumbers.map(number => {
            return (
                <li
                    key={number}
                    id={number}
                    onClick={this.handlePages}
                    className="page-item page-link"
                >
                    {number}
                </li>
            );
        });

        return (
            <Fragment>
                <Header />
                <div className="container">

                    <br />
                    <br />

                    <div className="customBox1">
                        <div className="dropdown">
                            <button className="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {this.state.cityName}
                            </button>
                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <button className="dropdown-item" onClick={this.cityChangeHandler} value="Faridabad">Faridabad</button>
                                <button className="dropdown-item" onClick={this.cityChangeHandler} value="Delhi">Delhi</button>
                                <button className="dropdown-item" onClick={this.cityChangeHandler} value="Kolkata">Kolkata</button>
                                <button className="dropdown-item" onClick={this.cityChangeHandler} value="Bangalore">Bangalore</button>
                                <button className="dropdown-item" onClick={this.cityChangeHandler} value="Mumbai">Mumbai</button>
                            </div>
                        </div>
                        <div className="dropdown">
                            <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {this.state.perPage}
                            </button>
                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton2">
                                <button className="dropdown-item" onClick={this.perPageHandler} value="30">30</button>
                                <button className="dropdown-item" onClick={this.perPageHandler} value="60">60</button>
                                <button className="dropdown-item" onClick={this.perPageHandler} value="90">90</button>
                            </div>
                        </div>
                        <div className="dropdown">
                            <input className="form-control" id="searchbox" placeholder="Search here"></input>
                        </div>
                    </div>

                    <br />
                    <br />
                    <ul id="page-numbers" className="pagination justify-content-center">
                        {renderPageNumbers}
                    </ul>

                    <br />
                    <br />

                    <div id="table-section">
                    <table className="table table-striped">
                        <thead className="thead-dark">
                            <tr>
                                <th scope="col">IFSC</th>
                                <th scope="col">Branch</th>
                                <th scope="col">Bank ID</th>
                                <th scope="col">City</th>
                                <th scope="col">Show Address</th>
                                <th scope="col">Mark Favourite</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderBanks}
                        </tbody>
                    </table>
                    <br />
                    <ul id="page-numbers" className="pagination justify-content-center">
                        {renderPageNumbers}
                    </ul>
                </div>
                    
                    
                </div>
                
            </Fragment>
        )
    }
}

export default App;