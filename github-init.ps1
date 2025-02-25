# GitHub Repository Initialization Script

# Initialize Git repository
git init

# Add all files to Git
git add .

# Commit the changes
git commit -m "Initial commit: JTrackk Job Application Tracker"

# Rename the default branch to main
git branch -M main

# Add the remote origin
git remote add origin https://github.com/saurabhwebdev/jtrackk.git

# Push to GitHub
git push -u origin main

Write-Host "Repository has been initialized and pushed to GitHub!"
Write-Host "Visit https://github.com/saurabhwebdev/jtrackk to see your repository."
