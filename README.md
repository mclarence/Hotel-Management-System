# Hotel Management System
*UTS - 41026 - Advanced Software Development Project*

## Description
This application is a hotel management system that allows hotels to easily manage guests and rooms on their establishment.

## Development Setup
### Prerequisites
- NodeJS >= 20
- Postgres DB

### Setup

#### Start Postgres Docker Container
```shell
docker run \
--name some-postgres \
--rm \
-e POSTGRES_PASSWORD=mysecretpassword \
-e POSTGRES_DB=ads-db \
-p 127.0.0.1:5432:5432 \
postgres \
-c 'log_statement=all'
```

#### Create configuration file for backend.
This file is to be located at 

* (Linux) ~/.config/hotel-management-system-backend/server-config.json
* (Windows) C:/Users/<username\>/.config/hotel-management-system-backend/server-config.json

```json
{
  "server": {
    "port": 80
  },
  "database": {
      "host": "127.0.0.1",
      "port": 5432,
      "database": "ads-db",
      "user": "postgres",
      "password": "mysecretpassword"
  },
  "jwt": {
    "secret": "supersecretkey
  }
}
```

#### Start Project
```shell
git clone https://github.com/mclarence/41026-ASD-Project
cd 41026-ASD-Project
npm install
npx nx run-many --targets=serve --projects=hotel-management-system,hotel-management-system-backend
```

## Project Structure
The project utilises a monorepo structure using [Nx](https://nx.dev/). The project is split into two main applications, the frontend and the backend. The frontend is a React application and the backend is a ExpressJS application. The project also contains a shared library that contains shared models between the frontend and backend.
```
apps/
├─ hotel-management-system/ -- Frontend
├─ hotel-mangement-system-backend/ -- Backend
libs/
├─ models/ -- Shared models between frontend and backend
```

## Team Feature Allocation
| Feature                                 | Description                                                                                                                                                                                                                                                                           | Owner    |
|-----------------------------------------| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Overview Dashboard                      | The Overview Dashboard is a page that integrates various hotel information and metrics to help hotel managers quickly understand the performance of the hotel.                                                                                                                        | Chunchao |
| Sign In/Out System                      | The system will have an authentication system to allow only authorised users to access the application.                                                                                                                                                                               | Clarence |
| Permissions System                      | Administrative users will be able to restrict access from certain parts of the web application from employees.                                                                                                                                                                        | Clarence |
| Room Management                         | The software will have a system that allows an administrative staff member to update in the system the number of, and details of the physical rooms available in the hotel.                                                                                                           | Nam      |
| Payments                                | Staff can record payment details for customers in the system.                                                                                                                                                                                                                         | Vittorio |
| Reservations/Bookings                   | Receptionist staff will have the ability to make reservations and bookings for rooms on behalf of customers.                                                                                                                                                                          | Vittorio |
| Manage Bookings for Additional Services | Enabling staff and administrators to oversee reservations for additional hotel services, like spa appointments and dining reservations. This involves integrating these bookings into the system for a holistic service management experience within the 5-star hotel booking system. | Nam      |
| Internal Maintenance Tickets            | The system will implement a ticketing system for housekeeping/maintenance staff to track maintenance jobs around the hotel establishment.                                                                                                                                             | George   |
| Logging/Auditing System                 | General logging system for the Hotel Management System. Including customer check in/out, staff login/logout and more.                                                                                                                                                                 | Chunchao |
| Calendar                                | All staff users will be able to view a calendar and add and remove specific events.                                                                                                                                                                                                   | George   |