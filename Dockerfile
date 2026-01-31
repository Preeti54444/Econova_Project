FROM nginx:1.27-alpine

WORKDIR /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html ./index.html
COPY css ./css
COPY js ./js

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -qO- http://localhost/ || exit 1
