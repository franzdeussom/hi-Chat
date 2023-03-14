-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 14, 2023 at 02:02 AM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.1.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `HiChat`
--

-- --------------------------------------------------------

--
-- Table structure for table `COMMENTAIRE`
--

CREATE TABLE `COMMENTAIRE` (
  `id_commentaire` int(11) NOT NULL,
  `id_users` int(11) NOT NULL,
  `id_publication` int(11) NOT NULL,
  `libelle` text NOT NULL,
  `date_comment` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `COMMENT_LIKE`
--

CREATE TABLE `COMMENT_LIKE` (
  `id_like_comment` int(11) NOT NULL,
  `id_users` int(11) NOT NULL,
  `id_comment` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `FOLLOW`
--

CREATE TABLE `FOLLOW` (
  `id_follow` int(11) NOT NULL,
  `id_users_WF` int(11) NOT NULL,
  `id_users_F` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `FOLLOW`
--

INSERT INTO `FOLLOW` (`id_follow`, `id_users_WF`, `id_users_F`) VALUES
(4, 1, 4),
(33, 2, 1),
(35, 1, 2),
(36, 4, 2),
(38, 4, 1),
(39, 2, 4),
(40, 3, 2);

-- --------------------------------------------------------

--
-- Table structure for table `MESSAGE`
--

CREATE TABLE `MESSAGE` (
  `id_message` int(11) NOT NULL,
  `libelle` text NOT NULL,
  `date_envoie` varchar(20) NOT NULL,
  `statut` tinyint(1) DEFAULT 0,
  `received` tinyint(1) DEFAULT NULL,
  `id_destinateur_user` int(11) NOT NULL,
  `id_sender` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `PUBLICATION`
--

CREATE TABLE `PUBLICATION` (
  `id_pub` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `libelle` text DEFAULT NULL,
  `date_pub` varchar(40) NOT NULL,
  `url_file` text DEFAULT NULL,
  `is_public` tinyint(1) DEFAULT 0,
  `colorBg` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `PUBLICATION`
--

INSERT INTO `PUBLICATION` (`id_pub`, `id_user`, `libelle`, `date_pub`, `url_file`, `is_public`, `colorBg`) VALUES
(7, 2, 'Hello wordl', '11:54 | Mar - Sun', NULL, 0, 'linear-gradient(#FF0844, #FFB199)'),
(8, 4, 'Ceci est un test....', '12:01 | Mar - Sun', NULL, 0, 'linear-gradient(#7028E4, #E5B2CA)'),
(9, 1, 'quoi de neuf', '13:30 | Mar - Sun', NULL, 0, 'linear-gradient(#CC2B5E, #753A88)'),
(10, 1, 'un autre test de.....', '13:31 | Mar - Sun', NULL, 1, 'linear-gradient(#536976, #292E49)'),
(13, 1, 'hello mon minde', '23:30 | Mar - Sun', NULL, 0, 'linear-gradient(#A6C0FE, #F68084)');

-- --------------------------------------------------------

--
-- Table structure for table `PUB_LIKE`
--

CREATE TABLE `PUB_LIKE` (
  `id_like` int(11) NOT NULL,
  `id_users` int(11) NOT NULL,
  `id_pub` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `PUB_LIKE`
--

INSERT INTO `PUB_LIKE` (`id_like`, `id_users`, `id_pub`) VALUES
(2, 1, 8),
(6, 2, 8),
(19, 2, 13),
(24, 1, 7);

-- --------------------------------------------------------

--
-- Table structure for table `USERS`
--

CREATE TABLE `USERS` (
  `id_users` int(11) NOT NULL,
  `nom` varchar(30) NOT NULL,
  `prenom` varchar(30) NOT NULL,
  `email` varchar(30) NOT NULL,
  `sexe` char(1) NOT NULL,
  `tel` varchar(15) NOT NULL,
  `mdp` varchar(12) NOT NULL,
  `profilImgUrl` text DEFAULT NULL,
  `pays` varchar(70) NOT NULL,
  `age` int(11) NOT NULL,
  `date_naiss` date NOT NULL,
  `date_creationAccount` datetime NOT NULL,
  `ville` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `USERS`
--

INSERT INTO `USERS` (`id_users`, `nom`, `prenom`, `email`, `sexe`, `tel`, `mdp`, `profilImgUrl`, `pays`, `age`, `date_naiss`, `date_creationAccount`, `ville`) VALUES
(1, 'admin', 'administrator', 'admin@gmail.com', 'm', '698403201', 'user', '/assets/icon/appIcon.png', 'Cameroun', 20, '2003-06-20', '2023-02-24 00:00:00', 'Douala'),
(2, 'user', 'user', 'user@gmail.com', 'M', '698403201', 'user', NULL, 'France', 20, '2003-06-25', '2023-02-24 00:00:00', 'Paris'),
(3, 'test', 'usertest', 'test@gmail.com', 'F', '698402224', 'user', NULL, 'Cameroun', 17, '2006-06-17', '2023-02-25 00:00:00', 'Yaounde'),
(4, 'Deussom', 'Franz', 'franzdeussom@gmail.com', 'M', '698403201', 'user', NULL, 'Allemagne', 20, '2003-06-20', '2023-02-25 00:00:00', 'Douala');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `COMMENTAIRE`
--
ALTER TABLE `COMMENTAIRE`
  ADD PRIMARY KEY (`id_commentaire`),
  ADD KEY `fk_id_users_pub` (`id_users`),
  ADD KEY `fk_id_pub` (`id_publication`);

--
-- Indexes for table `COMMENT_LIKE`
--
ALTER TABLE `COMMENT_LIKE`
  ADD PRIMARY KEY (`id_like_comment`),
  ADD KEY `fk_id_commentaire` (`id_comment`);

--
-- Indexes for table `FOLLOW`
--
ALTER TABLE `FOLLOW`
  ADD PRIMARY KEY (`id_follow`),
  ADD KEY `fk_id_users_WF` (`id_users_WF`),
  ADD KEY `fk_id_users_F` (`id_users_F`);

--
-- Indexes for table `MESSAGE`
--
ALTER TABLE `MESSAGE`
  ADD PRIMARY KEY (`id_message`),
  ADD KEY `fk_sender` (`id_sender`);

--
-- Indexes for table `PUBLICATION`
--
ALTER TABLE `PUBLICATION`
  ADD PRIMARY KEY (`id_pub`),
  ADD KEY `fk_id_users` (`id_user`);

--
-- Indexes for table `PUB_LIKE`
--
ALTER TABLE `PUB_LIKE`
  ADD PRIMARY KEY (`id_like`),
  ADD KEY `fk_id_users_like` (`id_users`),
  ADD KEY `fk_id_pub_like` (`id_pub`);

--
-- Indexes for table `USERS`
--
ALTER TABLE `USERS`
  ADD PRIMARY KEY (`id_users`),
  ADD UNIQUE KEY `nom` (`nom`),
  ADD UNIQUE KEY `prenom` (`prenom`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `COMMENTAIRE`
--
ALTER TABLE `COMMENTAIRE`
  MODIFY `id_commentaire` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `COMMENT_LIKE`
--
ALTER TABLE `COMMENT_LIKE`
  MODIFY `id_like_comment` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `FOLLOW`
--
ALTER TABLE `FOLLOW`
  MODIFY `id_follow` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `MESSAGE`
--
ALTER TABLE `MESSAGE`
  MODIFY `id_message` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `PUBLICATION`
--
ALTER TABLE `PUBLICATION`
  MODIFY `id_pub` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `PUB_LIKE`
--
ALTER TABLE `PUB_LIKE`
  MODIFY `id_like` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `USERS`
--
ALTER TABLE `USERS`
  MODIFY `id_users` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `COMMENTAIRE`
--
ALTER TABLE `COMMENTAIRE`
  ADD CONSTRAINT `fk_id_pub` FOREIGN KEY (`id_publication`) REFERENCES `PUBLICATION` (`id_pub`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_id_users_pub` FOREIGN KEY (`id_users`) REFERENCES `USERS` (`id_users`);

--
-- Constraints for table `COMMENT_LIKE`
--
ALTER TABLE `COMMENT_LIKE`
  ADD CONSTRAINT `fk_id_commentaire` FOREIGN KEY (`id_comment`) REFERENCES `COMMENTAIRE` (`id_commentaire`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `FOLLOW`
--
ALTER TABLE `FOLLOW`
  ADD CONSTRAINT `fk_id_users_F` FOREIGN KEY (`id_users_F`) REFERENCES `USERS` (`id_users`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_id_users_WF` FOREIGN KEY (`id_users_WF`) REFERENCES `USERS` (`id_users`) ON DELETE CASCADE;

--
-- Constraints for table `MESSAGE`
--
ALTER TABLE `MESSAGE`
  ADD CONSTRAINT `fk_sender` FOREIGN KEY (`id_sender`) REFERENCES `USERS` (`id_users`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `PUBLICATION`
--
ALTER TABLE `PUBLICATION`
  ADD CONSTRAINT `fk_id_users` FOREIGN KEY (`id_user`) REFERENCES `USERS` (`id_users`) ON DELETE CASCADE;

--
-- Constraints for table `PUB_LIKE`
--
ALTER TABLE `PUB_LIKE`
  ADD CONSTRAINT `fk_id_pub_like` FOREIGN KEY (`id_pub`) REFERENCES `PUBLICATION` (`id_pub`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_id_users_like` FOREIGN KEY (`id_users`) REFERENCES `USERS` (`id_users`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
