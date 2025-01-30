# Expense Tracker

This is an **Expense Tracker** web application built using HTML, CSS, and JavaScript. It allows users to create an account, log in, and track their expenses with categories such as Food, Transport, Entertainment, and more. Users can add, view, and manage their expenses. The application uses **localStorage** for data persistence.

## Features

- **Sign Up / Login**: Users can create an account, log in, and store their credentials locally.
- **Expense Tracking**: Users can add expenses with a name, amount, category, and date.
- **Categories**: Expenses can be categorized as Food, Transport, Entertainment, or Other.
- **Responsive Design**: The application is responsive and works across devices with different screen sizes.
- **Image Slider**: A beautiful image slider is included on the login and sign-up pages.

## Technologies Used

- **HTML**: For the structure of the pages.
- **CSS**: For styling the pages and layout.
- **JavaScript**: For functionality, such as form validation and managing user data with `localStorage`.
- **Chart.js**: For visualizing expenses on the home page (coming soon!).
- **Anime.js**: For adding animation effects to elements on the page.

## Getting Started

To get started with the Expense Tracker, follow the instructions below.

### Prerequisites

Ensure you have a modern web browser such as **Google Chrome**, **Mozilla Firefox**, or **Microsoft Edge**.

### Installation

1. **Clone the repository**:

```bash
git clone https://github.com/yourusername/expense-tracker.git
```

2. **Navigate into the project directory**:

```bash
cd expense-tracker
```

3. Open the `index.html` file in your browser.

### Usage

1. **Sign Up**: On the sign-up page, fill in your details such as full name, phone number, email, and password to create an account.
2. **Login**: Once you have signed up, log in using your email and password.
3. **Track Expenses**: On the home page, you can add your expenses by filling in the expense name, amount, category, and date.
4. **Visualize Data**: (Coming soon!) View your expenses in graphical form using Chart.js.

## Folder Structure


expense-tracker/
│
├── index.html            # Login Page
├── SignIn_form/          # Sign-Up page
├── HomePage/             # Home Page after login
│
├── Images/               # Folder for image assets
├── style.css             # Styles for the pages
├── script.js             # JavaScript for handling form logic and expense tracking
└── README.md             # Project description


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Chart.js](https://www.chartjs.org/) - A great library for rendering charts.
- [Anime.js](https://animejs.com/) - For adding beautiful animations to the project.
- [Font Awesome](https://fontawesome.com/) - Icons used in the project.
