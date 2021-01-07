import React, { Component } from "react";

class Header extends Component {
    render() {
        return (
            <header>
                <nav className="navbar navbar-dark bg-dark">
                    <div className="container-fluid">
                        <span className="navbar-brand mb-0 h1">Bank Branches</span>
                    </div>
                </nav>
            </header>
        )
    }
}

export default Header;