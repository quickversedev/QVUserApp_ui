# QV User App UI

A React Native application with TypeScript, ESLint, and Prettier configuration for consistent code quality.

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd qvuserapp_ui
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Install iOS dependencies (macOS only):

```bash
cd ios
pod install
cd ..
```

### Development Dependencies

Install the development dependencies for code quality tools:

```bash
npm install --save-dev @typescript-eslint/eslint-plugin @typescript-eslint/parser \
  eslint eslint-config-prettier eslint-plugin-import eslint-plugin-react \
  eslint-plugin-react-hooks eslint-plugin-react-native prettier
```

## 🏃‍♂️ Running the Application

### Start Metro Bundler:

```bash
npm start
# or
yarn start
```

### Run on Android:

```bash
npm run android
# or
yarn android
```

### Run on iOS (macOS only):

```bash
npm run ios
# or
yarn ios
```

## 📝 Code Quality Tools

### ESLint and Prettier

The project uses ESLint for code quality and Prettier for code formatting. Configuration files are:

- `.eslintrc.js` - ESLint configuration
- `.prettierrc.js` - Prettier configuration
- `.vscode/settings.json` - VS Code editor settings

### Available Scripts

```bash
# Lint code
npm run lint

# Lint and automatically fix issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check code formatting
npm run format:check

# Type checking
npm run typecheck

# Run all checks (lint, format, type)
npm run validate
```

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "start": "react-native start",
    "test": "jest",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write \"**/*.{js,jsx,ts,tsx,json,md}\"",
    "format:check": "prettier --check \"**/*.{js,jsx,ts,tsx,json,md}\"",
    "typecheck": "tsc --noEmit",
    "validate": "npm run lint && npm run format:check && npm run typecheck",
    "prepare": "husky install"
  }
}
```

## 🔧 VS Code Configuration

1. Install recommended extensions:

   - ESLint
   - Prettier
   - TypeScript and JavaScript Language Features

2. The project includes VS Code settings for:
   - Format on Save
   - ESLint auto-fix on save
   - TypeScript settings
   - File handling rules

## 📁 Project Structure

```
qvuserapp_ui/
├── src/
│   ├── assets/         # Static assets
│   ├── components/     # Reusable components
│   ├── contexts/       # React Context providers
│   ├── hooks/         # Custom React hooks
│   ├── navigation/    # Navigation configuration
│   ├── screens/       # Screen components
│   ├── services/      # API and other services
│   ├── theme/         # Theme configuration
│   └── utils/         # Utility functions
├── .eslintrc.js       # ESLint configuration
├── .prettierrc.js     # Prettier configuration
├── tsconfig.json      # TypeScript configuration
└── package.json       # Project dependencies
```

## 🔍 Code Quality Features

- **TypeScript Support**: Strict type checking enabled
- **ESLint Rules**:
  - React & React Native best practices
  - Import/Export organization
  - TypeScript-specific rules
  - Code style enforcement
- **Prettier Configuration**:
  - Consistent code formatting
  - Line length limits
  - JSX formatting rules
- **VS Code Integration**:
  - Format on save
  - Error highlighting
  - Quick fixes
  - Import organization

## 🤝 Contributing

1. Branch naming convention:

   - Feature: `feature/feature-name`
   - Bugfix: `bugfix/bug-name`
   - Hotfix: `hotfix/fix-name`

2. Commit message format:

   ```
   type(scope): description

   [optional body]
   [optional footer]
   ```

   Types: feat, fix, docs, style, refactor, test, chore

3. Before submitting a PR:
   ```bash
   npm run validate
   ```

## 📚 Additional Resources

- [React Native Documentation](https://reactnative.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Options](https://prettier.io/docs/en/options.html)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
