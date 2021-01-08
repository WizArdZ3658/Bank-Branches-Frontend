import "bootstrap/dist/css/bootstrap.min.css";
import $ from "jquery";
import Popper from "popper.js";
import "bootstrap/dist/js/bootstrap.bundle";
import React, { Component, Fragment } from "react";
import Modal from "react-bootstrap/Modal";
import Header from './Header';
import axios from 'axios';

class App extends Component {
    state = {
        currentPage: 1,
        perPage: 40,
        cityName : "Faridabad",
        bankRecords : {
            "Faridabad": [],
            "Delhi": [],
            "Kolkata": [],
            "Bangalore": [],
            "Mumbai": [],
            "Records": [],
        },
        address : "",
        district : "",
        state : "",
        ifsc : "",
        openModalBool : false
    };

    componentDidMount() {
        var city1 = this.state.cityName;
        var city = city1.toUpperCase();
        axios
            .get(`https://bankbranchfinder.herokuapp.com/api/branches?q=${city}&limit=5000&offset=0`)
            .then((res) => {
                var temp = this.state.bankRecords;
                temp[city1] = res.data;
                temp["Records"] = res.data;
                this.setState({
                    ...this.state,
                    bankRecords : temp
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    cityChangeHandler = (e) => {
        e.preventDefault();
        var cityName = e.target.value;
        var x = document.getElementById("searchbox");
        x.value = "";

        if (cityName !== this.state.cityName) {

            if (this.state.bankRecords[cityName].length === 0) {
                var city = cityName.toUpperCase();
                axios
                    .get(`https://bankbranchfinder.herokuapp.com/api/branches?q=${city}&limit=5000&offset=0`)
                    .then((res) => {
                        var temp = this.state.bankRecords;
                        temp[cityName] = res.data;
                        temp["Records"] = res.data;
                        this.setState({
                            ...this.state,
                            bankRecords : temp,
                            cityName : cityName,
                            currentPage : 1
                        })
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
            else {
                var temp = this.state.bankRecords;
                var temp2 = temp[cityName];
                temp["Records"] = temp2;
                this.setState({
                    ...this.state,
                    cityName : cityName,
                    bankRecords : temp,
                    currentPage : 1
                });
            }
        }
        
    }

    textChangeHandler = (e) => {
        e.preventDefault();
        var str = e.target.value;
        var re = new RegExp(str, 'ig');
        var city = this.state.cityName;

        var search_fields = ['ifsc', 'bank_id', 'branch', 'address', 'city', 'district', 'state'];
        var results = [];
        var data = this.state.bankRecords[city];
        for(var i in data){
            for(var u = 0; u < search_fields.length; u++){
                var val = data[i][search_fields[u]];
                if (re.test(val)) {
                    results.push(data[i]);
                    break;
                }
            }
        }

        var temp = this.state.bankRecords;
        temp.Records = results;
        this.setState({
            ...this.state,
            bankRecords : temp,
            currentPage : 1
        })
    }

    markFavourite = (e) => {
        e.preventDefault();
        if (e.target.innerHTML === "Favourite") {
            e.target.innerHTML = "Favourited";
            var ifsc = e.target.value;
            e.target.className = "btn btn-dark";
            localStorage.setItem(ifsc, 'T')
            var x = document.getElementById(ifsc);
            x.className = "green-bg";
        }
        else {
            e.target.innerHTML = "Favourite";
            e.target.className = "btn btn-primary";
            var ifsc = e.target.value;
            localStorage.removeItem(ifsc);
            var x = document.getElementById(ifsc);
            x.className = "";
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
        this.setState({
            ...this.state,
            perPage : parseInt(perPage),
            currentPage : 1
        });
    }

    openModal(bank){
        this.setState({
            ...this.state,
            address : bank.address,
            district : bank.district,
            state : bank.state,
            ifsc : bank.ifsc,
            openModalBool : true
        })
    }

    closeModal(){
        this.setState({
            ...this.state,
            address : "",
            district : "",
            state : "",
            ifsc : "",
            openModalBool : false
        })
    }

    render() {
        const { currentPage, perPage } = this.state;
        var bankRecords = this.state.bankRecords.Records;

        const indexOfLast = currentPage * perPage;
        const indexOfFirst = indexOfLast - perPage;
        const banks = bankRecords.slice(indexOfFirst, indexOfLast);

        const renderBanks = banks.map((bank) => (
            <tr key={bank.ifsc} id={bank.ifsc} className={localStorage.getItem(bank.ifsc)==='T' ? "green-bg" : ""}>
                <td>{bank.ifsc}</td>
                <td>{bank.branch}</td>
                <td>{bank.bank_id}</td>
                <td>{bank.city}</td>
                <td>
                    <button 
                        className="btn btn-primary"
                        key={bank.ifsc}
                        onClick={() => this.openModal(bank)}
                    >
                        Address
                    </button>
                </td>
                <td>
                    <button 
                        className={localStorage.getItem(bank.ifsc)==='T' ? "btn btn-dark" : "btn btn-primary"}
                        onClick={this.markFavourite}
                        value={bank.ifsc}
                    >
                        {localStorage.getItem(bank.ifsc)==='T' ? "Favourited" : "Favourite"}
                    </button>
                </td>
            </tr>
        ))

        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(bankRecords.length / perPage); i++) {
            pageNumbers.push(i);
        }
        const renderPageNumberButtons = pageNumbers.map(number => {
            return (
                <button
                    key={number}
                    id={number}
                    onClick={this.handlePages}
                    className="dropdown-item"
                >
                    {number}
                </button>
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
                                Page size {this.state.perPage}
                            </button>
                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton2">
                                <button className="dropdown-item" onClick={this.perPageHandler} value="20">20</button>
                                <button className="dropdown-item" onClick={this.perPageHandler} value="40">40</button>
                                <button className="dropdown-item" onClick={this.perPageHandler} value="80">80</button>
                            </div>
                        </div>
                        <div className="dropdown">
                            <input className="form-control" id="searchbox" placeholder="Search here" onChange={this.textChangeHandler}></input>
                        </div>
                    </div>

                    <br />
                    <br />

                    <div className="customBox2">
                        <div className="dropdown">
                            <button className="btn btn-warning dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Page no. {this.state.currentPage}
                            </button>
                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                {renderPageNumberButtons}
                            </div>
                        </div>
                    </div>

                    <br />
                    <br />

                    <div id="table-section">
                    <table className="table">
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

                    <div className="customBox2">
                        <div className="dropup">
                            <button className="btn btn-warning dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Page no. {this.state.currentPage}
                            </button>
                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                {renderPageNumberButtons}
                            </div>
                        </div>
                    </div>

                    <br />
                    <br />
                </div>
                    
                    
                </div>
                <Modal show={this.state.openModalBool} onHide={() => this.closeModal()}>
                    <Modal.Header closeButton onClick={() => this.closeModal()}>
                        <Modal.Title>IFSC : {this.state.ifsc}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Address : {this.state.address}</p>
                        <p>District : {this.state.district}</p>
                        <p>State : {this.state.state}</p>
                    </Modal.Body>
                </Modal>
            </Fragment>
        )
    }
}

export default App;