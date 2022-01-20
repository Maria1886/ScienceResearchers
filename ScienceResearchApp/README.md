# Science Researchers App

## How to run the application
- Create a '.env' file in the root of the project
- Populate the file with: 
    * PORT=4444
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
- The app will run on port 4444

## Backend functionalities:
- User accounts (register/login/get user/logout/update name/delete account)
- Get all document types from Mendeley
- Search author by email or profile_id in Mendeley
- Add author to favorites list
- Get atuhor favorites list
- Delete author from favorite list
- Get author profile
- Search articles by keywords
- Get all articles/researches for an author using the author's id

## Routes description
- '/auth/register'
    * POST method
    * Needs 'first_name', 'last_name', 'email', 'password', 'confirm_password' as body parameters (if using PostMan these might need to be placed as x-www-form-urlencoded parameters)
    * If parameters are valid, the account will be created and you should be able to login
- '/auth/login'
    * POST method
    * Needs 'email' and 'password' as body parameters
    * If credential are valid a cookie containing a jwt token will be attached to the response (if using PostMan this cookie will persist through all requests in a collection)
- '/auth/user'
    * GET method
    * Returns the user if logged in otherwise null
- '/auth/logout'
    * GET method
    * Clears the authentication cookie (jwt)
- '/auth/update'
    * POST method
    * Needs 'first_name' and 'last_name' as body parameters
    * Updates the name of the user
- '/auth/delete'
    * DELETE method
    * Deletes the current user account

- '/api/documents/types'
    * GET method
    * Returns all document types in Mendeley

- '/api/authors/favorites'
    * GET method
    * Returns the list of favorite authors for the current user
- '/api/authors/favorites'
    * POST method
    * Requires 'author_id' as a query parameter
    * Adds an author to the favorites list of the current user
- '/api/authors/favorite'
    * DELETE method
    * Requires 'author_id' as a query parameter
    * Deletes an author form the favorites list of the current user
- '/api/authors/list_favorites'
    * GET method
    * Returns the list of favorite authors
- '/api/authors/:author_id'
    * GET method
    * Requires 'author_id' as a url parameter
    * Returns the profile of the current author

- '/api/articles/authored_by'
    * GET method
    * Requires 'author_id' as a query parameter
    * Returns all articles/researches written by an author
- '/api/articles/search'
    * POST method
    * Requires 'keywords' as a body parameter
    * Returns the first 10 articles that match the given keywords


## !!! User must be logged_in in order to call all the APIs above.