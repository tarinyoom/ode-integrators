# ODE Integration Playground
Interactive web tool for solving ODEs.

## Repository Structure
### Frontend
React website using create-react-app. The website features an interface where the user can specify their IVP, and displays the calculated solution in the browser.

### Backend
AWS lambda backend, written in TypeScript. Backend takes in a query from the front end, makes appropriate parallel calls to the backend, and composes the results into an svg image to be returned to the frontend. 

### Integrator
Helper AWS lambda service written in Rust. The integrator takes in an IVP problem and returns the corresponding solution sequence.
