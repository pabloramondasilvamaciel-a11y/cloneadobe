<#
Interactive helper to configure GitHub remote, create branch, commit and push.
Usage: Open PowerShell in the project root and run: `.	ools\setup-github.ps1` or `powershell -ExecutionPolicy RemoteSigned -File scripts/setup-github.ps1`

Requires: git installed and on PATH. Optional: GitHub CLI (`gh`) to open a PR.
#>

Write-Host "== GitHub setup helper =="

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Write-Error "git not found in PATH. Install Git first: https://git-scm.com/downloads"
  exit 1
}

if (-not (Test-Path -Path .git)) {
  Write-Host "No git repository found. Initializing git..."
  git init
} else {
  Write-Host "Git repository already initialized."
}

$remoteUrl = Read-Host "Remote URL for origin (git@github.com:owner/repo.git or https://github.com/owner/repo.git)"
if (-not $remoteUrl) {
  Write-Error "No remote URL provided. Aborting."
  exit 1
}

$existing = git remote get-url origin 2>$null
if ($LASTEXITCODE -eq 0) {
  Write-Host "Remote 'origin' currently set to: $existing"
  $resp = Read-Host "Replace remote 'origin' with $remoteUrl? (y/N)"
  if ($resp -eq 'y') {
    git remote remove origin
    git remote add origin $remoteUrl
    Write-Host "Remote 'origin' updated."
  } else {
    Write-Host "Keeping existing remote."
  }
} else {
  git remote add origin $remoteUrl
  Write-Host "Remote 'origin' added."
}

$branch = Read-Host "Branch to create (default: ci/add-windows-build)"
if (-not $branch) { $branch = 'ci/add-windows-build' }

Write-Host "Staging changes..."
git add .

Write-Host "Creating commit (if any staged changes)..."
git commit -m "ci: add windows build job, generate icon script, vitest and codecov" 2>$null
if ($LASTEXITCODE -ne 0) {
  Write-Host "No changes to commit or commit failed. Continuing."
} else {
  Write-Host "Committed changes."
}

Write-Host "Creating and switching to branch '$branch'..."
git checkout -B $branch

Write-Host "Pushing branch to origin..."
git push -u origin $branch

$pr = Read-Host "Create a Pull Request using GitHub CLI (gh)? (y/N)"
if ($pr -eq 'y') {
  if (Get-Command gh -ErrorAction SilentlyContinue) {
    gh pr create --fill --base main --head $branch
  } else {
    Write-Error "gh CLI not found. Install from https://cli.github.com/ to enable PR creation."
  }
}

Write-Host "Done. Visit your repository on GitHub to verify the PR or branch." 
