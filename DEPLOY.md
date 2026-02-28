# TradeSight AI

AI-powered trading assistant with chart analysis and market insights.

## Deployment to Vercel

This project is ready to be deployed on Vercel.

### Steps:

1.  **Push to GitHub/GitLab/Bitbucket**:
    -   Initialize a git repository: `git init`
    -   Add files: `git add .`
    -   Commit: `git commit -m "Initial commit"`
    -   Push to your remote repository.

2.  **Import to Vercel**:
    -   Go to [Vercel Dashboard](https://vercel.com/dashboard).
    -   Click **Add New...** > **Project**.
    -   Import your git repository.

3.  **Configure Environment Variables**:
    -   In the "Environment Variables" section of the deployment setup:
    -   Add `GEMINI_API_KEY`.
    -   Value: Your Google Gemini API Key (get it from [Google AI Studio](https://aistudio.google.com/)).

4.  **Deploy**:
    -   Click **Deploy**.
    -   Vercel will detect Vite and build the project automatically.

### Environment Variables

-   `GEMINI_API_KEY`: Required for AI features.
