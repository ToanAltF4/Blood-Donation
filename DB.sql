USE blooddonation;
drop table User;
drop table Event;
drop table Emergency;
drop table Event_Report;
drop table History;
drop table Unit_of_Blood;
drop table Post;
drop table ListPrepare;
drop table List_Reg;



CREATE TABLE User (
    User_ID INT AUTO_INCREMENT PRIMARY KEY,
    Full_Name VARCHAR(100),
    CCCD VARCHAR(20),
    Phone VARCHAR(15),
    Email VARCHAR(100),
    Password VARCHAR(255),
    Location VARCHAR(50),
    Role VARCHAR(20),
    Blood VARCHAR(3),
    Date_of_birth DATETIME,
    Family_contact VARCHAR(15)
);
CREATE TABLE Event (
    Event_ID INT AUTO_INCREMENT PRIMARY KEY,
    User_ID INT,
    FOREIGN KEY (User_ID) REFERENCES User(User_ID),
    Name_Event VARCHAR(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    Location VARCHAR(50),
    Time_Start DATETIME,
    Time_End DATETIME,
    Content TEXT,
    Status VARCHAR(50),
    Count_Reg INT
);
CREATE TABLE Event_Report (
    Report_ID INT AUTO_INCREMENT PRIMARY KEY,
    Time_Report DATETIME,
    Event_ID INT,
    FOREIGN KEY (Event_ID) REFERENCES Event(Event_ID)
);
CREATE TABLE List_Reg (
    List_ID INT AUTO_INCREMENT PRIMARY KEY,
    Event_ID INT,
    User_ID INT,
    FOREIGN KEY (Event_ID) REFERENCES Event(Event_ID),
    FOREIGN KEY (User_ID) REFERENCES User(User_ID)
);
CREATE TABLE ListPrepare (
    ListPrepare_ID INT AUTO_INCREMENT PRIMARY KEY,
    User_ID INT,
    FOREIGN KEY (User_ID) REFERENCES User(User_ID)
);
CREATE TABLE Post (
    Post_ID INT AUTO_INCREMENT PRIMARY KEY,
    Post_Content TEXT,
    Post_Time DATETIME,
    User_ID INT,
    FOREIGN KEY (User_ID) REFERENCES User(User_ID)
);
CREATE TABLE Emergency (
    Emergency_ID INT AUTO_INCREMENT PRIMARY KEY,
    Location VARCHAR(50),
    Blood_need VARCHAR(3),
    Status VARCHAR(30),
    User_ID INT,
    FOREIGN KEY (User_ID) REFERENCES User(User_ID)
);
CREATE TABLE Unit_of_Blood (
    Blood_ID INT AUTO_INCREMENT PRIMARY KEY,
    Unit_Blood VARCHAR(20),
    Donate_Time DATETIME,
    Used_Status BOOLEAN,
    Volume INT,
    User_ID INT,
    Event_ID INT,
    FOREIGN KEY (User_ID) REFERENCES User(User_ID),
    FOREIGN KEY (Event_ID) REFERENCES Event(Event_ID)
);
CREATE TABLE History (
    history_ID INT AUTO_INCREMENT PRIMARY KEY,
    Blood_ID INT,
    User_ID INT,
    FOREIGN KEY (Blood_ID) REFERENCES Unit_of_Blood(Blood_ID),
    FOREIGN KEY (User_ID) REFERENCES User(User_ID)
);


-- INSERT INTO User (
--     Full_Name,
--     CCCD,
--     Phone,
--     Email,
--     Password,
--     Role,
--     Blood,
--     Date_of_birth,
--     Family_contact
-- ) VALUES (
--     'Nguyen Van A',
--     '012345678901',
--     '0987654321',
--     'nguyenvana@example.com',
--     '123456',             -- Bạn nên mã hóa mật khẩu trong thực tế
--     'Member',
--     'O+',
--     '2000-01-15',
--     '0988888888'
-- );
-- drop table User


