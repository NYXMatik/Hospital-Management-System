# Hospital Management System – Full Stack Distributed Healthcare Application

## Abstract

The Hospital Management System is a modular, extensible, full-stack solution designed to manage core hospital operations including patient registration, scheduling, diagnostics, resource planning, and personnel management. The system follows a clean architecture approach and leverages a microservice-inspired domain-driven design to ensure maintainability, testability, and scalability across multiple deployment environments.

This project integrates a .NET Core backend with a service-oriented architecture and an Angular frontend, all supported by a layered persistence model and robust API interaction.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Technology Stack](#technology-stack)
- [System Modules](#system-modules)
- [Backend Design](#backend-design)
- [Frontend Design](#frontend-design)
- [Database and Persistence](#database-and-persistence)
- [Testing Strategy](#testing-strategy)
- [API Documentation](#api-documentation)
- [Build and Deployment](#build-and-deployment)
- [Repository Structure](#repository-structure)
- [License](#license)

## Architecture Overview

This system follows a clean architecture principle with the separation of concerns across:
- **Domain Layer**: Core business rules and aggregates
- **Application Layer**: Service interfaces, DTOs, and orchestration
- **Data Layer**: EF Core ORM configuration and repository implementations
- **Web API Layer**: REST API endpoints and request validation
- **Frontend**: Angular SPA client interacting via secure HTTP APIs

Each layer communicates via dependency injection, enforcing unidirectional dependencies and interface-based contracts.

## Technology Stack

### Backend
- .NET 6.0 (C#)
- ASP.NET Core Web API
- Entity Framework Core (SQLite provider)
- MediatR (Command/Query segregation)
- AutoMapper for DTO mapping
- xUnit & Moq for unit and integration testing

### Frontend
- Angular 15+
- RxJS for reactive state handling
- Angular Material UI
- Cypress for end-to-end testing

### DevOps & Tools
- GitHub Actions CI (optional)
- Docker-compatible architecture
- Visual Studio / Rider / VS Code
- SQLite for development, adaptable to SQL Server

## System Modules

- **Patient Management**: Registration, update, visit tracking
- **Doctor Scheduling**: Shift management, appointments
- **Resource Planning**: Allocation of beds, rooms, staff
- **User Management**: Role-based access control
- **API Gateway & Integration Tests**: Modular endpoints and verification

## Backend Design

### Domain Layer
- Pure POCO models
- Aggregates and factories located in `Domain/`
- Repositories defined in `IRepository` interfaces

### Application Layer
- DTO mappings (`Application/DTO`)
- Use-case specific services (`Application/Services`)
- Shared validation and infrastructure concerns (`Application/Common`)

### API Layer
- Controllers located in `WebApi/Controllers`
- Startup configuration in `Startup.cs`
- Endpoint testing with `WebApi.IntegrationTests`

## Frontend Design

- Angular-based SPA in `frontend-angular-app/`
- Modular feature-based folder structure
- Centralized routing and shared component strategy
- Communication with REST API through HttpClient services
- Integrated testing via Cypress (`cypress/`)

## Database and Persistence

- SQLite used in development mode (`AbsanteeDB.sqlite`)
- Entity Framework Migrations under `DataModel/Migrations`
- Repositories follow the Unit of Work pattern (`UnitOfWork/`)
- Configurable connection strings in `appsettings.json`

## Testing Strategy

- **Domain Logic**: Unit tested via xUnit in `Domain.Tests/`
- **Integration Tests**: Web API tests with mocked contexts
- **Frontend**: E2E testing via Cypress and unit testing via Jasmine/Karma

## API Documentation

- RESTful endpoints grouped by module
- Support for Swagger/OpenAPI (optional)
- HTTP client testing via `WebApi/WebApi.http`

## Build and Deployment

### Prerequisites
- [.NET 6 SDK](https://dotnet.microsoft.com/)
- [Node.js + npm](https://nodejs.org/)
- Angular CLI (`npm install -g @angular/cli`)

### Local Deployment

```bash
# Backend
cd WebApi
dotnet run

# Frontend
cd frontend-angular-app
npm install
ng serve
```

## Repository Structure

```
Hospital-Management-System/
├── Application/                  # Application services and DTOs
├── DataModel/                    # Entity Framework config and DB
├── Domain/                       # Business models and interfaces
├── WebApi/                       # ASP.NET Core Web API
├── WebApi.IntegrationTests/     # Backend test coverage
├── frontend-angular-app/        # Angular client app
├── Patient-management/          # Additional domain-specific logic
├── Docs/                         # Documentation and planning
└── Absantee.sln                 # Solution file
```

## License

MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
