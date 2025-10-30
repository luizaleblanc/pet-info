# 🐾 PetInfo - Your Pet's Social Network
<img width="1912" height="875" alt="Captura de tela 2025-10-30 100405" src="https://github.com/user-attachments/assets/d3437800-95ff-481b-850d-4eeab843143e" />

**PetInfo** is a front-end project that simulates a modern social network, focusing on sharing moments and information about pets. Think of it as a Twitter or Instagram clone, but entirely dedicated to our furry friends.

This project was built using only **HTML, CSS, and pure JavaScript (ES6+)**, without any external frameworks or libraries. It demonstrates skills in DOM manipulation, responsive design, and client-side data persistence using `localStorage`.

## ✨ Key Features

The project is a SPA (Single Page Application) divided into two main screens (Authentication and Feed) with a robust set of features:

### 1. User Authentication
* **Sign Up:** New users can register with a username, email, password, and a link to a profile picture.
* **Log In:** Existing users can access their accounts.
* **Persistence:** User accounts are saved locally in the browser's `localStorage`.

### 2. Post Feed
* **Modern Layout:** A two-column layout inspired by popular social networks, with the main feed on the left and a sidebar on the right.
* **Create Posts:** Logged-in users can create new posts containing text and/or an image link (URL).
* **Dynamic Feed:** The feed displays all posts, with the most recent ones at the top.

### 3. Post Interaction
* **Actions:** Users can **Like**, **Comment**, **"Repost"** (simulated), and **Bookmark** any post.
* **Delete Posts:** A user can only delete posts they created, complete with a confirmation modal.
* **Notifications:** The system provides visual feedback for actions (login, logout, post, etc.) through "Toast" notifications.

### 4. Advanced Comment System
* **Comment on Posts:** Any user can add comments to any post.
* **Comment on Featured Posts:** The comment functionality is fully operational on both the main feed and the "Featured Posts" section.
* **Pin Comment:** The author of a post has the ability to **pin one comment** to the top of the comments section, highlighting it.

### 5. Smart Sidebar
* **Suggestions:** A static "Suggestions to follow" module.
* **Featured Posts:** A dynamic module that loads special posts (created via JS) which have the same interaction capabilities as regular posts.

## 🚀 Tech Stack

This project was built from scratch with a focus on solid web development fundamentals:

* **HTML5:** Semantic and accessible structure.
* **CSS3:** Fully responsive (mobile-first) design, utilizing:
    * CSS Variables (Custom Properties) for a consistent theme.
    * Flexbox and CSS Grid for complex layouts.
    * Transitions and Animations for a better user experience.
* **JavaScript (ES6+):**
    * Advanced DOM manipulation to create a reactive interface.
    * Modular architecture (functions separated by responsibility).
    * Use of `localStorage` to simulate a database and manage application state (users, posts, likes, etc.).
    * Asynchronous programming (while simulated, the structure is ready for `async/await` with a real API).

## 🛠️ How to Run This Project

Since this is a purely front-end project, you don't need a server or complex dependencies.

1.  **Clone the repository (or download the files):**
    ```bash
    git clone [YOUR-REPOSITORY-URL]
    ```

2.  **Open the `index.html` file:**
    Simply open the `index.html` file directly in your preferred browser (Google Chrome, Firefox, etc.).

    > **Note:** For the best experience (and to avoid potential CORS issues if you decide to expand the project), it's recommended to use an extension like **[Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)** in VS Code.

