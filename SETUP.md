# Setup

## Requirements
To run or build the software, NodeJs version 20 or higher must be installed. 
If you use GNU/Linux, you should follow the instruction published [here](https://nodejs.org/en/download).

## Installation
To install the package move in the root of project directory and run:

> npm i

## Run locally
To run the software in local run:

> npm run start

After the initialization the page will be available to http://localhost:3000


## Build and deploy

### Page options
In the .env file there are two option that can be optionally set: 
```
# REACT_APP_CORS_PROXY=https://corsproxy.io/?url=
# REACT_APP_BASENAME=/
```

- REACT_APP_CORS_PROXY: sets an url of a service that provide CORS suppression.
- REACT_APP_BASENAME: sets a base name if the page is not served under '/' .

### Build
To build the project to an HTML optimized version run the following command:

> npm run build

A directory named "build" will be created containing a web page that can be hosted from a web server like Nginx or similar.

### Host with Nginx
After the Nginx, the domain and certificates setup you need to determinate where the page HTML files needs to be copied.
You can find the path searching for the configuration contained in /etc/nginx/sites-enabled/ where the filename matches your domain.
You will find the html path under the "root" option like this example:

```
server {
        listen 80;
        listen [::]:80;

        root /var/www/your_domain/html;
        index index.html index.htm index.nginx-debian.html;

        server_name your_domain www.your_domain;

        location / {
                try_files $uri $uri/ =404;
        }
}
```

You can copy the content of the directory "build" inside the html one.

## CORS restriction
To run every the app without cors restriction you have two possibilities: one is to install any browser plug-in that suppresses CORS such as "CORS Everywere" for Firefox or use a self hosted or remote cors proxy server.

### Nginx as a Forwarder Proxy
Nginx can be used as a forward proxy on the same host using adding a server or a route that handle the traffic.
Below you can find an example of configuration that exposes the port 8888 to proxy the traffic.
```
server {
    listen 8888;

    location / {
        resolver 8.8.8.8;

        proxy_pass $arg_url;
    }
}
```

An example url of proxied GET request using a preselected Trust Anchor Entity Configuration:
> localhost:8888?url=https://oidc.registry.servizicie.interno.gov.it/.well-known/openid-federation

### A self hosted service
A simple self hosted proxy can be also used like the one contained in the bin directary that can be launched using the command:
> npm run proxy

### A third party service
There are other third party service on-line that can be used to proxy the request like corsproxy.io or corsmirror.com that can be used valoraizing the variiable 'REACT_APP_CORS_PROXY' in .env .
