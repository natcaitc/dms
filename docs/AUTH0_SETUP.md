# Auth0 Integration Setup Guide

This guide explains how to set up Auth0 authentication for the NATCA Document Management System.

## Prerequisites

1. An Auth0 account (you can sign up for free at [auth0.com](https://auth0.com))
2. Node.js and npm/yarn installed on your machine

## Auth0 Setup Steps

### 1. Create an Auth0 Application

1. Log in to your Auth0 dashboard
2. Navigate to "Applications" > "Applications"
3. Click "Create Application"
4. Name your application (e.g., "NATCA DMS")
5. Select "Single Page Web Applications" as the application type
6. Click "Create"

### 2. Configure Application Settings

1. In your new application settings, find the "Application URIs" section
2. Set "Allowed Callback URLs" to include your application URLs:
   - For development: `http://localhost:3000`
   - For production: Add your production URL
3. Set "Allowed Logout URLs" to the same URLs
4. Set "Allowed Web Origins" to the same URLs
5. Save changes

### 3. Create an API (Optional, for Backend Integration)

If you need to secure backend APIs:

1. Navigate to "Applications" > "APIs"
2. Click "Create API"
3. Provide a name (e.g., "NATCA DMS API")
4. Set an identifier (e.g., `https://api.natca-dms.com`)
5. Choose an algorithm (RS256 recommended)
6. Click "Create"

### 4. Update Environment Variables

Update the `.env` file with your Auth0 credentials:

```
# Auth0 Configuration
VITE_AUTH0_DOMAIN=your-auth0-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
VITE_AUTH0_AUDIENCE=https://your-api-identifier
```

Replace:
- `your-auth0-domain.auth0.com` with your Auth0 domain
- `your-auth0-client-id` with your Auth0 client ID
- `https://your-api-identifier` with your API identifier (if you created an API)

## Supabase Integration with Auth0

To use Auth0 for authentication while maintaining Supabase for database operations, you have two main options:

### Option 1: Use Auth0 for Authentication Only

With this approach, you use Auth0 for authentication and Supabase for database operations without Supabase's auth features.

1. Continue using the Supabase client for database operations
2. Use the Auth0 user information for authorization checks
3. No additional Supabase configuration is needed

### Option 2: Sync Auth0 Users with Supabase (Advanced)

If you need to maintain user records in Supabase:

1. Set up Auth0 Actions or Rules to call a serverless function when users log in
2. The function creates or updates user records in Supabase
3. Use Supabase Row Level Security (RLS) policies based on user IDs

#### Supabase RLS Policy Example

```sql
CREATE POLICY "Users can only access their own data"
ON public.your_table
FOR ALL
USING (auth.uid() = user_id);
```

## Running the Application

1. Install dependencies:
   ```
   yarn install
   ```

2. Start the development server:
   ```
   yarn dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Troubleshooting

- **Login doesn't work**: Verify your Auth0 domain and client ID in the `.env` file
- **API calls fail**: Check that your audience is correctly set and that your API is properly configured
- **Redirect issues**: Ensure your callback URLs are correctly set in the Auth0 dashboard

## Additional Resources

- [Auth0 Documentation](https://auth0.com/docs)
- [Auth0 Vue SDK Documentation](https://auth0.github.io/auth0-vue/)
- [Supabase Documentation](https://supabase.com/docs)