-- insert the following new record to the account table
-- Tony, Stark, tony@starkent.com, Iam1ronM@n
insert into public.account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
values (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
-- Modify the Tony Stark record to change the account_type to "Admin".
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = '1';
-- Delete the Tony Stark record from the database
DELETE FROM public.account
WHERE account_id = 1;
-- Modify the "GM Hummer" record to read "a huge interior" rather than "small interiors" 
UPDATE public.inventory
SET inv_description = REPLACE(
        inv_description,
        'small interiors',
        'a huge interior'
    )
WHERE inv_id = 10;
--Use an inner join to select the make and model fields from the inventory table and
-- the classification name field from the classification table for inventory items that
-- belong to the "Sport" category.
-- Two records should be returned as a result of the query.
SELECT inventory.inv_make,
    inventory.inv_model,
    classification.classification_name
FROM inventory
    JOIN classification ON inventory.classification_id = classification.classification_id
WHERE classification.classification_name = 'Sport';
-- Update all records in the inventory table to add "/vehicles" to the middle of the file
-- path in the inv_image and inv_thumbnail columns using a single query.
-- When done the path for both inv_image and inv_thumbnail should resemble this example: /images/vehicles/a-car-name.jpg
-- UPDATE public.inventory
-- SET inv_image = REPLACE(inv_image, '/images', '/images/vehicles'),
--     inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles');