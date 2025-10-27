# 🗳️ Quick-Poll App

A simple, single-page web application for creating and voting on quick, multiple-choice polls. Built as an exercise in front-end development using React and Tailwind CSS, following the **Scrum methodology**.

---

## 🚀 Product Increment (Sprint 1 Goal)

The current working version of the application meets the core functionality for our first Sprint Goal:

* **Poll Creation:** Users can input a question and at least two options to create a new poll.
* **Voting:** Any user can view an active poll and cast a single vote for one option.
* **Results Display:** Poll results (vote counts and percentages) are displayed immediately after a user votes.

---

## 🛠️ Technology Stack

* **Frontend:** **React** (for component-based UI)
* **Styling:** **Tailwind CSS** (for utility-first styling)
* **State Management:** Local React state (useState)
* **Icons:** [Lucide React](https://lucide.dev/)

---

## 🏃 Getting Started

### Prerequisites

You need **Node.js** and **npm** (or yarn/pnpm) installed on your machine.

### Installation and Run

1.  **Clone the repository:**
    ```bash
    git clone [YOUR_REPOSITORY_URL]
    cd quick-poll-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or yarn install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    # or yarn dev
    ```

The application will typically be available at `http://localhost:5173/` (or a similar port).

---

## 📂 Project Structure

The UI logic has been separated into functional components to improve maintainability


## 💡 How to Use

1.  Click the **"Create Poll"** button on the home screen.
2.  Enter your question and at least two answer options.
3.  Click **"Create Poll"**.
4.  The app redirects you to the poll page. Click the **Share** ($\text{\Share2}$) icon to copy the poll's link.
5.  Select an option and click the button to vote. Results will instantly appear.