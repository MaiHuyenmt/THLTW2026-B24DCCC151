import { Request, Response } from 'express';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

// Mock data for tags
const tags = [
  { id: 1, name: 'React', postCount: 5 },
  { id: 2, name: 'JavaScript', postCount: 3 },
  { id: 3, name: 'CSS', postCount: 2 },
  { id: 4, name: 'Node.js', postCount: 1 },
  { id: 5, name: 'TypeScript', postCount: 4 },
];

// Mock data for posts
const posts = [
  {
    id: 1,
    title: 'Giới thiệu về React Hooks',
    slug: 'gioi-thieu-ve-react-hooks',
    summary: 'React Hooks là một tính năng mới trong React 16.8 cho phép sử dụng state và các tính năng khác mà không cần viết class component.',
    content: `# Giới thiệu về React Hooks

React Hooks là một tính năng mới trong React 16.8 cho phép sử dụng state và các tính năng khác mà không cần viết class component.

## Tại sao sử dụng Hooks?

- **Đơn giản hóa code**: Không cần class component
- **Tái sử dụng logic**: Custom hooks
- **Performance tốt hơn**

## Các hooks cơ bản

### useState

\`\`\`jsx
const [count, setCount] = useState(0);
\`\`\`

### useEffect

\`\`\`jsx
useEffect(() => {
  document.title = \`Count: \${count}\`;
}, [count]);
\`\`\`
`,
    coverImage: 'https://via.placeholder.com/400x200',
    author: 'Nguyễn Văn A',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
    status: 'published',
    tags: [1, 2],
    viewCount: 150,
  },
  {
    id: 2,
    title: 'Hướng dẫn sử dụng TypeScript với React',
    slug: 'huong-dan-su-dung-typescript-voi-react',
    summary: 'TypeScript giúp viết code React an toàn hơn với type checking.',
    content: `# Hướng dẫn sử dụng TypeScript với React

TypeScript là một superset của JavaScript thêm type checking.

## Cài đặt

\`\`\`bash
npm install typescript @types/react @types/react-dom
\`\`\`

## Sử dụng

\`\`\`tsx
interface Props {
  name: string;
}

const Hello: React.FC<Props> = ({ name }) => {
  return <div>Hello {name}</div>;
};
\`\`\`
`,
    coverImage: 'https://via.placeholder.com/400x200',
    author: 'Nguyễn Văn A',
    createdAt: '2023-01-02',
    updatedAt: '2023-01-02',
    status: 'published',
    tags: [2, 5],
    viewCount: 200,
  },
  // Thêm nhiều posts hơn...
  {
    id: 3,
    title: 'CSS Grid Layout',
    slug: 'css-grid-layout',
    summary: 'CSS Grid là một hệ thống layout hai chiều mạnh mẽ.',
    content: `# CSS Grid Layout

CSS Grid Layout là một module CSS cung cấp một hệ thống dựa trên lưới với các hàng và cột.

## Cơ bản

\`\`\`css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 10px;
}
\`\`\`
`,
    coverImage: 'https://via.placeholder.com/400x200',
    author: 'Nguyễn Văn A',
    createdAt: '2023-01-03',
    updatedAt: '2023-01-03',
    status: 'published',
    tags: [3],
    viewCount: 100,
  },
  {
    id: 4,
    title: 'Node.js Express API',
    slug: 'nodejs-express-api',
    summary: 'Xây dựng REST API với Node.js và Express.',
    content: `# Node.js Express API

Express.js là một framework web nhanh, không có ý kiến cho Node.js.

## Cài đặt

\`\`\`bash
npm install express
\`\`\`

## Ví dụ

\`\`\`js
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000);
\`\`\`
`,
    coverImage: 'https://via.placeholder.com/400x200',
    author: 'Nguyễn Văn A',
    createdAt: '2023-01-04',
    updatedAt: '2023-01-04',
    status: 'draft',
    tags: [4],
    viewCount: 50,
  },
  {
    id: 5,
    title: 'JavaScript ES6 Features',
    slug: 'javascript-es6-features',
    summary: 'Các tính năng mới trong ES6.',
    content: `# JavaScript ES6 Features

ES6 (ECMAScript 2015) giới thiệu nhiều tính năng mới.

## Arrow Functions

\`\`\`js
const add = (a, b) => a + b;
\`\`\`

## Destructuring

\`\`\`js
const [a, b] = [1, 2];
\`\`\`
`,
    coverImage: 'https://via.placeholder.com/400x200',
    author: 'Nguyễn Văn A',
    createdAt: '2023-01-05',
    updatedAt: '2023-01-05',
    status: 'published',
    tags: [2],
    viewCount: 300,
  },
];

// API endpoints
export default {
  'GET /api/blog/posts': async (req: Request, res: Response) => {
    await waitTime(500);
    const { page = 1, limit = 9, tag, search } = req.query;
    let filteredPosts = posts.filter(p => p.status === 'published');

    if (tag) {
      filteredPosts = filteredPosts.filter(p => p.tags.includes(Number(tag)));
    }

    if (search && typeof search === 'string') {
      filteredPosts = filteredPosts.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.summary.toLowerCase().includes(search.toLowerCase())
      );
    }

    const start = (Number(page) - 1) * Number(limit);
    const end = start + Number(limit);
    const paginatedPosts = filteredPosts.slice(start, end);

    res.json({
      data: paginatedPosts,
      total: filteredPosts.length,
      page: Number(page),
      limit: Number(limit),
    });
  },

  'GET /api/blog/posts/:id': async (req: Request, res: Response) => {
    await waitTime(300);
    const { id } = req.params;
    const post = posts.find(p => p.id === Number(id));
    if (post) {
      // Tăng view count
      post.viewCount += 1;
      res.json(post);
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  },

  'GET /api/blog/posts/slug/:slug': async (req: Request, res: Response) => {
    await waitTime(300);
    const { slug } = req.params;
    const post = posts.find(p => p.slug === slug);
    if (post) {
      post.viewCount += 1;
      res.json(post);
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  },

  'GET /api/blog/tags': async (req: Request, res: Response) => {
    await waitTime(300);
    res.json(tags);
  },

  'POST /api/blog/posts': async (req: Request, res: Response) => {
    await waitTime(500);
    const newPost = {
      id: posts.length + 1,
      ...req.body,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      viewCount: 0,
    };
    posts.push(newPost);
    res.json(newPost);
  },

  'PUT /api/blog/posts/:id': async (req: Request, res: Response) => {
    await waitTime(500);
    const { id } = req.params;
    const index = posts.findIndex(p => p.id === Number(id));
    if (index !== -1) {
      posts[index] = { ...posts[index], ...req.body, updatedAt: new Date().toISOString().split('T')[0] };
      res.json(posts[index]);
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  },

  'DELETE /api/blog/posts/:id': async (req: Request, res: Response) => {
    await waitTime(300);
    const { id } = req.params;
    const index = posts.findIndex(p => p.id === Number(id));
    if (index !== -1) {
      posts.splice(index, 1);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  },

  'POST /api/blog/tags': async (req: Request, res: Response) => {
    await waitTime(300);
    const newTag = {
      id: tags.length + 1,
      ...req.body,
      postCount: 0,
    };
    tags.push(newTag);
    res.json(newTag);
  },

  'PUT /api/blog/tags/:id': async (req: Request, res: Response) => {
    await waitTime(300);
    const { id } = req.params;
    const index = tags.findIndex(t => t.id === Number(id));
    if (index !== -1) {
      tags[index] = { ...tags[index], ...req.body };
      res.json(tags[index]);
    } else {
      res.status(404).json({ error: 'Tag not found' });
    }
  },

  'DELETE /api/blog/tags/:id': async (req: Request, res: Response) => {
    await waitTime(300);
    const { id } = req.params;
    const index = tags.findIndex(t => t.id === Number(id));
    if (index !== -1) {
      tags.splice(index, 1);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Tag not found' });
    }
  },
};