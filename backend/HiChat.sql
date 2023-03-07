-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 07, 2023 at 02:46 AM
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
-- Indexes for table `MESSAGE`
--
ALTER TABLE `MESSAGE`
  ADD PRIMARY KEY (`id_message`),
  ADD KEY `fk_sender` (`id_sender`);

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
-- AUTO_INCREMENT for table `MESSAGE`
--
ALTER TABLE `MESSAGE`
  MODIFY `id_message` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `USERS`
--
ALTER TABLE `USERS`
  MODIFY `id_users` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `MESSAGE`
--
ALTER TABLE `MESSAGE`
  ADD CONSTRAINT `fk_sender` FOREIGN KEY (`id_sender`) REFERENCES `USERS` (`id_users`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
