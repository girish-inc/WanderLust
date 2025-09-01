# WanderLust Deployment Guide

This guide provides step-by-step instructions for deploying the WanderLust application on Vercel and Render.

## Prerequisites

1. **MongoDB Atlas Account**: Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. **Cloudinary Account**: Create a free account at [Cloudinary](https://cloudinary.com/)
3. **Git Repository**: Push your code to GitHub, GitLab, or Bitbucket

## Environment Variables Setup

Before deploying, you need to set up the following environment variables:

```
NODE_ENV=production
PORT=8080
ATLASDB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/wanderlust?retryWrites=true&w=majority
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_api_key
CLOUD_API_SECRET=your_api_secret
SESSION_SECRET=your_super_secret_session_key_here
```

## Deploying to Vercel

### Step 1: Install Vercel CLI (Optional)
```bash
npm install -g vercel
```

### Step 2: Deploy via Vercel Dashboard
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: ./
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty
   - **Install Command**: npm install

### Step 3: Set Environment Variables
1. Go to Project Settings → Environment Variables
2. Add all the environment variables listed above
3. Make sure to set them for Production, Preview, and Development environments

### Step 4: Deploy
1. Click "Deploy"
2. Vercel will automatically build and deploy your application

## Deploying to Render

### Step 1: Create New Web Service
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" → "Web Service"
3. Connect your Git repository

### Step 2: Configure Service
- **Name**: wanderlust-app
- **Environment**: Node
- **Region**: Choose closest to your users
- **Branch**: main (or your default branch)
- **Root Directory**: Leave empty
- **Build Command**: npm install
- **Start Command**: npm start

### Step 3: Set Environment Variables
1. In the service settings, go to "Environment"
2. Add all the environment variables listed above

### Step 4: Deploy
1. Click "Create Web Service"
2. Render will automatically build and deploy your application

## Database Setup (MongoDB Atlas)

### Step 1: Create Cluster
1. Log in to MongoDB Atlas
2. Create a new cluster (free tier is sufficient)
3. Wait for cluster creation (5-10 minutes)

### Step 2: Create Database User
1. Go to Database Access
2. Add a new database user
3. Choose "Password" authentication
4. Set username and password
5. Grant "Atlas admin" privileges

### Step 3: Configure Network Access
1. Go to Network Access
2. Add IP Address
3. Choose "Allow access from anywhere" (0.0.0.0/0)
4. Confirm

### Step 4: Get Connection String
1. Go to Clusters
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Use this as your `ATLASDB_URL` environment variable

## Cloudinary Setup

### Step 1: Get Credentials
1. Log in to Cloudinary
2. Go to Dashboard
3. Copy the following values:
   - Cloud Name
   - API Key
   - API Secret

### Step 2: Configure Environment Variables
Use the copied values for:
- `CLOUD_NAME`
- `CLOUD_API_KEY`
- `CLOUD_API_SECRET`

## Post-Deployment

### Initialize Database (One-time)
After successful deployment, you may want to initialize your database with sample data:

1. Update `init/index.js` to use the production database URL
2. Run the initialization script locally or create a separate deployment script

### Testing
1. Visit your deployed application URL
2. Test user registration and login
3. Test listing creation with image upload
4. Test review functionality

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify MongoDB Atlas connection string
   - Check network access settings
   - Ensure database user has correct permissions

2. **Image Upload Not Working**
   - Verify Cloudinary credentials
   - Check API key permissions

3. **Session Issues**
   - Ensure `SESSION_SECRET` is set
   - Use a strong, random session secret in production

4. **Static Files Not Loading**
   - Verify the `Public` directory exists
   - Check file paths in the application

### Logs
- **Vercel**: Check function logs in Vercel dashboard
- **Render**: Check logs in Render service dashboard

## Security Considerations

1. **Environment Variables**: Never commit `.env` file to version control
2. **Session Secret**: Use a strong, random string for production
3. **Database**: Regularly update database user passwords
4. **HTTPS**: Both Vercel and Render provide HTTPS by default

## Support

For issues related to:
- **Vercel**: [Vercel Documentation](https://vercel.com/docs)
- **Render**: [Render Documentation](https://render.com/docs)
- **MongoDB Atlas**: [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- **Cloudinary**: [Cloudinary Documentation](https://cloudinary.com/documentation)