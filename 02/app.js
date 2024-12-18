import { Application, Router } from "https://deno.land/x/oak@v12.6.0/mod.ts";
import * as render from "./render.js";

const posts = [
  { id: 0, title: "Example 1", body: "This is example post 1", created_at: new Date().toLocaleString() },
  { id: 1, title: "Example 2", body: "This is example post 2", created_at: new Date().toLocaleString() },
];

const router = new Router();

router
  .get("/", listPosts)
  .get("/post/new", newPostForm)
  .get("/post/:id", showPost)
  .post("/post", createPost);

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

// Display the list of posts
async function listPosts(ctx) {
  ctx.response.body = await render.list(posts);
}

// Display the form to create a new post
async function newPostForm(ctx) {
  ctx.response.body = await render.newPost();
}

// Display a single post by ID
async function showPost(ctx) {
  const id = ctx.params.id;
  const post = posts[id];
  if (!post) ctx.throw(404, "Post not found!");
  ctx.response.body = await render.show(post);
}

async function createPost(ctx) {
  const body = ctx.request.body({ type: "form" }); // Correct form type
  const pairs = await body.value; // Correct way to extract form data
  const post = {};

  for (const [key, value] of pairs) {
    post[key] = value;  // Assign form fields to post object
  }

  console.log("post=", post);

  const id = posts.push(post) - 1;  // Assign ID and push post
  const time = Date.now();
  const td = new Date(time); 
  post.created_at = td.toLocaleString();
  post.id = id;

  ctx.response.redirect("/");  // Redirect to homepage
  console.log("post=", post);
}

console.log("Server is running at http://127.0.0.1:8000");
await app.listen({ port: 8000 });
