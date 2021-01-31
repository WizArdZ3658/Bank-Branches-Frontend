# Bank Branches Frontend
A Front-End Web Application for searching information on banks in cities. This application fetches data from APIs, you can read more about the APIs [here](https://github.com/WizArdZ3658/Bank-Branches-Backend).

The website is deployed at Heroku, click [here](https://bankbranchesindia.herokuapp.com/) to view.

## Features
 * User is be able to search by text for the banks, across all the fields.
 * As user types in the search area, the table gets dynamically filtered (client-side filtering).
 * The app lists and searches for banks that are fetched from the APIs. Read [here](https://github.com/WizArdZ3658/Bank-Branches-Backend).
 * Bank search screen which would show a list of banks along with IFSC, Branch, Bank ID and City.
 * There is no search button.
 * The search results are paginated, the user can select the page size.
 * User can mark banks as favourites. The row color will turn green and the button will turn black.
 * Banks that were marked as favourites will persist state even if the website is refreshed or reloaded.
 * API calls are cached and will be called only when data for that particular city is not available.
 * There is a dropdown for cities (5 cities :- Faridabad, Delhi, Kolkata, Mumbai, Bangalore) and there is a search bar.
 * To get more details of the bank simply click on "Address", a modal will popup which will show all the remaining location details.

## Hosting
The website is hosted on [Heroku](https://www.heroku.com/home).

## Technology Stack
##### Languages :-
HTML, CSS, Javascript

##### Frameworks, Libraries and Tools:-
React, Axios, Webpack, Babel, Heroku, Bootstrap, VSCode, [Bank Branch API](https://github.com/WizArdZ3658/Bank-Branches-Backend), Git

##### Environment:-
Windows(my PC), Linux(Deployment server)
