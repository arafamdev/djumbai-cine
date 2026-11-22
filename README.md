# Djumbai Cine

A modern, responsive movie and TV show discovery application built with **React, Vite, and Tailwind CSS**, powered by [The Movie Database (TMDB)](https://www.themoviedb.org/) API.

Djumbai Cine allows users to discover movies and TV shows, explore trending titles, search for entertainment, watch trailers, and organize their personal favorites and watchlist.

The project focuses on building a modern frontend application using reusable components, feature-based architecture, API integration, and clean development practices.

## Features

- **Movie Discovery:** Browse popular and trending movies.
- **TV Show Discovery:** Explore TV shows and discover new series.
- **Interactive Search:** Search movies and TV shows with debounced suggestions and keyboard navigation.
- **Movie and TV Details:** View detailed information, ratings, cast members, and related titles.
- **Genre Exploration:** Discover movies and TV shows by genre.
- **Trailers:** Watch available trailers directly from the application.
- **Favorites:** Save movies and TV shows to a personal favorites collection.
- **Watchlist:** Create a collection of movies and TV shows to watch later.
- **Local Persistence:** Keep favorites and watchlist data using browser `localStorage`.
- **Responsive Design:** Enjoy the application across desktop, tablet, and mobile screens.
- **Loading and Error States:** Provide feedback while fetching data and handling API errors.

## Tech Stack

| Technology       | Purpose                                  |
| ---------------- | ---------------------------------------- |
| React 19         | User interface development               |
| Vite 8           | Development server and production builds |
| JavaScript (JSX) | Application logic and components         |
| Tailwind CSS 4   | Styling and responsive design            |
| React Router 7   | Client-side routing                      |
| TMDB API         | Movie and TV show data                   |
| Context API      | Shared application state                 |
| localStorage     | Browser-based data persistence           |
| Lucide React     | Interface icons                          |
| React Toastify   | User notifications                       |
| ESLint           | Code quality and linting                 |

## Project Structure

```text
src/
├── assets/
├── components/
│   ├── layout/
│   └── ui/
├── features/
│   ├── errors/
│   ├── genres/
│   ├── home/
│   ├── library/
│   ├── movies/
│   ├── search/
│   └── tv/
├── services/
│   └── tmdb/
│       ├── genreService.js
│       ├── movieService.js
│       ├── searchService.js
│       ├── tmdbClient.js
│       └── tvService.js
├── App.jsx
└── main.jsx
```

The application follows a **feature-based architecture**, organizing related pages, components, hooks, and utilities by responsibility.

Shared components are separated from feature-specific logic to improve maintainability, scalability, and code reuse.

## Getting Started

### Prerequisites

Before running the application, make sure you have:

- Node.js and npm installed.
- A TMDB account.
- A valid TMDB API Read Access Token.

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/arafamdev/djumbai-cine.git
```

**2. Navigate to the project directory**

```bash
cd djumbai-cine
```

**3. Install dependencies**

```bash
npm install
```

### Environment Variables

Djumbai Cine uses the TMDB API to retrieve movie and TV show information.

To run the application locally, you need a **TMDB API Read Access Token**.

**1. Obtain your token**

- Visit [The Movie Database](https://www.themoviedb.org/).
- Sign in or create an account.
- Navigate to **Settings → API**.
- Locate your **API Read Access Token**.

**2. Create your environment file**

Create a `.env.local` file in the root directory of the project.

**3. Configure the environment variable**

Add the following variable:

```env
TMDB_ACCESS_TOKEN=your_tmdb_read_access_token
```

Replace `your_tmdb_read_access_token` with your own token in your local `.env.local` file.

**Security**

- Never commit `.env.local` or real API credentials to Git.
- Never expose API tokens in the README or frontend source code.
- Do not use the `VITE_` prefix for private tokens, because Vite exposes those variables to client-side code.
- The local development server uses a Vite proxy to forward requests to the TMDB API.
- Production deployments require a secure server-side proxy or API function to handle authenticated TMDB requests.

The `.env.local` file is excluded from version control through `.gitignore`.

### Run the Application

Start the development server:

```bash
npm run dev
```

Open the local URL displayed in your terminal.

### Production Build

Generate an optimized production build:

```bash
npm run build
```

Preview the generated build locally:

```bash
npm run preview
```

**Note:** The Vite development proxy is not included in the production build. A production deployment must provide an equivalent secure API endpoint for TMDB requests.

## Available Scripts

| Command           | Description                            |
| ----------------- | -------------------------------------- |
| `npm run dev`     | Start the development server           |
| `npm run build`   | Generate an optimized production build |
| `npm run preview` | Preview the production build           |
| `npm run lint`    | Run ESLint checks                      |

## Screenshots

Application screenshots will be added as the project progresses.

## Roadmap

### Completed

- [x] Movie and TV show discovery
- [x] Trending and popular content
- [x] Search with live suggestions
- [x] Genre exploration
- [x] Movie and TV show details
- [x] Trailers and cast information
- [x] Favorites and watchlist
- [x] Browser-based data persistence
- [x] Responsive interface

### Planned Improvements

- [ ] Secure TMDB integration for production
- [ ] Automated tests with Vitest and React Testing Library
- [ ] Accessibility improvements
- [ ] Advanced filtering and sorting
- [ ] Actor and director profile pages
- [ ] Streaming availability by region
- [ ] Personal library enhancements
- [ ] Performance optimizations
- [ ] Application screenshots and live demo

## Data Attribution

This application uses the TMDB API to retrieve movie and TV show information.

**This product uses the TMDB API but is not endorsed or certified by TMDB.**

Movie posters, backdrops, and related metadata are provided by [The Movie Database (TMDB)](https://www.themoviedb.org/).

## Author

**Arafam Silla** — Frontend Developer

- **GitHub:** [@arafamdev](https://github.com/arafamdev)
- **LinkedIn:** [Arafam Silla](https://www.linkedin.com/in/arafam-mussa-silla-5a7866446/)

## License

No open-source license has been specified for this repository.
