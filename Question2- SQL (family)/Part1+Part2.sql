create database Family_relations;
use Family_relations;
-- create the People table
CREATE TABLE People (
    Person_Id INT PRIMARY KEY,
    First_Name VARCHAR(50),
    Last_Name VARCHAR(50),
    Gender CHAR(1), -- 'M' or 'F'
    Father_Id INT,
    Mother_Id INT,
    Spouse_Id INT
);
-- create the Family_Relations table with unique constraint
CREATE TABLE Family_Relations (
    Person_Id INT,
    Relative_Id INT,
    Connection_Type VARCHAR(20),
    UNIQUE (Person_Id, Relative_Id, Connection_Type),
	FOREIGN KEY (Person_Id) REFERENCES People(Person_Id),
    FOREIGN KEY (Relative_Id) REFERENCES People(Person_Id)
);
-- Set the delimiter to define the boundaries of the trigger.
DELIMITER $$

-- Create a trigger that automatically updates the 'Family_Relations' table after a new person is inserted into the 'People' table.
CREATE TRIGGER after_person_insert
AFTER INSERT ON People
FOR EACH ROW
BEGIN
    -- Check if the new person has a mother listed.
    IF NEW.Mother_Id IS NOT NULL THEN
        -- Insert a record into 'Family_Relations' indicating the new person's mother.
        INSERT IGNORE INTO Family_Relations (Person_Id, Relative_Id, Connection_Type)
        VALUES (NEW.Person_Id, NEW.Mother_Id, 'Mother');

        -- Insert a record indicating the mother's relationship to the new person.
        INSERT IGNORE INTO Family_Relations (Person_Id, Relative_Id, Connection_Type)
        VALUES (
            NEW.Mother_Id,
            NEW.Person_Id,
            CASE NEW.Gender
                WHEN 'M' THEN 'Son'
                WHEN 'F' THEN 'Daughter'
            END
        );
    END IF;

    -- Check if the new person has a father listed.
    IF NEW.Father_Id IS NOT NULL THEN
        -- Insert a record into 'Family_Relations' indicating the new person's father.
        INSERT IGNORE INTO Family_Relations (Person_Id, Relative_Id, Connection_Type)
        VALUES (NEW.Person_Id, NEW.Father_Id, 'Father');

        -- Insert a record indicating the father's relationship to the new person.
        INSERT IGNORE INTO Family_Relations (Person_Id, Relative_Id, Connection_Type)
        VALUES (
            NEW.Father_Id,
            NEW.Person_Id,
            CASE NEW.Gender
                WHEN 'M' THEN 'Son'
                WHEN 'F' THEN 'Daughter'
            END
        );
    END IF;

    -- Check if the new person has a spouse listed.
    IF NEW.Spouse_Id IS NOT NULL THEN
        -- Insert a record into 'Family_Relations' indicating the new person's spouse.
        INSERT IGNORE INTO Family_Relations (Person_Id, Relative_Id, Connection_Type)
        VALUES (NEW.Person_Id, NEW.Spouse_Id, 'Spouse');

        -- Insert a record indicating the spouse's relationship to the new person.
        INSERT IGNORE INTO Family_Relations (Person_Id, Relative_Id, Connection_Type)
        VALUES (NEW.Spouse_Id, NEW.Person_Id, 'Spouse');
    END IF;

    -- Handle sibling relationships by identifying individuals with the same mother or father.
    INSERT IGNORE INTO Family_Relations (Person_Id, Relative_Id, Connection_Type)
    SELECT
        NEW.Person_Id,
        p.Person_Id,
        CASE p.Gender
            WHEN 'M' THEN 'Brother'
            WHEN 'F' THEN 'Sister'
        END
    FROM People p
    WHERE p.Person_Id != NEW.Person_Id
      AND (
            (p.Father_Id IS NOT NULL AND p.Father_Id = NEW.Father_Id)
         OR (p.Mother_Id IS NOT NULL AND p.Mother_Id = NEW.Mother_Id)
      );

    -- Ensure that existing siblings recognize the new person as their sibling.
    INSERT IGNORE INTO Family_Relations (Person_Id, Relative_Id, Connection_Type)
    SELECT
        p.Person_Id,
        NEW.Person_Id,
        CASE NEW.Gender
            WHEN 'M' THEN 'Brother'
            WHEN 'F' THEN 'Sister'
        END
    FROM People p
    WHERE p.Person_Id != NEW.Person_Id
      AND (
            (p.Father_Id IS NOT NULL AND p.Father_Id = NEW.Father_Id)
         OR (p.Mother_Id IS NOT NULL AND p.Mother_Id = NEW.Mother_Id)
      );
END$$

-- Reset the delimiter back to the default semicolon.
DELIMITER ;
-- Inserting people into people table. (To check if program works)
INSERT INTO People (Person_Id, First_Name, Last_Name, Gender, Father_Id, Mother_Id, Spouse_Id) VALUES
(1, 'Akiva', 'Resnick', 'M', 60, 61, 2),
(2, 'Nechama', 'Resnick', 'F', 70, 71, 1),
(3, 'Bassy', 'Resnick', 'F', 1, 2, NULL),
(4, 'Avigayil', 'Resnick', 'F', 1, 2, NULL),
(5, 'Ethan', 'Williams', 'M', NULL, NULL, 6),
(6, 'Fiona', 'Williams', 'F', NULL, NULL, 5),
(7, 'George', 'Williams', 'M', 5, 6, NULL),
(8, 'Hannah', 'Williams', 'F', 5, 6, NULL),
(9, 'Baruch', 'Resnick', 'M', 1, 2, NULL);

select * from Family_Relations;

INSERT INTO People (Person_Id, First_Name, Last_Name, Gender, Father_Id, Mother_Id, Spouse_Id) VALUES
(10, 'John', 'Smith', 'M', 20, 21, 11),
(11, 'Emily', 'Smith', 'F', 22, 23, 10),
(12, 'Michael', 'Johnson', 'M', 10, 11, 13),
(13, 'Sarah', 'Johnson', 'F', 24, 25, 12),
(14, 'James', 'Williams', 'M', NULL, NULL, 15),
(15, 'Mary', 'Williams', 'F', NULL, NULL, 14),
(16, 'Robert', 'Jones', 'M', 14, 15, NULL),
(17, 'Linda', 'Jones', 'F', 14, 15, NULL),
(18, 'David', 'Taylor', 'M', 10, 11, NULL);
select * from people;
select * from family_relations;
INSERT INTO People (Person_Id, First_Name, Last_Name, Gender, Father_Id, Mother_Id, Spouse_Id) VALUES
(19, 'Sara', 'Zinkin', 'F', 65, 66, NULL),
(20, 'Dan', 'Smith', 'M', 67, 68, NULL),
(21, 'Elizabeth', 'Smith', 'F', 65, 66, 20),
(22, 'joe', 'Sandors', 'F', NULL, NULL, 23),
(23, 'jen', 'Sandors', 'M', NULL, NULL, NULL);
select * from people;
-- step 2: make sure both partners have each other listed as spouse (complete partial data)
-- for each person with a spouse, if the spouse doesn't list them back, add it
UPDATE People AS p1
JOIN People AS p2 ON p1.Spouse_Id = p2.Person_Id
SET p2.Spouse_Id = p1.Person_Id
WHERE p2.Spouse_Id IS NULL;
select * from people;
-- and now add the missing side to Family_Relations if needed
INSERT IGNORE INTO Family_Relations (Person_Id, Relative_Id, Connection_Type)
SELECT p2.Person_Id, p1.Person_Id, 'Spouse'
FROM People p1
JOIN People p2 ON p1.Spouse_Id = p2.Person_Id
WHERE p2.Spouse_Id = p1.Person_Id;
select * from family_relations;


