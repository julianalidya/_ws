export function layout(title, content) {
  return `
  <html>
    <head>
      <title>${title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
        }
        h1, h2 {
          color: #333;
        }
        ul {
          list-style-type: none;
          padding: 0;
        }
        li {
          margin: 10px 0;
          border-bottom: 1px solid #ccc;
          padding-bottom: 10px;
        }
        a {
          text-decoration: none;
          color: blue;
        }
        form {
          margin-top: 20px;
        }
        input, textarea {
          display: block;
          margin-bottom: 10px;
          padding: 8px;
          width: 100%;
        }
        input[type="submit"] {
          width: auto;
          cursor: pointer;
        }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <section>${content}</section>
    </body>
  </html>
  `;
}

// Render the list of posts
export function list(posts) {
  const content = `
    <p><a href="/post/new">+ Create New Post</a></p>
    <ul>
      ${posts
        .map(
          (post) => `
        <li>
          <h2>${post.title}</h2>
          <p><a href="/post/${post.id}">Read More</a></p>
          <small>Created at: ${post.created_at}</small>
        </li>
      `
        )
        .join("")}
    </ul>
  `;
  return layout("Blog Posts", content);
}

// Render the form to create a new post
export function newPost() {
  return layout(
    "Create New Post",
    `
    <form action="/post" method="post">
      <input type="text" name="title" placeholder="Title" required />
      <textarea name="body" placeholder="Content" required></textarea>
      <input type="submit" value="Create Post" />
    </form>
  `
  );
}

// Render a single post's content
export function show(post) {
  return layout(
    post.title,
    `
    <h2>${post.title}</h2>
    <p>${post.body}</p>
    <small>Created at: ${post.created_at}</small>
    <p><a href="/">Back to Posts</a></p>
  `
  );
}
