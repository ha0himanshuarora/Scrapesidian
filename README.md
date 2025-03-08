# Scrapesidian

Scrapesidian is a powerful SaaS web application designed for seamless web scraping, offering custom workflows that bypass bot protection and retrieve structured data from websites. Whether you're scraping manually or using AI-powered workflows via OpenAI, Scrapesidian makes it easy to collect and manage web data.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Billing](#billing)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- **Custom Scraping Workflows:** Create workflows tailored to your scraping requirements.
- **Bot Protection Bypass:** Leverage Puppeteer to bypass bot protection on targeted websites.
- **AI-Driven Scraping:** Use OpenAI APIs to automate scraping processes with artificial intelligence.
- **Real-time Scraping:** Monitor scraping activity and results in real time.
- **User Authentication:** Secure user accounts with Clerk.
- **Billing Management:** Subscription payments via Stripe.

## Tech Stack

- **Frontend:**
  - [React](https://reactjs.org/)
  - [XYFlow](https://xyflow.dev/) - For designing scraping workflows.
  - [shadcn/UI](https://shadcn.dev/) - Modern UI components for an intuitive user experience.

- **Backend:**
  - [Node.js](https://nodejs.org/) - JavaScript runtime for handling server-side logic.
  - [Puppeteer](https://pptr.dev/) - Headless browser for web scraping and automation.
  - [SQLite](https://www.sqlite.org/) - Lightweight database used for data storage.
  - [Prisma](https://www.prisma.io/) - ORM for interacting with the SQLite database.
  - [OpenAI API](https://openai.com/) - Integration for AI-based scraping workflows.

- **Authentication & Billing:**
  - [Clerk](https://clerk.dev/) - Secure user authentication and access management.
  - [Stripe](https://stripe.com/) - Handles subscription payments and billing.

## Installation

To get started with Scrapesidian, follow these steps:

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (v6 or higher)

### Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/ha0himanshuarora/scrapesidian.git
   cd scrapesidian
