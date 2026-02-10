-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 10, 2026 at 09:02 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `enertech_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `actual_expenses`
--

CREATE TABLE `actual_expenses` (
  `id` int(11) NOT NULL,
  `expense_date` date NOT NULL,
  `driver` varchar(100) NOT NULL,
  `vehicle` varchar(50) NOT NULL,
  `destination` varchar(150) NOT NULL,
  `jo_no` varchar(50) NOT NULL,
  `total_exp` decimal(12,2) DEFAULT 0.00,
  `actual_liters` decimal(10,2) DEFAULT 0.00,
  `actual_amt` decimal(12,2) DEFAULT 0.00,
  `toll_amt` decimal(12,2) DEFAULT 0.00,
  `pier_amt` decimal(12,2) DEFAULT 0.00,
  `particulars` varchar(255) DEFAULT NULL,
  `particulars_amt` decimal(12,2) DEFAULT 0.00,
  `meals_amt` decimal(12,2) DEFAULT 0.00,
  `load_amt` decimal(12,2) DEFAULT 0.00,
  `contingency_amt` decimal(12,2) DEFAULT 0.00,
  `final_amt` decimal(12,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('1','2','3') NOT NULL DEFAULT '3',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `username`, `email`, `password`, `role`, `created_at`) VALUES
(1, 'James Michael', 'Solamo', 'jmsolamo', 'solamojamesmichael@gmail.com', '$2y$10$xNATEgkZE2YEeGu8gcaxEeReyfzkYoHXtR6Tn4fO.6ImJ0MB0xgOK', '1', '2026-02-10 06:32:31');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `actual_expenses`
--
ALTER TABLE `actual_expenses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `actual_expenses`
--
ALTER TABLE `actual_expenses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
