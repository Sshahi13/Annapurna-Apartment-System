-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 19, 2026 at 12:08 PM
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
-- Database: `appartment`
--

-- --------------------------------------------------------

--
-- Table structure for table `contact`
--

CREATE TABLE `contact` (
  `id` int(10) UNSIGNED NOT NULL,
  `fullname` varchar(100) DEFAULT NULL,
  `phoneno` int(10) DEFAULT NULL,
  `email` text DEFAULT NULL,
  `cdate` date DEFAULT NULL,
  `approval` varchar(12) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `contact`
--

INSERT INTO `contact` (`id`, `fullname`, `phoneno`, `email`, `cdate`, `approval`) VALUES
(1, 'Sashank  Shahi', 2147483647, 'sashank.shahi@nayacode.com.np', '2026-02-05', 'Not Allowed'),
(2, 'Lamar Workman', 1, 'batesaqasi@mailinator.com', '2026-02-16', 'Not Allowed');

-- --------------------------------------------------------

--
-- Table structure for table `gallery`
--

CREATE TABLE `gallery` (
  `id` int(11) NOT NULL,
  `image` varchar(255) NOT NULL,
  `title` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `gallery`
--

INSERT INTO `gallery` (`id`, `image`, `title`) VALUES
(1, '1770305712_1.jpg', '1'),
(2, '1770305720_2.jpg', '2'),
(3, '1770305730_3.jpg', '3'),
(4, '1771267506_1769012905_g6.jpg', ''),
(5, '1771267513_1769013027_g14.jpg', ''),
(6, '1771267521_g2.jpg', '');

-- --------------------------------------------------------

--
-- Table structure for table `login`
--

CREATE TABLE `login` (
  `id` int(10) UNSIGNED NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `pass` varchar(255) DEFAULT NULL,
  `phoneno` varchar(10) DEFAULT NULL,
  `fullname` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `login`
--

INSERT INTO `login` (`id`, `email`, `pass`, `phoneno`, `fullname`) VALUES
(3, 'sashankshahi@gmail.com', '$2y$10$0d.LuMFzvBKRF.2O6yJCZOtnc5AsCkulMJNwuo7qpAz//87N8MCNe', '9849787259', 'Sashank'),
(4, 'sashank.shahi@nayacode.com.np', '$2y$10$wgOF7bZwCwKueTkuJt8G5.qLN0lyTX6I2IagbKZzSbv6xp4nTW4Ki', '9849787277', 'SASHANK SHAHI');

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `p-id` int(11) NOT NULL,
  `id` int(10) UNSIGNED DEFAULT NULL,
  `title` varchar(5) DEFAULT NULL,
  `fname` varchar(30) DEFAULT NULL,
  `lname` varchar(30) DEFAULT NULL,
  `troom` varchar(30) DEFAULT NULL,
  `tbed` varchar(30) DEFAULT NULL,
  `people` int(11) DEFAULT NULL,
  `min` date DEFAULT NULL,
  `room` double(8,2) DEFAULT NULL,
  `fintot` double(8,2) DEFAULT NULL,
  `bed` double(8,2) DEFAULT NULL,
  `payment` varchar(30) DEFAULT NULL,
  `noofdays` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `payment`
--

INSERT INTO `payment` (`p-id`, `id`, `title`, `fname`, `lname`, `troom`, `tbed`, `people`, `min`, `room`, `fintot`, `bed`, `payment`, `noofdays`) VALUES
(1, 1, 'Mrs.', 'Cyrus Hogan', 'Cedric Reynolds', 'Luxury Room', 'Double', 1, '2026-02-17', 5000.00, 6000.00, 1000.00, 'Pay at the Apartment', 1),
(2, 2, 'Miss.', 'Brody Daniel', 'Jonas Kennedy', 'Room with view', 'Double', 1, '2026-02-19', 2000.00, 2400.00, 400.00, 'Pay Via Khalti', 1);

-- --------------------------------------------------------

--
-- Table structure for table `room`
--

CREATE TABLE `room` (
  `id` int(10) UNSIGNED NOT NULL,
  `room_no` varchar(11) NOT NULL,
  `type` varchar(15) DEFAULT NULL,
  `bedding` varchar(10) DEFAULT NULL,
  `place` varchar(10) DEFAULT NULL,
  `cusid` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `room`
--

INSERT INTO `room` (`id`, `room_no`, `type`, `bedding`, `place`, `cusid`) VALUES
(31, 'P1', 'Penthouse', 'Single', 'Free', 0),
(32, 'R1', 'Room with view', 'Single', 'Free', 0),
(33, 'P2', 'Penthouse', 'Double', 'Free', 0),
(34, 'R3', 'Room with view', 'Triple', 'Free', 0),
(37, 'L1', 'Luxury Room', 'Single', 'Free', 0),
(38, 'D2', 'Deluxe Room', 'Double', 'Free', 0),
(39, 'L2', 'Luxury Room', 'Double', 'NotFree', 1),
(40, 'L3', 'Luxury Room', 'Triple', 'Free', 0),
(41, 'R2', 'Room with view', 'Double', 'NotFree', 2),
(42, 'P3', 'Penthouse', 'Triple', 'Free', 0),
(43, 'D1', 'Deluxe Room', 'Single', 'Free', 0),
(44, 'D3', 'Deluxe Room', 'Triple', 'Free', 0);

-- --------------------------------------------------------

--
-- Table structure for table `roombook`
--

CREATE TABLE `roombook` (
  `id` int(11) NOT NULL,
  `Title` varchar(5) DEFAULT NULL,
  `FName` text DEFAULT NULL,
  `LName` text DEFAULT NULL,
  `Email` varchar(50) DEFAULT NULL,
  `Phone` text DEFAULT NULL,
  `TRoom` varchar(20) DEFAULT NULL,
  `Bed` varchar(10) DEFAULT NULL,
  `People` varchar(2) DEFAULT NULL,
  `Payment` varchar(15) DEFAULT NULL,
  `Movein` date DEFAULT NULL,
  `Occupancy` date DEFAULT NULL,
  `stat` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `roombook`
--

INSERT INTO `roombook` (`id`, `Title`, `FName`, `LName`, `Email`, `Phone`, `TRoom`, `Bed`, `People`, `Payment`, `Movein`, `Occupancy`, `stat`) VALUES
(1, 'Mrs.', 'Cyrus Hogan', 'Cedric Reynolds', 'hyqanasihy@mailinator.com', '+1 (135) 274-3927', 'Luxury Room', 'Double', '1', 'Pay at the Apar', '2026-02-17', '2026-02-18', 'Confirm'),
(2, 'Miss.', 'Brody Daniel', 'Jonas Kennedy', 'jizibiz@mailinator.com', '+1 (671) 585-8821', 'Room with view', 'Double', '1', 'Pay Via Khalti', '2026-02-19', '2026-02-20', 'Not Confirm');

-- --------------------------------------------------------

--
-- Table structure for table `room_prices`
--

CREATE TABLE `room_prices` (
  `id` int(11) NOT NULL,
  `troom` varchar(50) NOT NULL,
  `tbed` varchar(50) NOT NULL,
  `room_price` decimal(10,2) NOT NULL,
  `bed_price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `room_prices`
--

INSERT INTO `room_prices` (`id`, `troom`, `tbed`, `room_price`, `bed_price`) VALUES
(44, 'Deluxe Room', 'Single', 2000.00, 400.00),
(45, 'Deluxe Room', 'Double', 2500.00, 500.00),
(46, 'Deluxe Room', 'Triple', 3000.00, 600.00),
(47, 'Penthouse', 'Single', 5000.00, 1000.00),
(48, 'Penthouse', 'Double', 7000.00, 1500.00),
(49, 'Penthouse', 'Triple', 9000.00, 2000.00),
(50, 'Room with view', 'Single', 1500.00, 300.00),
(51, 'Room with view', 'Double', 2000.00, 400.00),
(52, 'Room with view', 'Triple', 2500.00, 500.00),
(53, 'Luxury Room', 'Single', 4000.00, 800.00),
(54, 'Luxury Room', 'Double', 5000.00, 1000.00),
(55, 'Luxury Room', 'Triple', 6000.00, 1200.00);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `contact`
--
ALTER TABLE `contact`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `gallery`
--
ALTER TABLE `gallery`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `login`
--
ALTER TABLE `login`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`p-id`),
  ADD KEY `id` (`id`);

--
-- Indexes for table `room`
--
ALTER TABLE `room`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cusid` (`cusid`);

--
-- Indexes for table `roombook`
--
ALTER TABLE `roombook`
  ADD PRIMARY KEY (`id`),
  ADD KEY `TRoom` (`TRoom`);

--
-- Indexes for table `room_prices`
--
ALTER TABLE `room_prices`
  ADD PRIMARY KEY (`id`),
  ADD KEY `troom` (`troom`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `contact`
--
ALTER TABLE `contact`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `gallery`
--
ALTER TABLE `gallery`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `login`
--
ALTER TABLE `login`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `p-id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `room`
--
ALTER TABLE `room`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `roombook`
--
ALTER TABLE `roombook`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `room_prices`
--
ALTER TABLE `room_prices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
