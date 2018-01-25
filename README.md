# CryptoBoard

Provides a simple user dashboard for monitoring the monetary state of multiple cryptocoins.

## Setup

The project consists of two parts. A VueJS frontend and a NodeJS backend. Both need to be running in order to access
the dashboard.

### Backend:
`yarn run server`

### Frontend (DevMode):
`yarn run serve`


### Demo
1. Update .env file in root to point to a valid postgres instance with correct credentials
2. Launch two terminals and run above commands
3. Browse too `http://localhost:8080` (if webpack doesnt auto open)
4. Login: demo@demo.com - demo123

From here you can add/remove investments. Investments are categoriesed
 by their coin and initial buy price, custom buy prices within a new investment 
 can be specified or take the current buy price from coin market cap.