CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

---- WORK TYPE -----

INSERT INTO "WorkType" ("id", "name", "weeklyHour", "monday", "tuesday", "wednesday", "thursday", "friday")
    VALUES ('91fcf463-7e21-48c3-aced-3bda280fcdb0', 'developper', '37', '7.5', '7.5', '7.5', '7.5', '7');

---- ADMIN CONFIGURATION -----

INSERT INTO "AdminConfiguration" ("id", "name", "value", "description")
    VALUES (uuid_generate_v4(), 'TimeRange', '10:00 - 16:30', 'La plage horaire pour un employé chez Idealys');

INSERT INTO "AdminConfiguration" ("id", "name", "value", "description")
    VALUES (uuid_generate_v4(), 'UpdateDelay', '2', 'Le nombre de jour minimal avant modification');

INSERT INTO "AdminConfiguration" ("id", "name", "value", "description")
    VALUES (uuid_generate_v4(), 'ParkingPlace', '7', 'Le nombre total de place de Parking disponible');

INSERT INTO "AdminConfiguration" ("id", "name", "value", "description")
    VALUES (uuid_generate_v4(), 'WorkTypeDefault', '91fcf463-7e21-48c3-aced-3bda280fcdb0', 'Le type de travail affecter par defaut');

INSERT INTO "AdminConfiguration" ("id", "name", "value", "description")
    VALUES (uuid_generate_v4(), 'OfficeDay', 'mardi', 'Le jour de présence obligatoire');


---- ROLE -----

INSERT INTO "Role" ("roleId", "roleName")
    VALUES ('2d46a6fa-2ae5-41c6-ae0e-3e6db06e9c73', 'admin');

INSERT INTO "Role" ("roleId", "roleName")
    VALUES ('5e4c1d07-f683-4e25-99a4-779a065b35ec', 'collaborateur');

INSERT INTO "Role" ("roleId", "roleName")
    VALUES ('a240df66-33ba-4e1f-8e5b-fffd92315fd9', 'superAdmin');
