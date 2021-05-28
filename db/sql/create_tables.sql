CREATE TABLE `users` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `email` varchar(255) NOT NULL UNIQUE,
  `data` varchar(255),
  `public_key` text NOT NULL,
  `private_key` text NOT NULL,
  `salt` varchar(255) NOT NULL, 
  `hash` varchar(255) NOT NULL,
  `data_key` text NOT NULL
);

CREATE TABLE `messages` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `data` varchar(255),
  `sent` datetime,
  `user_id` int,
  `chat_id` int
);

CREATE TABLE `chats` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(8000)
);

CREATE TABLE `chat_users` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int,
  `chat_id` int,
  `chat_key` varchar(8000)
);