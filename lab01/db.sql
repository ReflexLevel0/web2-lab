CREATE TABLE ticket(
    id UUID PRIMARY KEY,
    generated_time TIMESTAMP WITH TIME ZONE,
    vatin CHAR(11),
    first_name VARCHAR(64),
    last_name VARCHAR(64)
);
