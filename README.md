# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLS. All shorted URLS store in user's personal list which can be edited or deleted. Hashing password and encrypting cookies are applied for security purposes to prevent information leakage or other cyber threats. The script languages used in this project include Javascript, Embedded Javascript, HTML5 and CSS3.

## Final Product 

!["screenshot of login page"](https://github.com/MingfengLi0122/tinyapp/blob/master/docs/login_page.png)
#### Login page screenshot
---
!["screenshot of url display page"](https://github.com/MingfengLi0122/tinyapp/blob/master/docs/display_urls.png)
#### Url display page screenshot
---
!["screenshot of create url page"](https://github.com/MingfengLi0122/tinyapp/blob/master/docs/create_url.png)
#### Create url page screenshot
---
## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session
- morgan

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.

## Helper Function Test

- Use `npm start` to run this tinyapp project
- Use `npm test` to run automated testing for helper functions

## How to use TinyAPP

####Register/Login####
- user need to register and login the page to view, create, edit and delete their own short urls
####Creat new link#### 
- click create a new short link in the nav bar, then ennter the long urls you want to be shorten
####Edit/Delete#### 
- user can edit or delete their own urls on the my url page
####Share####
- share your short link `/u/:shortURL` to your firends, it will allow you to redirect the long url assigned with.
- Please have fun and enjoy! :hugs::hugs::hugs:
