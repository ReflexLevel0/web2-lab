CREATE TABLE ticket(
    id UUID PRIMARY KEY,
    generated_time TIMESTAMP WITH TIME ZONE NOT NULL,
    vatin VARCHAR(64) NOT NULL,
    first_name VARCHAR(64) NOT NULL,
    last_name VARCHAR(64) NOT NULL
);
