import { Application, Router } from "https://deno.land/x/oak@v12.6.0/mod.ts";
import * as render from "./render.js";
import { DB } from "https://deno.land/x/sqlite@v3.9.1/mod.ts";

const db = new DB("blog.db");
db.query(`DROP TABLE IF EXISTS posts`);
db.query(`
CREATE TABLE posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    title TEXT, 
    body TEXT, 
    user TEXT
)`);

const router = new Router();
router
    .get('/', (ctx) => {
        ctx.response.redirect('/Juli/');
    })
    .get('/:user/', list)
    .get('/:user/post/new', add)
    .get('/:user/post/:id', show)
    .post('/:user/post', create);

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

function query(sql, params = []) {
    const results = [];
    for (const [id, title, body, user] of db.query(sql, params)) {
        results.push({ id, title, body, user });
    }
    return results;
}

async function list(ctx) {
    const user = ctx.params.user;
    const posts = query("SELECT id, title, body, user FROM posts WHERE user = ?", [user]);
    ctx.response.body = await render.list(posts, user);
}

async function add(ctx) {
    const user = ctx.params.user;
    ctx.response.body = await render.newPost(user);
}

async function show(ctx) {
    const user = ctx.params.user;
    const postId = ctx.params.id;
    const posts = query("SELECT id, title, body, user FROM posts WHERE id = ? AND user = ?", [postId, user]);
    const post = posts[0];
    if (!post) ctx.throw(404, 'Post not found');
    ctx.response.body = await render.show(post, user);
}

async function create(ctx) {
    const body = ctx.request.body();
    if (body.type === "form") {
        const pairs = await body.value;
        const post = {};
        for (const [key, value] of pairs) {
            post[key] = value;
        }
        const user = ctx.params.user;
        db.query("INSERT INTO posts (title, body, user) VALUES (?, ?, ?)", [post.title, post.body, user]);
        ctx.response.redirect(`/${user}/`);
    }
}

const port = parseInt(Deno.args[0]) || 8000;
console.log(`Server is running at http://127.0.0.1:${port}/`);
await app.listen({ port });
