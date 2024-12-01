# Awork Challenge

Hello ! Welcome to the awork challenge 🤩. We are looking forward to seeing what you will come up with!

Let us know if you have any questions and refer to the instructions sent to you. This readme contains mostly the install steps to get up and running with the application in its initial state.

### Prerequisites

- Install [Node.js](https://nodejs.org/) which includes [Node Package Manager][npm](https://www.npmjs.com/get-npm)
- Run `npm install` to install the node packages

## Introduction

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

# User List Application

A high-performance, interactive application that displays and manages a large dataset of users. The app is designed to handle up to 5000 users with seamless performance and an exceptional user experience.

---

## Features

### 1. Dynamic User Grouping
- Group users by:
  - Alphabetical order
  - Age
  - Nationality
- Uses **Web Workers** to handle grouping logic for smooth UI performance.

### 2. Infinite Scrolling
- Displays 200 users at a time, loading additional users as you scroll.
- Optimized for both desktop and mobile devices.

### 3. Interactive User Details
- Click on a user to:
  - Expand the card and view additional details like gender, city, and location coordinates.
  - See an embedded Google Map showing the user's location.
- Collapse the card by clicking again or selecting another user.

### 4. Search Functionality
- Search for users dynamically by name, email, or other attributes.
- Powered by **Web Workers** for fast, non-blocking filtering.

### 5. Enhanced Loading and Error Handling
- Custom loader animation while fetching user data.
- Graceful handling of API rate limit errors (status 429) with clear error messages.

### 6. Optimized Rendering
- Lazy loading for images.
- Batch rendering of visible elements.
- Smooth animations for a responsive UI.

