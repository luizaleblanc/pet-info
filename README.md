<img width="1893" height="851" alt="Captura de tela 2025-11-07 190853" src="https://github.com/user-attachments/assets/1022b540-35a2-4bb9-b52f-6b3cb4eff1e1" />
<body>
  <h1>PetInfo: A Social Feed for Pet Lovers</h1>
  <p>PetInfo is a lightweight, frontend-only social media application built as a single-page application (SPA) concept. It's designed for pet owners to share photos and thoughts about their animal companions. The project runs entirely in the browser and uses <code>localStorage</code> to manage all user data, sessions, and posts.</p>
  
  <h2>Features</h2>
  
  <h3>User Authentication</h3>
  <ul>
    <li><strong>User Registration:</strong> New users can create an account by providing a username, email, password, and an optional URL for their profile photo. If no photo is provided, a default avatar is used.</li>
    <li><strong>User Login:</strong> Registered users can log in using their email and password.</li>
    <li><strong>Session Persistence:</strong> The current user's session is stored in <code>localStorage</code>, allowing them to stay logged in even after closing the browser tab.</li>
    <li><strong>Logout:</strong> A dedicated "Logout" button clears all session and post data from <code>localStorage</code>, providing a clean state for the next user.</li>
  </ul>

  <h3>Main Feed & Post Management</h3>
  <ul>
    <li><strong>Create Posts:</strong> Logged-in users can create new posts using a simple form, which accepts text and a URL for an image.</li>
    <li><strong>Main Feed:</strong> A chronological feed displays all posts created by users, separate from "Featured Posts".</li>
    <li><strong>Delete Posts:</strong> Users can delete their own posts. A confirmation modal appears to prevent accidental deletion.</li>
  </ul>

  <h3>Post Interactions</h3>
  <ul>
    <li><strong>Like:</strong> Users can like or unlike any post. The like count updates dynamically.</li>
    <li><strong>Comment:</strong> Users can write and submit comments on any post. The comment section is toggleable and displays a list of all comments.</li>
    <li><strong>Repost:</strong> Users can "repost" a post, incrementing its share counter.</li>
    <li><strong>Bookmark:</strong> Users can save or unsave posts for later.</li>
    <li><strong>Pin Comments:</strong> Post authors have the ability to pin one specific comment to the top of their own post's comment section.</li>
  </ul>

  <h3>Dynamic UI & Sidebar</h3>
  <ul>
    <li><strong>Follow Suggestions:</strong> The sidebar features a "Suggestions to follow" card with a list of sample users. The "Follow" button toggles to a "Following" state when clicked.</li>
    <li><strong>Featured Posts:</strong> A separate sidebar section dynamically loads "featured" posts, which are hard-coded in the JavaScript (<code>initFeaturedPosts</code>) to simulate promoted content.</li>
    <li><strong>Toast Notifications:</strong> Non-intrusive pop-up messages provide user feedback for actions like logging in, logging out, creating a post, or deleting a post.</li>
  </ul>

  <h2>Technology Stack</h2>
  <ul>
    <li><strong>HTML5:</strong> Provides the semantic structure for both the authentication (<code>index.html</code>) and feed (<code>feed.html</code>) pages.</li>
    <li><strong>CSS3:</strong> Used for all styling, layout (Flexbox), responsiveness, and component-specific designs (cards, modals, etc.).</li>
    <li><strong>Vanilla JavaScript (ES6 Modules):</strong> Powers all application logic, including authentication, DOM manipulation, event handling, and dynamic content rendering.</li>
    <li><strong>Browser <code>localStorage</code>:</strong> Acts as the application's database to store all user accounts (<code>petinfo_users</code>), posts (<code>petinfo_posts</code>), and the current session (<code>petinfo_current_user</code>).</li>
    <li><strong>Vercel:</strong> The project includes a <code>vercel.json</code> configuration file for easy, zero-config deployment as a static site.</li>
  </ul>
</body>
</html>
