# Science  Researchers App

## How to run the application
- Create a '.env' file in the root of the project
- Populate the file with: 
    * DB_USER=*/your db user/*
    * DB_PASSWORD=*/db user password/*
    * DB_NAME=*/db name/*
    * DB_PORT=*/db port - usually 3306/*
    * DB_HOST=localhost
    * MENDELEY_ID=*/your Mendeley app id/*
    * MENDELEY_SECRET=*/your Mendeley app secret/*
    * JWT_ACCESS_TOKEN_SECRET=*/a random secret for signing the jwt tokens/*
- Open the project in powershell
- Run 'npm install'
- Run 'npm start'
- The app will run on port 3000

## Backend functionalities:
- User accounts (register/login)
- Get all document types from Mendeley
- Search author by email or profile_id in Mendeley
- Add author to favorites list
- Get atuhor favorites list
- Get all articles/researches for an author using the author's email
- Get all articles/researches for a favorite author using the author's id in our db

## Routes description
- '/auth/register'
    * POST method
    * Needs 'first_name', 'last_name', 'email', 'password', 'confirm_password' as body parameters (if using PostMan these might need to be placed as x-www-form-urlencoded parameters)
    * If parameters are valid, the account will be created and you should be able to login
- '/auth/login'
    * POST method
    * Needs 'email' and 'password' as body parameters
    * If credential are valid a cookie containing a jwt token will be attached to the response (if using PostMan this cookie will persist through all requests in a collection)
- '/api/documents/types'
    * GET method
    * Returns all document types in Mendeley
- '/api/authors/search'
    * GET method
    * Returns an author profile on Mendeley
    * Needs 'author_email' or 'author_profile_id' as query parameters
- '/api/authors/favorite'
    * POST method
    * Adds an author to the favorites list of the logged in user
    * Needs 'author_profile_id' as a query parameter
- '/api/authors/list_favorites'
    * GET method
    * Returns the list of favorite authors
- '/api/articles/authored_by'
    * GET method
    * Returns all articles/researches written by an author
    * Needs 'author_email' as a query parameter
- '/api/articles/favorite_author'
    * GET method
    * Returns all articles/researches written by an author added to the favorites list
    * Needs 'author_id' (id in the 'Authors' table) as a query parameter

## !!! User must be logged_in in order to call all the APIs above.