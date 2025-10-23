function navigateTo(page) {
  window.location.href = page;
}

function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

const Storage = {
  getUsers: () => JSON.parse(localStorage.getItem("petinfo_users") || "[]"),
  saveUser: (user) => {
    const users = Storage.getUsers();
    users.push(user);
    localStorage.setItem("petinfo_users", JSON.stringify(users));
  },
  getCurrentUser: () => JSON.parse(localStorage.getItem("petinfo_current_user") || "null"),
  setCurrentUser: (user) => localStorage.setItem("petinfo_current_user", JSON.stringify(user)),
  clearCurrentUser: () => localStorage.removeItem("petinfo_current_user"),
  getPosts: () => JSON.parse(localStorage.getItem("petinfo_posts") || "[]"),
  savePosts: (posts) => localStorage.setItem("petinfo_posts", JSON.stringify(posts)),
};

function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    showToast("Por favor, preencha todos os campos", "error");
    return;
  }

  const users = Storage.getUsers();
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    Storage.setCurrentUser(user);
    showToast("Login realizado com sucesso!", "success");
    setTimeout(() => navigateTo("feed.html"), 500);
  } else {
    showToast("Email ou senha incorretos", "error");
  }
}

function handleRegister(event) {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const profilePhoto = document.getElementById("profilePhoto").value.trim();
  const password = document.getElementById("registerPassword").value;

  if (!username || !email || !password) {
    showToast("Por favor, preencha todos os campos obrigatórios", "error");
    return;
  }

  const users = Storage.getUsers();

  if (users.some((u) => u.email === email)) {
    showToast("Este email já está cadastrado", "error");
    return;
  }

  const newUser = {
    id: Date.now().toString(),
    username,
    email,
    profilePhoto: profilePhoto || "public/diverse-user-avatars.png",
    password,
    followers: 0,
    following: 0,
  };

  Storage.saveUser(newUser);
  Storage.setCurrentUser(newUser);
  showToast("Cadastro realizado com sucesso!", "success");
  setTimeout(() => navigateTo("feed.html"), 500);
}

function handleLogout() {
  Storage.clearCurrentUser();
  showToast("Você saiu da sua conta", "info");
  setTimeout(() => navigateTo("index.html"), 500);
}

function initFeed() {
  const currentUser = Storage.getCurrentUser();

  if (!currentUser) {
    navigateTo("index.html");
    return;
  }

  document.getElementById("feedUsername").textContent = currentUser.username;
  document.getElementById("feedAvatar").src = currentUser.profilePhoto;
  document.getElementById("feedAvatar").alt = `Foto de perfil de ${currentUser.username}`;

  loadPosts();
}

function createPost(event) {
  event.preventDefault();

  const currentUser = Storage.getCurrentUser();
  const postText = document.getElementById("postText").value.trim();
  const postImage = document.getElementById("postImage").value.trim();

  if (!postText && !postImage) {
    showToast("Por favor, adicione um texto ou uma imagem", "error");
    return;
  }

  const newPost = {
    id: Date.now().toString(),
    userId: currentUser.id,
    username: currentUser.username,
    userAvatar: currentUser.profilePhoto,
    text: postText,
    image: postImage,
    date: new Date().toISOString(),
    likes: 0,
    liked: false,
    comments: [],
    reposts: 0,
    reposted: false,
    bookmarked: false,
  };

  const posts = Storage.getPosts();
  posts.unshift(newPost);
  Storage.savePosts(posts);

  document.getElementById("postText").value = "";
  document.getElementById("postImage").value = "";

  loadPosts();

  showToast("Post publicado com sucesso!", "success");
}

// ===== FUNÇÃO MODIFICADA =====
// O 'confirm' foi removido. A função agora só executa a exclusão.
function handleDeletePost(postId) {
  let posts = Storage.getPosts();
  posts = posts.filter((p) => p.id !== postId);
  Storage.savePosts(posts);
  loadPosts();
  showToast("Postagem apagada com sucesso", "info");

  closeDeleteModal(); // Fecha o modal após apagar
}
// ===== FIM DA MODIFICAÇÃO =====

function loadPosts() {
  const allPosts = Storage.getPosts();
  const postsContainer = document.getElementById("postsContainer");
  const currentUser = Storage.getCurrentUser();

  const posts = allPosts.filter((p) => p.userId === currentUser.id);

  if (posts.length === 0) {
    postsContainer.innerHTML =
      '<p class="no-posts">Nenhuma publicação ainda. Seja o primeiro a postar!</p>';
    return;
  }

  postsContainer.innerHTML = posts
    .map(
      (post) => `
    <article class="post-card">
      <div class="post-header">
        <img src="${
          post.userAvatar || "public/diverse-user-avatars.png"
        }" alt="Avatar" class="post-avatar">
        <div class="post-user-info">
          <span class="post-username">${post.username}</span>
          <span class="post-date">${formatDate(post.date)}</span>
        </div>
        
        ${
          post.userId === currentUser.id
            ? `
            <button class="post-delete-btn" onclick="showDeleteModal('${post.id}')" aria-label="Apagar postagem">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>`
            : ""
        }
      </div>
      
      ${post.text ? `<p class="post-text">${post.text}</p>` : ""}
      
      ${
        post.image
          ? `<img src="${post.image}" alt="Foto do pet" class="post-image" onerror="this.style.display='none'">`
          : ""
      }
      
      <div class="post-actions">
        <button class="post-action-btn ${post.liked ? "active" : ""}" onclick="toggleLike('${
        post.id
      }')" aria-label="Curtir publicação">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="${
            post.liked ? "currentColor" : "none"
          }" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <span>${post.likes || 0}</span>
        </button>
        
        <button class="post-action-btn" onclick="toggleComments('${
          post.id
        }')" aria-label="Comentar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <span>${post.comments?.length || 0}</span>
        </button>
        
        <button class="post-action-btn ${post.reposted ? "active" : ""}" onclick="toggleRepost('${
        post.id
      }')" aria-label="Republicar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="17 1 21 5 17 9"></polyline>
            <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
            <polyline points="7 23 3 19 7 15"></polyline>
            <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
          </svg>
          <span>${post.reposts || 0}</span>
        </button>

        <button class="post-action-btn ${
          post.bookmarked ? "active" : ""
        }" onclick="toggleBookmark('${post.id}')" aria-label="Salvar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="${
            post.bookmarked ? "currentColor" : "none"
          }" stroke="currentColor" stroke-width="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      </div>
      
      <div id="comments-${post.id}" class="post-comments" style="display: none;">
        <div class="comments-list">
          ${(post.comments || [])
            .map(
              (comment) => `
            <div class="comment">
              <strong>${comment.username}:</strong> ${comment.text}
            </div>
          `
            )
            .join("")}
        </div>
        <form onsubmit="addComment(event, '${post.id}')" class="comment-form">
          <input type="text" placeholder="Escreva um comentário..." class="comment-input" required>
          <button type="submit" class="btn-comment">Enviar</button>
        </form>
      </div>
    </article>
  `
    )
    .join("");
}

function toggleLike(postId) {
  const posts = Storage.getPosts();
  const post = posts.find((p) => p.id === postId);

  if (post) {
    post.liked = !post.liked;
    post.likes = (post.likes || 0) + (post.liked ? 1 : -1);
    Storage.savePosts(posts);
    loadPosts();
  }
}

function toggleRepost(postId) {
  const posts = Storage.getPosts();
  const post = posts.find((p) => p.id === postId);

  if (post) {
    post.reposted = !post.reposted;
    post.reposts = (post.reposts || 0) + (post.reposted ? 1 : -1);
    Storage.savePosts(posts);
    loadPosts();
    showToast(post.reposted ? "Post republicado!" : "Republicação removida", "info");
  }
}

function toggleBookmark(postId) {
  const posts = Storage.getPosts();
  const post = posts.find((p) => p.id === postId);

  if (post) {
    post.bookmarked = !post.bookmarked;
    Storage.savePosts(posts);
    loadPosts();
    showToast(post.bookmarked ? "Post salvo!" : "Post removido dos salvos", "info");
  }
}

function toggleComments(postId) {
  const commentsSection = document.getElementById(`comments-${postId}`);
  commentsSection.style.display = commentsSection.style.display === "none" ? "block" : "none";
}

function addComment(event, postId) {
  event.preventDefault();
  const input = event.target.querySelector(".comment-input");
  const commentText = input.value.trim();

  if (!commentText) return;

  const posts = Storage.getPosts();
  const post = posts.find((p) => p.id === postId);
  const currentUser = Storage.getCurrentUser();

  if (post) {
    if (!post.comments) post.comments = [];
    post.comments.push({
      username: currentUser.username || "Usuário",
      text: commentText,
      date: new Date().toISOString(),
    });
    Storage.savePosts(posts);
    loadPosts();
    toggleComments(postId);
    showToast("Comentário adicionado!", "success");
  }
}

function toggleFollow(button) {
  if (button.textContent === "Seguir") {
    button.textContent = "Seguindo";
    button.classList.add("following");
    showToast("Você começou a seguir este usuário", "success");
  } else {
    button.textContent = "Seguir";
    button.classList.remove("following");
    showToast("Você deixou de seguir este usuário", "info");
  }
}

// ===== NOVAS FUNÇÕES DO MODAL ADICIONADAS =====
function showDeleteModal(postId) {
  const modal = document.getElementById("deleteModal");
  modal.style.display = "flex";
  setTimeout(() => modal.classList.add("show"), 10);

  const confirmBtn = document.getElementById("confirmDeleteBtn");
  confirmBtn.onclick = () => handleDeletePost(postId);

  const cancelBtn = document.getElementById("cancelDeleteBtn");
  cancelBtn.onclick = closeDeleteModal;
}

function closeDeleteModal() {
  const modal = document.getElementById("deleteModal");
  modal.classList.remove("show");
  setTimeout(() => (modal.style.display = "none"), 200);
}
// ===== FIM DAS NOVAS FUNÇÕES =====

function showToast(message, type = "info") {
  let container = document.getElementById("toast-container");

  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 10);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Agora";
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  return date.toLocaleDateString("pt-BR");
}

document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  if (path.includes("feed.html")) {
    initFeed();

    const form = document.getElementById("createPostForm");
    if (form) {
      form.addEventListener("submit", createPost);
    }
  }
});
