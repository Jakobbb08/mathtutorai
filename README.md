# MathTutorAI 🧮

A **free and open-source AI-powered math tutor** that provides step-by-step explanations for math problems. Built as an alternative to proprietary solutions like astra.ai.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## Features ✨

- 🤖 **AI-Powered Tutoring**: Get instant help with math problems using advanced AI
- 📝 **Step-by-Step Solutions**: Detailed explanations that help you understand, not just get answers
- 🔢 **LaTeX Rendering**: Beautiful mathematical notation using KaTeX
- 🎨 **Modern UI**: Clean, responsive interface built with Next.js and Tailwind CSS
- 🌙 **Dark Mode**: Automatic dark mode support
- 💯 **Free & Open Source**: Completely free to use and modify under MIT license
- 🔌 **Flexible AI Backend**: Works with OpenAI, Groq, OpenRouter, or local models

## Topics Covered 📚

From basic arithmetic to advanced mathematics:
- Algebra (equations, inequalities, polynomials)
- Geometry (shapes, angles, theorems)
- Trigonometry
- Calculus (derivatives, integrals, limits)
- Statistics and Probability
- Linear Algebra
- Differential Equations
- And more!

## Quick Start 🚀

### Prerequisites

- Node.js 18+ installed
- An AI API key (OpenAI, Groq, or compatible service)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Jakobbb08/mathtutorai.git
   cd mathtutorai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   OPENAI_API_KEY=your_api_key_here
   ```
   
   **For alternative AI providers:**
   
   - **Groq (Fast and Free):**
     ```env
     OPENAI_API_KEY=your_groq_api_key
     OPENAI_API_URL=https://api.groq.com/openai/v1/chat/completions
     OPENAI_MODEL=llama-3.1-70b-versatile
     ```
   
   - **OpenRouter (Access Multiple Models):**
     ```env
     OPENAI_API_KEY=your_openrouter_api_key
     OPENAI_API_URL=https://openrouter.ai/api/v1/chat/completions
     OPENAI_MODEL=anthropic/claude-3-sonnet
     ```
   
   - **Local Models (Ollama):**
     ```env
     OPENAI_API_KEY=ollama
     OPENAI_API_URL=http://localhost:11434/v1/chat/completions
     OPENAI_MODEL=llama2
     ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Getting Free API Keys 🔑

### Option 1: Groq (Recommended for Free Usage)
1. Visit [https://console.groq.com](https://console.groq.com)
2. Sign up for a free account
3. Generate an API key
4. Fast inference and generous free tier!

### Option 2: OpenAI
1. Visit [https://platform.openai.com](https://platform.openai.com)
2. Sign up and add billing information
3. Generate an API key
4. Pay-as-you-go pricing (very affordable for personal use)

### Option 3: Run Locally with Ollama
1. Install [Ollama](https://ollama.ai)
2. Pull a model: `ollama pull llama2`
3. No API key needed, runs completely offline!

## Usage 💡

1. Type your math question in the input box
2. Click "Send" or press Enter
3. The AI tutor will provide a detailed, step-by-step explanation
4. Math formulas are rendered beautifully with LaTeX

**Example questions:**
- "Solve: 2x + 5 = 13"
- "Explain the Pythagorean theorem"
- "Find the derivative of x^2 + 3x + 2"
- "What is the integral of sin(x)?"

## Development 🛠️

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Tech Stack 💻

- **Framework**: [Next.js 16](https://nextjs.org/) (React)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Math Rendering**: [KaTeX](https://katex.org/)
- **AI**: OpenAI-compatible APIs (OpenAI, Groq, etc.)

## Project Structure 📁

```
mathtutorai/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts      # API endpoint for AI chat
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Main chat interface
│   └── globals.css           # Global styles
├── public/                   # Static files
├── .env.local               # Environment variables (not in git)
├── next.config.js           # Next.js configuration
├── tailwind.config.ts       # Tailwind configuration
└── package.json             # Dependencies
```

## Contributing 🤝

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Why MathTutorAI? 🎯

- **Free**: No subscriptions, no hidden costs
- **Privacy-Focused**: Your data isn't used for training (depends on your AI provider choice)
- **Offline Capable**: Run with local models for complete privacy
- **Educational**: Focuses on teaching concepts, not just providing answers
- **Open Source**: Community-driven development and transparency

## Roadmap 🗺️

- [ ] Support for image-based math problems
- [ ] Practice problem generator
- [ ] Progress tracking
- [ ] Multiple language support
- [ ] Offline mode with built-in models
- [ ] Mobile app versions

## Support 💬

If you find this project helpful, please:
- ⭐ Star this repository
- 🐛 Report bugs and issues
- 💡 Suggest features
- 🔄 Share with others who might benefit

## Acknowledgments 🙏

Built with ❤️ by Jakob Weibel and contributors.

Special thanks to the open-source community and the creators of:
- Next.js
- React
- KaTeX
- Tailwind CSS
- OpenAI and other AI providers

---

**Made for students, by students. Free forever. Open source always.** 🎓
