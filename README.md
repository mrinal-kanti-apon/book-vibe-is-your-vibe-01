# 📚 Book Vive

A modern, responsive book-tracking website. Browse a collection of books, open a detailed page for each one, mark books as **read**, save others to a **wishlist**, and see how many pages each of your books holds in an animated chart.


## ✨ Features

- **Home page** with a hero banner and a searchable book grid. Filter by category and search by title, author or tag.
- **Book details page** for every book, with a 3D-tilted cover, star rating, review, tags, stats, and "You might also like" suggestions.
- **Read and Wishlist buttons** that save your choices in the browser and give instant feedback.
- **Listed Books page** with *Read Books* and *Wishlist Books* tabs, a **Sort By** menu (rating, number of pages, publisher year) and a remove button on every card.
- **Pages to Read page** with a custom-built SVG peak chart, stat cards (total pages, longest book, average), and a switch between your read books and your wishlist.
- **Sticky, glass-style navbar** with an active-page indicator and an animated mobile menu.
- **Footer** with quick links and a back-to-top button.
- **Responsive and accessible:** works from small phones to large desktops, supports keyboard navigation and screen readers, follows the system dark mode, and respects reduced-motion settings.

## 🛠️ Tech Stack

| Area | Tools |
| --- | --- |
| Framework | [Next.js](https://nextjs.org/) (App Router) |
| UI | [React](https://react.dev/) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| Charts | Hand-written SVG (no chart library) |
| Data | Local JSON file (`public/booksData.json`) |
| Hosting | [Vercel](https://vercel.com/) |

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (a current LTS version)
- npm (comes with Node.js)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/mrinal-kanti-apon/book-vibe.git

# 2. Go into the project folder
cd book-vibe

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
`

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the development server |
| `npm run build` | Creates an optimized production build |
| `npm run start` | Runs the production build locally |
| `npm run lint` | Checks the code for problems |

## 📁 Project Structure

```
book-vibe/
├── app/
│   ├── Components/
│   │   ├── Banner.tsx          # Home page hero
│   │   ├── BookActions.tsx     # Read / Wishlist buttons (client)
│   │   ├── BookList.tsx        # Search, filter and book grid (client)
│   │   ├── Books.tsx           # Books section on the home page
│   │   ├── ComingSoon.tsx      # Placeholder for Sign In / Sign Up
│   │   ├── Footer.tsx
│   │   ├── ListedBooks.tsx     # Tabs, sorting and list cards (client)
│   │   ├── NavBar.tsx          # Sticky navbar with mobile menu (client)
│   │   └── PagesChart.tsx      # Animated pages chart (client)
│   ├── books/[bookId]/page.tsx # Book details (pre-rendered for every book)
│   ├── lib/
│   │   ├── books.ts            # Book type, data and helpers
│   │   └── savedBooks.ts       # Read / wishlist storage helpers
│   ├── listed-books/page.tsx
│   ├── pages-to-read/page.tsx
│   ├── signin/page.tsx
│   ├── signup/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── assets/                     # Logo and hero image
└── public/
    └── booksData.json          # Book data
```

## 🧠 How It Works

### Book data

All books live in `public/booksData.json` and are imported in `app/lib/books.ts`. Importing the file means a missing file or a wrong field fails at **build time**, not on the live site. Each book looks like this:

```json
{
  "bookId": 1,
  "bookName": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "image": "https://example.com/cover.jpg",
  "review": "A short review of the book...",
  "totalPages": 192,
  "rating": 4.5,
  "category": "Classic",
  "tags": ["Fiction", "Romance"],
  "publisher": "Scribner",
  "yearOfPublishing": 1925
}
```

To add a book, add a new object with a unique `bookId`. Its details page is created automatically on the next build.

### Dynamic book pages

`app/books/[bookId]/page.tsx` uses `generateStaticParams`, so Next.js builds a page for every book ahead of time. An unknown id returns a 404 page.

### Read and wishlist storage

Your read list and wishlist are saved in the browser's `localStorage` under the keys `bookvive:read` and `bookvive:wishlist`. Components stay in sync through `useSyncExternalStore`, so changing a list on one page updates the others straight away.

## 🌍 Deployment

The easiest way to deploy is with [Vercel](https://vercel.com/):

1. Push the project to GitHub.
2. On Vercel, choose **Add New → Project** and import the repository.
3. Keep the default Next.js settings and click **Deploy**.

No environment variables are needed. Every `git push` to `main` redeploys the site automatically.

> **Tip:** Folder and file names are case-sensitive on Vercel (Linux). Make sure imports match file names exactly, for example `NavBar.tsx` and `Components`.

## 📱 Testing on a Phone

When you open the dev server from a phone using your computer's IP address (for example `http://192.168.0.105:3000`), newer versions of Next.js block that address and the page loads but buttons do nothing. Allow your IP in `next.config.ts` and restart the dev server:

```ts
const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.0.105'], // use your own IP
};
```

Testing the deployed Vercel link on your phone avoids this problem entirely.

## ⚠️ Known Limitations

- Read and wishlist data is stored **per browser**. It does not sync across devices.
- **Sign In** and **Sign Up** are placeholder pages for now.
- Book covers are loaded from external image hosts and use `unoptimized` images, so no extra `next.config.ts` setup is needed.

## 🗺️ Roadmap

- [ ] User accounts (Sign In / Sign Up)
- [ ] Sync read and wishlist data to a database
- [ ] Reading progress for each book
- [ ] More sorting and filtering options on Listed Books

## 🤝 Contributing

Suggestions and pull requests are welcome. Please open an issue first to discuss any big change.

## 📄 License

This project is for learning and portfolio purposes.

---

Built with care by **Mrinal Kanti Apon**.