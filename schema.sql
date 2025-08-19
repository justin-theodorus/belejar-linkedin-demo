create table if not exists users (
  id serial primary key,
  name text not null,
  email text not null unique,
  password text not null,
  created_at timestamp not null default now()
);

create table if not exists classes (
  id serial primary key,
  title text not null,
  description text not null,
  instructor_id integer references users(id) on delete set null,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);

create table if not exists enrollments (
  id serial primary key,
  user_id integer not null references users(id) on delete cascade,
  class_id integer not null references classes(id) on delete cascade,
  created_at timestamp not null default now(),
  unique (user_id, class_id)
);