FROM node:alpine

RUN mkdir /app
RUN adduser -D -g '' appuser

# Copy contents of dist folder to /app
COPY --chown=appuser:appuser ./dist/apps/build.tar.gz /app

# Change directory to /app
WORKDIR /app

# Unzip build.tar.gz
RUN mkdir /app/hotel-management-system-backend
RUN tar -xvf build.tar.gz -C /app/hotel-management-system-backend

# change directory to /app/hotel-management-system-backend
WORKDIR /app/hotel-management-system-backend

# Install dependencies
RUN yarn install

WORKDIR /

# Delete build.tar.gz
RUN rm -rf /app/build.tar.gz

RUN chown -R appuser:appuser /app

USER appuser
EXPOSE 3333

WORKDIR /app/hotel-management-system-backend
ENTRYPOINT [ "node", "/app/hotel-management-system-backend/main.js" ]

