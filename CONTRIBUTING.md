# Contributing to HRCV

First off, thank you for considering contributing to HRCV! It's people like you that make HRCV such a great platform. We welcome contributions from everyone, from beginners to advanced developers.

Following these guidelines helps to communicate that you respect the time of the developers managing and developing this open-source project. In return, they should reciprocate that respect in addressing your issue, assessing changes, and helping you finalize your pull requests.

## Contribution Workflow for Beginners

### 1. Fork & Clone
To begin contributing, you need to fork this repository to your own GitHub account and clone it to your local machine.

```bash
# Clone your fork
git clone https://github.com/<your-username>/HRCV-.git

# Navigate to the project directory
cd HRCV-

# Add the original repository as an upstream remote
git remote add upstream https://github.com/Priya-Ranjan-0201/HRCV-.git
```

### 2. Branch Naming Conventions
Always create a new branch for your work. Do not work directly on the `main` branch. Use descriptive names that explain what the branch is for:

- **Features**: `feat/your-feature-name` (e.g., `feat/add-bert-embeddings`)
- **Bug Fixes**: `bug/your-bug-fix` (e.g., `bug/fix-url-validation`)
- **Documentation**: `docs/update-readme`
- **Chores/Refactoring**: `chore/clean-up-css`

```bash
git checkout -b feat/your-feature-name
```

### 3. Coding Standards & Best Practices
- **Frontend (React)**: Use functional components, React Hooks, and follow atomic design principles. Keep your CSS (Tailwind) modular.
- **Backend (FastAPI/Python)**: Follow PEP-8 standards. Keep your endpoints modular and ensure new logic includes proper typing and docstrings.
- **General**: Write clean, readable code. If you introduce a complex algorithm, add inline comments explaining *why* it works. Ensure no sensitive keys (like `.env` files) are ever committed.

### 4. Commit Message Guidelines
We follow standard semantic commit messages to keep our history clean:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting, missing semi colons, etc.
- `refactor:` for refactoring production code, eg. renaming a variable

Example: `feat: add semantic BERT embeddings to resume matcher`

### 5. Creating a Pull Request (PR)
When you are ready to submit your changes:
1. Make sure your branch is up to date with the `main` branch of the upstream repository.
   ```bash
   git pull upstream main
   ```
2. Push your branch to your forked repository:
   ```bash
   git push origin feat/your-feature-name
   ```
3. Go to the original repository and click **Compare & pull request**.
4. Clearly describe what your PR does, what issue it fixes (e.g., `Fixes #5`), and include any relevant screenshots if you changed the UI.
5. Wait for the maintainers to review your code. We may request some changes before merging!

## Getting Help
If you need help, feel free to ask questions in the issue you are working on, and we will gladly help you get unblocked. 

Thank you for contributing to TonyCV! 🚀
