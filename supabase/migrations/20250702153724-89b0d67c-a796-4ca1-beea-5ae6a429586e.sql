
-- Add category and subcategory fields to the workbodies table
ALTER TABLE public.workbodies 
ADD COLUMN category text,
ADD COLUMN subcategory text;

-- Update existing workbodies with their categories and subcategories based on naming patterns
-- Executive category
UPDATE public.workbodies 
SET category = 'Executive'
WHERE name ILIKE '%governing body%' OR name ILIKE '%management committee%';

-- Regulations category with subcategories
UPDATE public.workbodies 
SET category = 'Regulations', subcategory = 'EC'
WHERE name ILIKE '%examination committee%' OR name ILIKE '%ec %' OR name = 'EC';

UPDATE public.workbodies 
SET category = 'Regulations', subcategory = 'ESC'
WHERE name ILIKE '%engineering services committee%' OR name ILIKE '%esc %' OR name ILIKE '%esc (%';

UPDATE public.workbodies 
SET category = 'Regulations', subcategory = 'EAB'
WHERE name ILIKE '%engineering accreditation board%' OR name ILIKE '%eab %' OR name ILIKE '%vcc%' OR name ILIKE '%apmc%' OR name ILIKE '%amrc%' OR name ILIKE '%manual%revision%';

UPDATE public.workbodies 
SET category = 'Regulations', subcategory = 'EPDC'
WHERE name ILIKE '%engineering practices%' OR name ILIKE '%epdc %' OR name ILIKE '%cpd policy%' OR name ILIKE '%tf-cpd%';

UPDATE public.workbodies 
SET category = 'Regulations', subcategory = 'A&BC'
WHERE name ILIKE '%appeals%' OR name ILIKE '%bylaws%' OR name ILIKE '%a&bc%';

UPDATE public.workbodies 
SET category = 'Regulations', subcategory = 'QEC'
WHERE name ILIKE '%quality enhancement%' OR name ILIKE '%qec %';

-- Operations category with subcategories
UPDATE public.workbodies 
SET category = 'Operations', subcategory = 'WG-PECIR'
WHERE name ILIKE '%pec information repository%' OR name ILIKE '%wg-pecir%';

UPDATE public.workbodies 
SET category = 'Operations', subcategory = 'WG-PECADM'
WHERE name ILIKE '%pec administration%' OR name ILIKE '%wg-pecadm%' OR name ILIKE '%tf-r/o%' OR name ILIKE '%prequalification%' OR name ILIKE '%interior design%';

UPDATE public.workbodies 
SET category = 'Operations', subcategory = 'CPC'
WHERE name ILIKE '%central procurement%' OR name ILIKE '%cpc %';

-- Corporate Affairs category with subcategories
UPDATE public.workbodies 
SET category = 'Corporate Affairs', subcategory = 'Think Tank'
WHERE name ILIKE '%think tank%' OR name ILIKE '%technical codes%' OR name ILIKE '%standards%';

UPDATE public.workbodies 
SET category = 'Corporate Affairs', subcategory = 'WG-PSII'
WHERE name ILIKE '%power sector%' OR name ILIKE '%wg-psii%' OR name ILIKE '%tf-power%';

UPDATE public.workbodies 
SET category = 'Corporate Affairs', subcategory = 'WG-YEA'
WHERE name ILIKE '%young engineers%' OR name ILIKE '%wg-yea%';

UPDATE public.workbodies 
SET category = 'Corporate Affairs', subcategory = 'WG-CID'
WHERE name ILIKE '%corporate%' AND name ILIKE '%industrial%' OR name ILIKE '%wg-cid%';

UPDATE public.workbodies 
SET category = 'Corporate Affairs', subcategory = 'WG-IALD'
WHERE name ILIKE '%international affairs%' OR name ILIKE '%linkages%' OR name ILIKE '%wg-iald%';

UPDATE public.workbodies 
SET category = 'Corporate Affairs', subcategory = 'IPEA-Monitoring'
WHERE name ILIKE '%independent power%' OR name ILIKE '%evaluation%' OR name ILIKE '%assessment%' OR name ILIKE '%ipea%';

-- Special Initiatives category
UPDATE public.workbodies 
SET category = 'Special Initiatives', subcategory = 'GET Steering Groups'
WHERE name ILIKE '%special initiatives%' OR name ILIKE '%get steering%' OR name ILIKE '%steering groups%';

-- Set default category for any remaining workbodies
UPDATE public.workbodies 
SET category = 'Corporate Affairs'
WHERE category IS NULL;
