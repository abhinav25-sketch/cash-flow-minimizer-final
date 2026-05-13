import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Transaction, Settlement } from "@/utils/cashFlowMinimizer";
import { Download, FileText, Share2, Code, Archive } from "lucide-react";
import { toast } from "sonner";
import JSZip from "jszip";

interface ExportOptionsProps {
  transactions: Transaction[];
  settlements: Settlement[];
}

export const ExportOptions = ({ transactions, settlements }: ExportOptionsProps) => {
  const exportToCSV = () => {
    const csvContent = [
      ["Type", "From", "To", "Amount"],
      ...transactions.map(t => ["Transaction", t.from, t.to, t.amount]),
      [""],
      ["Optimized Settlements"],
      ["Type", "From", "To", "Amount"],
      ...settlements.map(s => ["Settlement", s.from, s.to, s.amount])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cashflow-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported to CSV successfully!");
  };

  const exportToText = () => {
    let text = "CASH FLOW MINIMIZER REPORT\n";
    text += `Generated: ${new Date().toLocaleString()}\n\n`;
    text += "=== ORIGINAL TRANSACTIONS ===\n";
    transactions.forEach((t, i) => {
      text += `${i + 1}. ${t.from} → ${t.to}: $${t.amount.toFixed(2)}\n`;
    });
    text += `\nTotal Transactions: ${transactions.length}\n\n`;
    text += "=== OPTIMIZED SETTLEMENTS ===\n";
    settlements.forEach((s, i) => {
      text += `${i + 1}. ${s.from} → ${s.to}: $${s.amount.toFixed(2)}\n`;
    });
    text += `\nOptimized Settlements: ${settlements.length}\n`;
    text += `Reduction: ${transactions.length - settlements.length} transactions saved!\n`;

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cashflow-report-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported to TXT successfully!");
  };

  const exportToZip = async () => {
    try {
      toast.info("Creating ZIP archive...");
      const zip = new JSZip();

      // Add all project files to ZIP
      const projectFiles = {
        'index.html': `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cash Flow Minimizer - Optimize Debt Settlements</title>
    <meta name="description" content="A powerful tool to minimize cash flow transactions using max heap algorithm. Settle group debts with minimal transactions efficiently." />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
        'README.md': `# Cash Flow Minimizer

A powerful React-based application to optimize and minimize cash flow transactions among multiple parties using advanced heap-based algorithms.

## Features

- 💰 Add and manage transactions between multiple parties
- 🔄 Automatically calculate optimized settlements with minimal transactions
- 📊 Visual balance charts and settlement flow diagrams
- 💱 Multi-currency support with real-time conversion
- 📤 Export results to CSV/TXT/ZIP formats
- 👥 Group transaction management
- 📈 Real-time statistics dashboard

## Technology Stack

- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Recharts for data visualization
- Shadcn UI component library
- React Router for navigation

## Installation

\`\`\`bash
npm install
npm run dev
\`\`\`

## Build for Production

\`\`\`bash
npm run build
npm run preview
\`\`\`

## Algorithm

The application uses a max-heap based greedy algorithm to minimize the number of transactions required to settle all debts among a group of people. This approach ensures optimal cash flow with the minimum number of transfers.

## Project Structure

\`\`\`
src/
├── components/          # React components
│   ├── ui/             # UI component library
│   ├── BalanceChart.tsx
│   ├── BalanceDisplay.tsx
│   ├── CurrencyConverter.tsx
│   ├── ExportOptions.tsx
│   ├── GroupManager.tsx
│   ├── ProjectReport.tsx
│   ├── SettlementDisplay.tsx
│   ├── SettlementFlowChart.tsx
│   ├── StatsDashboard.tsx
│   ├── TransactionForm.tsx
│   └── TransactionList.tsx
├── pages/              # Page components
│   ├── Index.tsx
│   └── NotFound.tsx
├── utils/              # Utility functions
│   └── cashFlowMinimizer.ts
├── App.tsx            # Main app component
└── main.tsx           # Entry point
\`\`\`

## License

MIT`,
        'package.json': `{
  "name": "cash-flow-minimizer",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint ."
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.30.1",
    "recharts": "^2.15.4",
    "lucide-react": "^0.462.0",
    "sonner": "^1.7.4",
    "@tanstack/react-query": "^5.83.0",
    "@radix-ui/react-accordion": "^1.2.11",
    "@radix-ui/react-alert-dialog": "^1.1.14",
    "@radix-ui/react-dialog": "^1.1.14",
    "@radix-ui/react-dropdown-menu": "^2.1.15",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-select": "^2.2.5",
    "@radix-ui/react-tabs": "^1.1.12",
    "@radix-ui/react-toast": "^1.2.14",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.6.0",
    "tailwindcss-animate": "^1.0.7",
    "zod": "^3.25.76",
    "jszip": "^3.10.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.1",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.1",
    "typescript": "^5.5.3",
    "vite": "^5.4.2",
    "tailwindcss": "^3.4.1",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49"
  }
}`,
        'vite.config.ts': `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});`,
        'tailwind.config.ts': `import type { Config } from 'tailwindcss';

export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;`,
        'tsconfig.json': `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`,
        '.gitignore': `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?`,
      };

      // Add each file to the ZIP
      for (const [filename, content] of Object.entries(projectFiles)) {
        zip.file(filename, content);
      }

      // Add a setup guide
      zip.file('SETUP.md', `# Setup Guide

## Quick Start

1. Extract all files from this ZIP archive
2. Open a terminal in the extracted folder
3. Run: \`npm install\`
4. Run: \`npm run dev\`
5. Open your browser to http://localhost:5173

## Requirements

- Node.js 18+ or Bun runtime
- npm or yarn package manager

## Development Commands

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run preview\` - Preview production build
- \`npm run lint\` - Run linter

## Project Information

This is a complete Cash Flow Minimizer application built with React, TypeScript, and Vite.

For the full source code including all components and utilities, please refer to the project repository.

Generated: ${new Date().toLocaleString()}
`);

      // Generate ZIP file
      const content = await zip.generateAsync({ type: "blob" });
      
      // Download ZIP file
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cash-flow-minimizer-${new Date().toISOString().split('T')[0]}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success("ZIP archive created successfully!");
    } catch (error) {
      console.error("ZIP creation failed:", error);
      toast.error("Failed to create ZIP archive");
    }
  };

  const exportSourceCode = async () => {
    let sourceCode = `CASH FLOW MINIMIZER - PROJECT SOURCE CODE\n`;
    sourceCode += `Generated: ${new Date().toLocaleString()}\n`;
    sourceCode += `${"=".repeat(80)}\n\n`;
    
    const files = {
      'index.html': `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cash Flow Minimizer - Optimize Debt Settlements</title>
    <meta name="description" content="A powerful tool to minimize cash flow transactions using max heap algorithm. Settle group debts with minimal transactions efficiently." />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
      'README.md': `# Cash Flow Minimizer

A powerful React-based application to optimize and minimize cash flow transactions among multiple parties using advanced heap-based algorithms.

## Features

- Add and manage transactions between multiple parties
- Automatically calculate optimized settlements with minimal transactions
- Visual balance charts and settlement flow diagrams
- Currency conversion support
- Export results to CSV/TXT formats
- Group transaction management
- Real-time statistics dashboard

## Technology Stack

- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Recharts for data visualization
- Shadcn UI components

## Installation

\`\`\`bash
npm install
npm run dev
\`\`\`

## Algorithm

Uses a max-heap based approach to minimize the number of transactions required to settle all debts among a group of people.

## License

MIT`,
      'package.json': `{
  "name": "cash-flow-minimizer",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.30.1",
    "recharts": "^2.15.4",
    "lucide-react": "^0.462.0",
    "sonner": "^1.7.4",
    "@tanstack/react-query": "^5.83.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.1",
    "@types/react-dom": "^18.3.1",
    "typescript": "^5.5.3",
    "vite": "^5.4.2",
    "tailwindcss": "^3.4.1"
  }
}`
    };

    for (const [filename, content] of Object.entries(files)) {
      sourceCode += `\n${"=".repeat(80)}\n`;
      sourceCode += `FILE: ${filename}\n`;
      sourceCode += `${"=".repeat(80)}\n`;
      sourceCode += content + "\n";
    }

    sourceCode += `\n${"=".repeat(80)}\n`;
    sourceCode += `\nThis is a simplified export. For the complete source code with all components,\n`;
    sourceCode += `utilities, and configurations, please access the full project repository.\n`;

    const blob = new Blob([sourceCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cashflow-minimizer-source-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Source code exported successfully!");
  };

  const shareResults = async () => {
    const shareText = `Cash Flow Optimizer Results:\n\n` +
      `Original: ${transactions.length} transactions\n` +
      `Optimized: ${settlements.length} settlements\n` +
      `Saved: ${transactions.length - settlements.length} transactions!`;

    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
        toast.success("Shared successfully!");
      } catch (err) {
        navigator.clipboard.writeText(shareText);
        toast.success("Copied to clipboard!");
      }
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success("Copied to clipboard!");
    }
  };

  return (
    <Card className="shadow-medium border-border/50 animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5 text-primary" />
          Export & Share
        </CardTitle>
        <CardDescription>Download or share your optimized results</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        <Button onClick={exportToCSV} variant="outline" className="flex-1 min-w-[140px]">
          <FileText className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
        <Button onClick={exportToText} variant="outline" className="flex-1 min-w-[140px]">
          <FileText className="mr-2 h-4 w-4" />
          Export TXT
        </Button>
        <Button onClick={exportToZip} variant="outline" className="flex-1 min-w-[140px]">
          <Archive className="mr-2 h-4 w-4" />
          Download ZIP
        </Button>
        <Button onClick={exportSourceCode} variant="outline" className="flex-1 min-w-[140px]">
          <Code className="mr-2 h-4 w-4" />
          Source Code
        </Button>
        <Button onClick={shareResults} variant="outline" className="flex-1 min-w-[140px]">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </CardContent>
    </Card>
  );
};
