# GitHub API Setup for Contribution Heatmap

This project uses the GitHub API to display your contribution heatmap on the portfolio phone widget.

## Setup Guide

### 1. Create a GitHub Personal Access Token

1. Go to [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name like "Portfolio App"
4. Select the scope: `public_repo` (read-only access to public repositories)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again)

### 2. Add Token to Your Environment

**Local Development:**

Create a `.env.local` file in the root of your project:

```env
REACT_APP_GITHUB_TOKEN=ghp_your_token_here_replace_this
```

Replace `ghp_your_token_here_replace_this` with your actual token.

**Deployment (Vercel, Netlify, etc.):**

Add the environment variable in your deployment platform's settings:
- Go to your platform's dashboard
- Find Environment Variables or Secrets
- Add `REACT_APP_GITHUB_TOKEN` with your token value

### 3. Verify It Works

Start your development server:
```bash
npm start
```

Navigate to the phone widget and change the year in the contributions dropdown. The heatmap should update with your actual GitHub contribution data.

## Troubleshooting

**"GitHub token not configured"**
- Ensure `.env.local` exists in the project root
- Check that `REACT_APP_GITHUB_TOKEN` is set correctly
- Restart your dev server after adding the token

**"GitHub API error"**
- Verify your token is valid and hasn't expired
- Check your internet connection
- You may have hit the rate limit (60 requests/hour unauthenticated, 5,000 with token)

**"No contribution data found"**
- Ensure your GitHub username in the code is correct (`Corelocked`)
- Make sure your GitHub account has commits during that year

## API Rate Limits

- **Unauthenticated**: 60 requests/hour
- **Authenticated**: 5,000 requests/hour (free tier)

This app makes one API request per year change, so you'll never hit the limit.

## Security Notes

- The token is only used in your browser/build process
- It only has `public_repo` read access (no write permissions)
- Never commit `.env.local` to git (already in `.gitignore`)
