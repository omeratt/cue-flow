# GitHub Copilot Commit Instructions

## for each generation MUST get the tickets/ticket number/numbers from the branch name and paste it in the [TicketNumber] of the commit message

## Read the following commit structures and match the following by commit context:

1. **General Structure**
   * Read all file changes and for each file or change:
   - For Each file MUST create a text starting with `*` and then the description of the file changes and then \n.
   - Provide specific, clear, and concise descriptions for each file or change.
   - Keep the descriptions simple and easy to read.

2. **Bug Fixes**
   - Commit message starts with:
     `bugfix: TICKET[] short description describe all changes in all files`
   
   - Provide a clear description of the bug fixed and how it was addressed.
   - after this put \n

3. **Features**
   - Commit message starts with:
     `feature: TICKET[] short description describe all changes in all files`
   
   - Describe the feature implemented and its purpose or functionality.
   - after this put \n

4. **Refactor**
   - Commit message starts with:
     `refactor: TICKET[] short description describe all changes in all files`
   
   - Provide a brief description of the refactor changes and the reason for them.

5. **Infrastructure**
   - Commit message starts with:
     `infrastructure: TICKET[] short description describe all changes in all files`
   
   - Describe the infrastructure changes and their impact.
   - after this put \n

6. **Tests**
   - Commit message starts with:
     `tests: TICKET[] short description describe all changes in all files`
   
   - Provide a clear description of the test added, updated, or removed and the purpose of the test.
   - after this put \n

7. **Ignore Specific Changes**
   - Ignore changes that only involve refactoring from Prettier (e.g., tabs, spaces, formatting adjustments).

8. **Additional Guidelines**
   - Avoid referring to external coding standards or resources.
   - MUST Always use the prefix of TICKET[] + short description describe all changes in all files
   - MUST Always use the * and description for each file


example for commit:
tests: TICKET[9012] Added unit tests and update integration tests for OrderController

* Added unit tests for OrderController

* Updated integration tests to include edge cases