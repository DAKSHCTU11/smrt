# Smart Recipe Generator

🌐 **Live Demo:** [https://project-5-nv47orp0f-dakshctu11-gmailcoms-projects.vercel.app/](https://project-5-nv47orp0f-dakshctu11-gmailcoms-projects.vercel.app/)

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Requirements](#requirements)
- [Setup & Installation](#setup--installation)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

---

## Overview
**Smart Recipe Generator** is a web application that helps users discover recipes based on available ingredients and dietary preferences. Built with React, TypeScript, and Supabase, it provides a modern and intuitive interface for recipe discovery and management.

---

## Features
- **Ingredient-Based Search:** Find recipes using ingredients you already have
- **Dietary Filters:** Filter recipes by dietary preferences (vegetarian, vegan, gluten-free, etc.)
- **Recipe Details:** View comprehensive recipe information including ingredients, instructions, and nutritional data
- **Personalized Recommendations:** Get recipe suggestions based on your preferences
- **Responsive Design:** Fully optimized for desktop and mobile devices

---

## Tech Stack
- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS
- **Backend & Database:** Supabase
- **Icons:** Lucide React
- **Deployment:** Vercel

---

## Requirements

Before running this project, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download here](https://git-scm.com/)
- **Supabase Account** (for database) - [Sign up here](https://supabase.com/)

---

## Setup & Installation

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd <repository-folder>
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**To get your Supabase credentials:**
1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Navigate to Settings > API
4. Copy the Project URL and anon/public key

### 4. Set Up Database
The database schema is already defined in the migrations folder. If you need to apply migrations manually, use the Supabase dashboard or CLI.

---

## Running the Project

### Development Mode
```bash
npm run dev
```
The application will start at `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Type Checking
```bash
npm run typecheck
```

### Linting
```bash
npm run lint
```

---

## Project Structure
