# ODE Integration Playground
Web tool for solving 2nd order ODEs. Calculates, in parallel numerical, solutions to multiple IVPs at once, allowing the user to vary both the initial conditions, as well as the method and parameters of numerical integration. Since the backend is a lambda, these IVPs can be solved simultaneously. [(web demo)](https://ode.tarinyoom.io/)

## Repository Structure

### Backend
AWS lambda backend, written in Rust. Backend takes in a single IVP and returns a numerical solution to that IVP.

### Frontend
React website using create-react-app. The website features an interface where the user can specify their IVPs, and then plays an animation based on their solutions. This animation is accompanied by sound, dynamically generated based on the solved trajectories.

### Open Tasks
- (bug) animations for trajectories calculated with different time steps are not correctly synchronized, since each animation is played independently.
