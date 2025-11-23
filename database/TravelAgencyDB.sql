create database TravelAgencyDB;

use travelagencyDB;

create table users (
    UserId int auto_increment primary key,
    Name varchar(20),
    Email varchar(20),
    Password varchar(15),
    Role enum('Customer', 'Staff', 'Admin'),
    ContactNumber varchar(10),
    IDProof varchar(20)
);

INSERT INTO Users (Name, Email, Password, Role, ContactNumber, IDProof) VALUES
('Rohan Gupta', 'rohan@example.com', 'rohan456', 'Customer', '9876543211', 'ID67890'),
('Priya Das', 'priya@example.com', 'priya789', 'Customer', '9876501235', 'ID09876'),
('Vikram Reddy', 'vikram@example.com', 'vikram101', 'Staff', '9876512346', NULL),
('Sunita Patel', 'sunita@example.com', 'sunita202', 'Customer', '9876523457', 'ID11223'),
('Anjali Rao', 'anjali@example.com', 'anjali303', 'Customer', '9876534568', 'ID33445'),
('Rajesh Verma', 'rajesh@example.com', 'rajesh404', 'Staff', '9876545679', NULL),
('Deepika Joshi', 'deepika@example.com', 'deepika505', 'Customer', '9876556780', 'ID55667');

select * from Users;

create table Flights (
    FlightId int auto_increment primary key,
    Airline varchar(15),
    Source varchar(30),
    Destination varchar(30),
    DepartureDate date,
    DepartureTime time,
    ArrivalDate date,
    ArrivalTime time,
    price decimal(10, 2),
    TotalSeats int,
    AvailableSeats int
);

INSERT INTO Flights (Airline, Source, Destination, DepartureDate, DepartureTime, ArrivalDate, ArrivalTime, Price, TotalSeats, AvailableSeats) VALUES
('Vistara','Bangalore','Mumbai','2025-10-05','14:00:00','2025-10-05','15:45:00',4800.00,180,180),
('SpiceJet','Chennai','Delhi','2025-10-07','20:15:00','2025-10-07','23:00:00',5500.00,160,160),
('AirAsia India','Kolkata','Hyderabad','2025-10-08','06:45:00','2025-10-08','08:30:00',4200.00,170,170),
('Indigo','Delhi','Pune','2025-10-08','17:00:00','2025-10-08','19:05:00',4600.00,150,150),
('Air India','Bangalore','Kolkata','2025-10-09','11:20:00','2025-10-09','14:00:00',6200.00,140,140),
('Vistara','Mumbai','Chennai','2025-10-10','19:00:00','2025-10-10','21:00:00',4950.00,180,180),
('SpiceJet','Goa','Delhi','2025-10-11','13:10:00','2025-10-11','15:50:00',5800.00,160,160);

select * from Flights;

create table hotels (
    HotelId int auto_increment primary key,
    Name varchar(100),
    Location varchar(100),
    Amenities varchar(200),
    RoomTypes varchar(50),
    PricePerNight decimal(10, 2),
    TotalRooms int,
    AvailableRooms int
);

INSERT INTO Hotels (Name, Location, Amenities, RoomTypes, PricePerNight, TotalRooms, AvailableRooms) VALUES
('The Oberoi','Delhi','Wifi,Spa,Gym,Pool,Restaurant','Deluxe,Suite,Presidential Suite',8500.00,100,100),
('ITC Maurya','Delhi','Wifi,Gym,Restaurant,Bar','Single,Double,Executive',7200.00,80,80),
('Lemon Tree Premier','Mumbai','Wifi,Pool,Restaurant','Single,Double',5500.00,60,60),
('Radisson Blu','Chennai','Wifi,Pool,Gym,Spa','Double,Suite',6800.00,75,75),
('The Zuri Whitefield','Bangalore','Wifi,Pool,Spa,Restaurant','Single,Double,Club',5200.00,90,90),
('Hyatt Regency','Kolkata','Wifi,Gym,Pool','King,Queen,Suite',6500.00,120,120),
('Trident Hotel','Hyderabad','Wifi,Restaurant,Pool','Deluxe,Premier',5800.00,110,110);

select * from hotels;

create table TourPackages (
    PackageId int auto_increment primary key,
    Name varchar(100),
    Description TEXT,
    Includes varchar(255),
    DurationDays int,
    Price Decimal(10, 2),
    Availability int
);

INSERT INTO TourPackages (Name, Description, Includes, DurationDays, Price, Availability) VALUES
('Golden Triangle Tour','Classic tour of Delhi, Agra, and Jaipur','Hotel+Sightseeing+Transport',5,25000.00,30),
('Kerala Backwaters Bliss','Experience the serene backwaters of Alleppey','Flight+Hotel+Houseboat+Meals',4,22000.00,25),
('Mumbai City of Dreams','A vibrant tour of Mumbai''s landmarks','Hotel+Sightseeing',3,12000.00,40),
('Himalayan Heights','Scenic tour of Shimla and Manali','Flight+Hotel+Transport+Sightseeing',7,35000.00,10),
('Rajasthan Royal Tour','Explore the royal forts of Rajasthan','Hotel+Transport+Sightseeing+Guide',6,30000.00,18),
('Spiritual Varanasi','A spiritual journey through the ghats of Varanasi','Hotel+Sightseeing+BoatRide',3,14000.00,22),
('Kolkata Cultural Trip','Explore the City of Joy','Flight+Hotel+Sightseeing',3,16000.00,35);

create table Bookings (
    BookingId int auto_increment primary key,
    UserId int,
    BookingType ENUM('Flight', 'Hotel', 'Package'),
    ServiceId int,
    BookingDate date,
    TravelDate date,
    Status ENUM('Pending', 'Confirmed', 'Cancelled', 'Completed'),
    NumberOfTravellers int,
    foreign key (UserId) references Users(UserId)
);

INSERT INTO Bookings (UserID, BookingType, ServiceID, BookingDate, TravelDate, Status, NumberOfTravellers) VALUES
(4,'Flight',3,'2025-09-30','2025-10-05','Confirmed',2),
(5,'Hotel',3,'2025-09-30','2025-10-07','Confirmed',1),
(6,'Package',2,'2025-09-30','2025-10-15','Pending',4),
(7,'Flight',5,'2025-09-30','2025-10-09','Confirmed',1),
(1,'Flight',4,'2025-09-30','2025-10-07','Cancelled',2),
(2,'Hotel',1,'2025-09-30','2025-10-05','Confirmed',2),
(5,'Package',4,'2025-09-30','2025-11-01','Confirmed',1);

select * from bookings;

create table Payments (
    PaymentId int auto_increment primary key,
    BookingId int,
    Amount Decimal(10, 2),
    PaymentDate date,
    PaymentMethod enum('Card', 'NetBanking', 'UPI', 'Wallet'),
    Status enum('Pending', 'Completed', 'Failed'),
    Foreign key(BookingId) references Bookings(BookingId)
);

INSERT INTO Payments (BookingId, Amount, PaymentDate, PaymentMethod, Status) VALUES
(1, 9600.00, '2025-09-30', 'Card', 'Completed'),
(2, 8500.00, '2025-09-30', 'Wallet', 'Completed'),
(3, 30000.00, '2025-09-30', 'NetBanking', 'Pending'),
(4, 8400.00, '2025-09-30', 'Card', 'Completed'),
(5, 11000.00, '2025-09-30', 'UPI', 'Completed'),
(6, 4000.00, '2025-09-30', 'Card', 'Completed'),
(7, 22000.00, '2025-09-30', 'NetBanking', 'Completed');

select * from payments;

DELIMITER //
CREATE TRIGGER reduce_availability
AFTER INSERT ON Bookings
FOR EACH ROW
BEGIN
    IF NEW.BookingType = 'Flight' THEN
        UPDATE Flights
        SET AvailableSeats = AvailableSeats - NEW.NumberOfTravellers
        WHERE FlightID = NEW.ServiceID;
    ELSEIF NEW.BookingType = 'Hotel' THEN
        UPDATE Hotels
        SET AvailableRooms = AvailableRooms - NEW.NumberOfTravellers
        WHERE HotelID = NEW.ServiceID;
    ELSEIF NEW.BookingType = 'Package' THEN
        UPDATE TourPackages
        SET Availability = Availability - NEW.NumberOfTravellers
        WHERE PackageID = NEW.ServiceID;
    END IF;
END;
//
DELIMITER ;

CREATE VIEW AvailableFlights AS
SELECT Airline, Source, Destination, DepartureDate, DepartureTime, ArrivalDate, ArrivalTime, Price, AvailableSeats
FROM Flights
WHERE AvailableSeats > 0;

select * from AvailableFlights;

DELIMITER //

CREATE PROCEDURE GetAvailableSeats(IN flightID INT)
BEGIN
    SELECT FlightID, Airline, AvailableSeats
    FROM Flights
    WHERE FlightID = flightID;
END;
// DELIMITER ;

CALL GetAvailableSeats(1);

commit;
