CREATE TABLE users(id varchar(255) PRIMARY KEY, name text);
CREATE TABLE admin_users(id integer PRIMARY KEY);
CREATE TABLE universities(id integer PRIMARY KEY);
CREATE TABLE student_peers(id integer PRIMARY KEY, university_id integer REFERENCES universities, peer_user_id varchar(255) REFERENCES users, status text DEFAULT 'active');
CREATE TABLE peer_call_bookings(id serial PRIMARY KEY, student_user_id varchar(255) REFERENCES users, peer_id integer REFERENCES student_peers, status text DEFAULT 'pending', message text, created_at timestamptz DEFAULT now(), UNIQUE(student_user_id,peer_id));
CREATE TABLE guide_conversations(id serial PRIMARY KEY, student_user_id varchar(255) REFERENCES users, peer_user_id varchar(255) REFERENCES users, peer_id integer REFERENCES student_peers, last_message_text text, last_message_at timestamptz, updated_at timestamptz DEFAULT now(), student_last_read_at timestamptz, peer_last_read_at timestamptz, UNIQUE(student_user_id,peer_id));
CREATE TABLE guide_messages(id serial PRIMARY KEY, conversation_id integer REFERENCES guide_conversations, sender_user_id varchar(255) REFERENCES users, message_type text, body text, created_at timestamptz DEFAULT now());
CREATE TABLE peer_call_sessions(id text PRIMARY KEY, channel_name text UNIQUE, university_id integer REFERENCES universities, peer_id integer REFERENCES student_peers, caller_user_id varchar(255) REFERENCES users, peer_user_id varchar(255) REFERENCES users, status text, started_at timestamptz, answered_at timestamptz, ended_at timestamptz, expires_at timestamptz, updated_at timestamptz DEFAULT now());
CREATE TABLE background_jobs(id serial PRIMARY KEY, kind text, payload jsonb);
