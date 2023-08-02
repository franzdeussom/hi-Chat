-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 15, 2023 at 01:54 PM
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
-- Table structure for table `ACCOUNT_SIGNALED`
--

CREATE TABLE `ACCOUNT_SIGNALED` (
  `id_signal` int(11) NOT NULL,
  `id_user_WMS` int(11) NOT NULL,
  `id_user_S` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `COMMENTAIRE`
--

CREATE TABLE `COMMENTAIRE` (
  `id_commentaire` int(11) NOT NULL,
  `id_users` int(11) NOT NULL,
  `id_publication` int(11) NOT NULL,
  `libelle` text NOT NULL,
  `date_comment` varchar(150) NOT NULL,
  `PID` varchar(6) NOT NULL
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
  `id_sender` int(11) NOT NULL,
  `id_discussion` varchar(30) NOT NULL,
  `idUser` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `PREMIUM_REQUEST`
--

CREATE TABLE `PREMIUM_REQUEST` (
  `id_request` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `date_request` varchar(15) NOT NULL,
  `premiumType` varchar(15) NOT NULL,
  `REQUEST_DECISION` varchar(15) DEFAULT 'NOT_VALID',
  `PRICE` int(11) DEFAULT 0
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
  `url_file` mediumtext DEFAULT NULL,
  `is_public` tinyint(1) DEFAULT 0,
  `colorBg` text DEFAULT NULL,
  `PID` varchar(7) NOT NULL,
  `type_pub` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `PUB_LIKE`
--

CREATE TABLE `PUB_LIKE` (
  `id_like` int(11) NOT NULL,
  `id_users` int(11) NOT NULL,
  `id_pub` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `mdp` varchar(150) NOT NULL,
  `profilImgUrl` tinytext DEFAULT NULL,
  `pays` varchar(70) NOT NULL,
  `age` int(11) NOT NULL,
  `date_naiss` date NOT NULL,
  `date_creationAccount` datetime NOT NULL,
  `ville` varchar(40) NOT NULL,
  `isPremiumAccount` tinyint(1) DEFAULT 0,
  `accountType` varchar(30) DEFAULT 'STANDARD_ACCOUNT',
  `dateStartPremium` varchar(15) DEFAULT NULL,
  `dateEndPremium` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ACCOUNT_SIGNALED`
--
ALTER TABLE `ACCOUNT_SIGNALED`
  ADD PRIMARY KEY (`id_signal`),
  ADD KEY `fk_key_user_WMS` (`id_user_WMS`),
  ADD KEY `fk_key_user_S` (`id_user_S`);

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
  ADD KEY `fk_id_users` (`id_users`),
  ADD KEY `fk_id_comment` (`id_comment`);

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
-- Indexes for table `PREMIUM_REQUEST`
--
ALTER TABLE `PREMIUM_REQUEST`
  ADD PRIMARY KEY (`id_request`),
  ADD KEY `fk_id_users_request` (`id_user`);

--
-- Indexes for table `PUBLICATION`
--
ALTER TABLE `PUBLICATION`
  ADD PRIMARY KEY (`id_pub`),
  ADD KEY `fk_id_user` (`id_user`);

--
-- Indexes for table `PUB_LIKE`
--
ALTER TABLE `PUB_LIKE`
  ADD PRIMARY KEY (`id_like`),
  ADD KEY `fk_id_publication` (`id_pub`),
  ADD KEY `fk_id_userLike` (`id_users`);

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
-- AUTO_INCREMENT for table `ACCOUNT_SIGNALED`
--
ALTER TABLE `ACCOUNT_SIGNALED`
  MODIFY `id_signal` int(11) NOT NULL AUTO_INCREMENT;

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
  MODIFY `id_follow` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `MESSAGE`
--
ALTER TABLE `MESSAGE`
  MODIFY `id_message` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `PREMIUM_REQUEST`
--
ALTER TABLE `PREMIUM_REQUEST`
  MODIFY `id_request` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `PUBLICATION`
--
ALTER TABLE `PUBLICATION`
  MODIFY `id_pub` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `PUB_LIKE`
--
ALTER TABLE `PUB_LIKE`
  MODIFY `id_like` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `USERS`
--
ALTER TABLE `USERS`
  MODIFY `id_users` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ACCOUNT_SIGNALED`
--
ALTER TABLE `ACCOUNT_SIGNALED`
  ADD CONSTRAINT `fk_key_user_S` FOREIGN KEY (`id_user_S`) REFERENCES `USERS` (`id_users`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_key_user_WMS` FOREIGN KEY (`id_user_WMS`) REFERENCES `USERS` (`id_users`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `COMMENTAIRE`
--
ALTER TABLE `COMMENTAIRE`
  ADD CONSTRAINT `fk_id_pub` FOREIGN KEY (`id_publication`) REFERENCES `PUBLICATION` (`id_pub`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_id_users_pub` FOREIGN KEY (`id_users`) REFERENCES `USERS` (`id_users`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `COMMENT_LIKE`
--
ALTER TABLE `COMMENT_LIKE`
  ADD CONSTRAINT `fk_id_comment` FOREIGN KEY (`id_comment`) REFERENCES `COMMENTAIRE` (`id_commentaire`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_id_users` FOREIGN KEY (`id_users`) REFERENCES `USERS` (`id_users`) ON DELETE CASCADE ON UPDATE CASCADE;

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
-- Constraints for table `PREMIUM_REQUEST`
--
ALTER TABLE `PREMIUM_REQUEST`
  ADD CONSTRAINT `fk_id_users_request` FOREIGN KEY (`id_user`) REFERENCES `USERS` (`id_users`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `PUBLICATION`
--
ALTER TABLE `PUBLICATION`
  ADD CONSTRAINT `fk_id_user` FOREIGN KEY (`id_user`) REFERENCES `USERS` (`id_users`) ON DELETE CASCADE;

--
-- Constraints for table `PUB_LIKE`
--
ALTER TABLE `PUB_LIKE`
  ADD CONSTRAINT `fk_id_publication` FOREIGN KEY (`id_pub`) REFERENCES `PUBLICATION` (`id_pub`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_id_userLike` FOREIGN KEY (`id_users`) REFERENCES `USERS` (`id_users`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
