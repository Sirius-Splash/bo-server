# bo-server

# Ticketing Guidelines
1. Always make or claim a ticket before doing any work
2. Ticket naming pattern: `[scope]: [feature/task]`
   - Ticket scopes: `app`, `controller`, `model`
3. Try to create tickets with a clear "done" condition - use a checklist if applicable
4. Add yourself to a ticket to claim it
5. Before starting work, move the ticket to the "In Progress" board
6. After submitting a pull request, move the ticket to the "Under Review" board
7. If changes are requested, move the ticket to the "Changes Requested" board
8. After making changes, move the ticket back to the "Under Review" board

# Git Workflow
1. Claim a ticket
2. Update your local master branch, and then create a new feature branch
   - `git checkout master`
   - `git pull`
   - `git checkout -b [feature-branch]`
4. Make changes (try to keep them within the scope of your ticket)
   - `git add .`
   - `git commit`
5. Before making a pull request, rebase your feature branch on the upstream master to avoid conflicts
   - `git checkout master`
   - `git pull`
   - `git checkout [feature-branch]`
   - `git rebase master`
   - Run your code again to confirm that it still functions
6. Make a pull request
