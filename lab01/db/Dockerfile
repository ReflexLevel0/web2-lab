FROM postgres:16.3
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=tickets
COPY ./db.sql /docker-entrypoint-initdb.d/
EXPOSE 5432
