# Git Commit Instructions

## Using Copilot for Commit Messages

When committing changes to this project, please use GitHub Copilot to help generate standardized commit messages following our team's conventions.

### Steps to Generate Commit Messages with Copilot

1. **Use the Copilot commit message template file:**
   ```bash
   # Reference the copilot-commit-message-instructions.md file when asking Copilot for commit suggestions
   cat .github/copilot-commit-message-instructions.md
   ```

2. **Ask Copilot to generate a commit message:**
   - Prompt example: "Generate a commit message following our team's guidelines for [your changes]"
   - Be specific about the changes you've made so Copilot can generate an appropriate message

3. **Follow the format defined in copilot-commit-message-instructions.md:**
   - This ensures all commit messages follow the same structure
   - Makes the commit history more consistent and easier to navigate

### If copilot-commit-message-instructions.md Is Not Available

If the copilot-commit-message-instructions.md file is not available, follow these general guidelines:

```
type: TICKET[number] Brief description

* Detailed bullet points about changes
* One bullet point per significant change
```

Where type is one of:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `build`: Changes that affect the build system or external dependencies
- `ci`: Changes to our CI configuration files and scripts
- `chore`: Other changes that don't modify src or test files

### Project-Specific Guidelines

For PersonalComponent project changes:
- Always update the PRD documentation when making changes
- Reference the updated PRD in your commit message
- Include any feature flag changes or component behavior modifications

---

**Remember:** Good commit messages serve as documentation for your changes and help other developers understand what you did and why.
