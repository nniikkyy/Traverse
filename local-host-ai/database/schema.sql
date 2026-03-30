CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  type TEXT CHECK (type IN ('traveler', 'host')) NOT NULL,
  language TEXT NOT NULL
);

CREATE TABLE hosts (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  city TEXT NOT NULL,
  bio TEXT,
  languages TEXT[] NOT NULL,
  interests TEXT[] NOT NULL,
  rating NUMERIC(2,1) DEFAULT 0,
  availability BOOLEAN DEFAULT TRUE
);

CREATE TABLE trips (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  city TEXT NOT NULL,
  budget TEXT NOT NULL,
  interests TEXT[] NOT NULL,
  itinerary JSONB,
  host_id INT REFERENCES hosts(id)
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  sender_id INT REFERENCES users(id) ON DELETE CASCADE,
  receiver_id INT REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT NOW()
);
