# Video Quality Experts Group (VQEG) Test Application

This repository contains the VQEG Test Application, a Node.js web application designed to facilitate the testing process based on specifications provided in CSV files.

## Structure

The application is structured as follows:
- `server.js`: The main Node.js server script.
- `public/`: Directory containing all client-side files.
  - `index.html`: The main entry point for the application's front end.
  - `script.js`: The JavaScript file that handles client-side logic.
  - `style.css`: The stylesheet for the application's front end.
- `specs/`: Directory where CSV specification files are stored.
- `logs/`: Directory where log files are generated.
- `.gitignore`: Specifies intentionally untracked files to ignore.
- `package.json`: Defines the project dependencies and scripts.

## Installation

To install the application, make sure you have Node.js and npm (Node Package Manager) installed on your system.

1. Clone the repository to your local machine:

```
git clone https://github.com/zerepolbap/vqeg-pixc.git
```

2. Navigate to the cloned directory:

```
cd vqeg-pixc
```

3. Install the required npm packages:

```
npm install
```

## Running the Application

To run the application, execute the following command in the root directory of the project:

```
npm start
```


This will start the Node.js server, and the application will be accessible via `http://localhost:3000` in your web browser.

## Specification and Logging

The application uses CSV files to define test specifications and generates logs for each test session. To learn more about the syntax and format of these CSV files, please refer to the [`specs.md`](specs.md) file.

## Contributing

We welcome contributions to this project. Please fork the repository, make your changes, and submit a pull request for review.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
