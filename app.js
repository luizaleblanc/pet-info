function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader);
    reader.readAsDataURL(file);
  });
}

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

async function handleRegister(event) {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value;

  const profilePhotoUrl = document.getElementById("profilePhoto").value.trim();

  const defaultAvatar = "public/avatar-padrao.jpeg";

  let profilePhotoDataUrl = profilePhotoUrl ? profilePhotoUrl : defaultAvatar;

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
    profilePhoto: profilePhotoDataUrl,
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

// *** NOVA FUNÇÃO ***
// Adiciona os posts em destaque ao localStorage (apenas se não existirem)
function initFeaturedPosts() {
  const posts = Storage.getPosts();
  let postsWereAdded = false;

  // Post em destaque 1
  if (!posts.find((p) => p.id === "featured-1")) {
    const pinnedCommentId = Date.now().toString();
    posts.unshift({
      id: "featured-1",
      userId: "system-user-1",
      username: "@pet_lover_123",
      userAvatar: "public/pet-lover.webp",
      text: "Meu cachorrinho aprendeu um novo truque hoje!",
      image: "public/cachorro-truque.webp",
      date: "2024-10-29T10:00:00.000Z",
      likes: 235,
      liked: true,
      comments: [
        { id: pinnedCommentId, username: "@admin_petinfo", text: "Que foto incrível! 🐾" },
        { id: (Date.now() + 1).toString(), username: "@beagle_fun", text: "Muito fofo!" },
      ],
      pinnedCommentId: pinnedCommentId, // Comentário fixado!
      reposts: 12,
      reposted: false,
      bookmarked: false,
      isFeatured: true, // Flag especial!
    });
    postsWereAdded = true;
  }

  // Post em destaque 2
  if (!posts.find((p) => p.id === "featured-2")) {
    posts.unshift({
      id: "featured-2",
      userId: "system-user-2",
      username: "@fluffy_persian",
      userAvatar: "public/gato-persa.webp",
      text: "Hora da soneca!",
      image: "public/gato-dormindo-no-sol.jpg",
      date: "2024-10-29T07:00:00.000Z",
      likes: 198,
      liked: true,
      comments: [],
      pinnedCommentId: null,
      reposts: 0,
      reposted: false,
      bookmarked: true,
      isFeatured: true, // Flag especial!
    });
    postsWereAdded = true;
  }

  if (postsWereAdded) {
    Storage.savePosts(posts);
  }
}

// *** FUNÇÃO MODIFICADA ***
function initFeed() {
  const currentUser = Storage.getCurrentUser();

  if (!currentUser) {
    navigateTo("index.html");
    return;
  }

  document.getElementById("feedUsername").textContent = currentUser.username;
  document.getElementById("feedAvatar").src = currentUser.profilePhoto;
  document.getElementById("feedAvatar").alt = `Foto de perfil de ${currentUser.username}`;

  initFeaturedPosts(); // Adiciona os posts em destaque
  loadPosts(); // Carrega TODOS os posts
}

async function createPost(event) {
  event.preventDefault();

  const currentUser = Storage.getCurrentUser();
  const postText = document.getElementById("postText").value.trim();

  const postImageInput = document.getElementById("postImage");
  const postImageDataUrl = postImageInput.value.trim();

  if (!postText && !postImageDataUrl) {
    showToast("Por favor, adicione um texto ou um link de imagem", "error");
    return;
  }

  const newPost = {
    id: Date.now().toString(),
    userId: currentUser.id,
    username: currentUser.username,
    userAvatar: currentUser.profilePhoto,
    text: postText,
    image: postImageDataUrl,
    date: new Date().toISOString(),
    likes: 0,
    liked: false,
    comments: [],
    pinnedCommentId: null,
    reposts: 0,
    reposted: false,
    bookmarked: false,
    isFeatured: false, // Posts normais não são 'featured'
  };

  const posts = Storage.getPosts();
  posts.unshift(newPost);
  Storage.savePosts(posts);

  document.getElementById("postText").value = "";
  document.getElementById("postImage").value = "";

  loadPosts();
  showToast("Post publicado com sucesso!", "success");
}

function handleDeletePost(postId) {
  let posts = Storage.getPosts();
  posts = posts.filter((p) => p.id !== postId);
  Storage.savePosts(posts);
  loadPosts();
  showToast("Postagem apagada com sucesso", "info");
  closeDeleteModal();
}

// *** NOVA FUNÇÃO (Refatorada) ***
// Esta função cria o HTML para UM post. Vamos usá-la no feed e na sidebar.
function createPostHTML(post, currentUser) {
  const commentsList = post.comments || [];

  const pinnedComment = post.pinnedCommentId
    ? commentsList.find((c) => c.id === post.pinnedCommentId)
    : null;

  const pinnedCommentHtml = pinnedComment
    ? `
    <div class="comment pinned-comment">
      <div>
        <strong>${pinnedComment.username}:</strong> ${pinnedComment.text}
      </div>
      <div class="comment-actions">
        <span class="pinned-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 9V4l1 0c0.55 0 1-0.45 1-1s-0.45-1-1-1H7C6.45 2 6 2.45 6 3s0.45 1 1 1l1 0v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2C17.34 12 16 10.66 16 9z"></path></svg>
          Fixado pelo autor
        </span>
        ${
          post.userId === currentUser.id
            ? `<button class="comment-pin-btn" onclick="pinComment('${post.id}', '${pinnedComment.id}')" title="Desfixar comentário">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>`
            : ""
        }
      </div>
    </div>
  `
    : "";

  const otherCommentsHtml = commentsList
    .filter((c) => !pinnedComment || c.id !== pinnedComment.id)
    .map(
      (c) => `
      <div class="comment">
        <div>
          <strong>${c.username}:</strong> ${c.text}
        </div>
        <div class="comment-actions">
          ${
            post.userId === currentUser.id
              ? `<button class="comment-pin-btn" onclick="pinComment('${post.id}', '${c.id}')" title="Fixar comentário">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 9V4l1 0c0.55 0 1-0.45 1-1s-0.45-1-1-1H7C6.45 2 6 2.45 6 3s0.45 1 1 1l1 0v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2C17.34 12 16 10.66 16 9z"></path></svg>
                </button>`
              : ""
          }
        </div>
      </div>
    `
    )
    .join("");

  // Retorna o HTML completo do post
  return `
  <article class="post-card">
    <div class="post-header">
      <img src="${
        post.userAvatar ||
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
      }" alt="Avatar" class="post-avatar">
      <div class="post-user-info">
        <span class="post-username">${post.username}</span>
        <span class="post-date">${formatDate(post.date)}</span>
      </div>
      ${
        post.userId === currentUser.id
          ? `<button class="post-delete-btn" onclick="showDeleteModal('${post.id}')" aria-label="Apagar postagem">
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
  }')">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
        <span>${post.likes || 0}</span>
      </button>

      <button class="post-action-btn" onclick="toggleComments('${post.id}')">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
           <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.8 0 1.56-.1 2.28-.28L18 23l-1.45-3.44C19.18 18.3 22 15.35 22 12C22 6.48 17.52 2 12 2z"></path>
        </svg>
        <span>${post.comments?.length || 0}</span>
      </button>

      <button class="post-action-btn ${post.reposted ? "active" : ""}" onclick="toggleRepost('${
    post.id
  }')">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
        </svg>
        <span>${post.reposts || 0}</span>
      </button>

      <button class="post-action-btn ${post.bookmarked ? "active" : ""}" onclick="toggleBookmark('${
    post.id
  }')">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
        </svg>
      </button>
    </div>
    <div id="comments-${post.id}" class="post-comments" style="display:none;">
      <div class="comments-list">
        ${pinnedCommentHtml}
        ${otherCommentsHtml}
      </div>
      <form onsubmit="addComment(event, '${post.id}')" class="comment-form">
        <input type="text" placeholder="Escreva um comentário..." class="comment-input" required>
        <button type="submit" class="btn-comment">Enviar</button>
      </form>
    </div>
  </article>`;
}

// *** FUNÇÃO MODIFICADA ***
// Agora ela distribui os posts entre o feed e a sidebar
function loadPosts() {
  const allPosts = Storage.getPosts();
  const currentUser = Storage.getCurrentUser();

  // Separa os posts normais dos posts em destaque
  const regularPosts = allPosts.filter((p) => !p.isFeatured);
  const featuredPosts = allPosts.filter((p) => p.isFeatured);

  const postsContainer = document.getElementById("postsContainer");
  const featuredPostsContainer = document.getElementById("featuredPostsContainer");

  // Renderiza os posts normais no feed principal
  if (regularPosts.length === 0) {
    postsContainer.innerHTML =
      '<p class="no-posts">Nenhuma publicação ainda. Seja o primeiro a postar!</p>';
  } else {
    postsContainer.innerHTML = regularPosts
      .map((post) => createPostHTML(post, currentUser)) // Usa a nova função
      .join("");
  }

  // Renderiza os posts em destaque na sidebar
  if (featuredPostsContainer) {
    if (featuredPosts.length === 0) {
      featuredPostsContainer.innerHTML =
        '<p class="no-posts" style="font-size: 0.9rem; padding: 1rem 0;">Nenhum post em destaque.</p>';
    } else {
      featuredPostsContainer.innerHTML = featuredPosts
        .map((post) => createPostHTML(post, currentUser)) // Reutiliza a nova função
        .join("");
    }
  }
}

function toggleLike(id) {
  const posts = Storage.getPosts();
  const p = posts.find((x) => x.id === id);
  if (!p) return;
  p.liked = !p.liked;
  p.likes += p.liked ? 1 : -1;
  Storage.savePosts(posts);
  loadPosts();
}

function toggleRepost(id) {
  const posts = Storage.getPosts();
  const p = posts.find((x) => x.id === id);
  if (!p) return;
  p.reposted = !p.reposted;
  p.reposts += p.reposted ? 1 : -1;
  Storage.savePosts(posts);
  loadPosts();
}

function toggleBookmark(id) {
  const posts = Storage.getPosts();
  const p = posts.find((x) => x.id === id);
  if (!p) return;
  p.bookmarked = !p.bookmarked;
  Storage.savePosts(posts);
  loadPosts();
}

function toggleComments(id) {
  const el = document.getElementById(`comments-${id}`);
  if (el) el.style.display = el.style.display === "none" ? "block" : "none";
}

function addComment(e, id) {
  e.preventDefault();
  const input = e.target.querySelector(".comment-input");
  const text = input.value.trim();
  if (!text) return;
  const posts = Storage.getPosts();
  const post = posts.find((p) => p.id === id);
  const user = Storage.getCurrentUser();
  if (!post || !user) return;
  if (!post.comments) post.comments = [];

  const newComment = {
    id: Date.now().toString(),
    username: user.username,
    text,
  };
  post.comments.push(newComment);

  Storage.savePosts(posts);
  loadPosts();

  const el = document.getElementById(`comments-${id}`);
  if (el) el.style.display = "block";
  input.value = "";
}

function pinComment(postId, commentId) {
  const posts = Storage.getPosts();
  const post = posts.find((p) => p.id === postId);
  const currentUser = Storage.getCurrentUser();

  if (!post) return;

  // Permite que o dono do post fixe
  // OU que o admin fixe nos posts de "system-user" (destaque)
  const canPin =
    post.userId === currentUser.id ||
    (post.userId.startsWith("system-user") && currentUser.username === "@admin_petinfo"); // Lógica de admin de exemplo

  // Simplesmente permite que o usuário atual fixe em qualquer post
  // Se você não tiver um sistema de admin, descomente a linha abaixo e comente a lógica "canPin"
  // if (post.userId !== currentUser.id) {
  //   showToast("Você não pode fixar comentários neste post", "error");
  //   return;
  // }

  if (post.pinnedCommentId === commentId) {
    post.pinnedCommentId = null;
    showToast("Comentário desfixado", "info");
  } else {
    post.pinnedCommentId = commentId;
    showToast("Comentário fixado no topo!", "success");
  }

  Storage.savePosts(posts);
  loadPosts();

  const el = document.getElementById(`comments-${postId}`);
  if (el) el.style.display = "block";
}

function toggleFollow(btn) {
  if (btn.textContent === "Seguir") {
    btn.textContent = "Seguindo";
    btn.classList.add("following");
  } else {
    btn.textContent = "Seguir";
    btn.classList.remove("following");
  }
}

function showDeleteModal(id) {
  const modal = document.getElementById("deleteModal");
  modal.style.display = "flex";
  setTimeout(() => modal.classList.add("show"), 10);
  document.getElementById("confirmDeleteBtn").onclick = () => handleDeletePost(id);
  document.getElementById("cancelDeleteBtn").onclick = closeDeleteModal;
}

function closeDeleteModal() {
  const modal = document.getElementById("deleteModal");
  modal.classList.remove("show");
  setTimeout(() => (modal.style.display = "none"), 200);
}

function showToast(msg, type = "info") {
  let c = document.getElementById("toast-container");
  if (!c) {
    c = document.createElement("div");
    c.id = "toast-container";
    c.className = "toast-container";
    document.body.appendChild(c);
  }
  const t = document.createElement("div");
  t.className = `toast toast-${type}`;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => t.classList.add("show"), 10);
  setTimeout(() => {
    t.classList.remove("show");
    setTimeout(() => t.remove(), 300);
  }, 3000);
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const diff = Date.now() - d;
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const day = Math.floor(diff / 86400000);
  if (m < 1) return "Agora";
  if (m < 60) return `${m}m`;
  if (h < 24) return `${h}h`;
  if (day < 7) return `${day}d`;
  return d.toLocaleDateString("pt-BR");
}

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("feed.html")) {
    initFeed();
    const form = document.getElementById("createPostForm");
    if (form) form.addEventListener("submit", createPost);
  }
});
