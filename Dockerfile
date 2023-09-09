FROM node:alpine

RUN mkdir /app
RUN adduser -D -g '' appuser

# Copy contents of dist folder to /app
COPY --chown=appuser:appuser dist /app

# Move contents of /app/apps/hotel-management-system/* to /app/apps/hotel-management-system-backend/assets/
RUN mv /app/apps/hotel-management-system/* /app/apps/hotel-management-system-backend/assets/

# Move hotel-management-system-backend folder to /app/hotel-management-system-backend
RUN mv /app/apps/hotel-management-system-backend /app/hotel-management-system-backend

# change directory to /app/hotel-management-system-backend
WORKDIR /app/hotel-management-system-backend

# Install dependencies
RUN npm install

WORKDIR /

# Delete /app/apps folder
RUN rm -rf /app/apps

RUN chown -R appuser:appuser /app

USER appuser
EXPOSE 3333

WORKDIR /app/hotel-management-system-backend
ENTRYPOINT [ "node", "/app/hotel-management-system-backend/main.js" ]

