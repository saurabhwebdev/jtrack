-- Create the validation function if it doesn't exist
CREATE OR REPLACE FUNCTION validate_salary_range(salary JSONB)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if the required fields exist and have correct types
  IF NOT (
    salary ? 'min' AND 
    salary ? 'max' AND 
    salary ? 'currency' AND 
    salary ? 'period' AND
    (salary->>'min')::numeric >= 0 AND
    (salary->>'max')::numeric >= 0 AND
    salary->>'currency' IN ('USD', 'EUR', 'GBP', 'INR', 'CAD') AND
    salary->>'period' IN ('YEARLY', 'MONTHLY', 'HOURLY')
  ) THEN
    RETURN FALSE;
  END IF;
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Drop existing check constraint if it exists
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'applications_salary_range_check'
    AND table_name = 'applications'
  ) THEN
    ALTER TABLE applications DROP CONSTRAINT applications_salary_range_check;
  END IF;
END $$;

-- Add new check constraint
ALTER TABLE applications
ADD CONSTRAINT applications_salary_range_check
CHECK (salary_range IS NULL OR validate_salary_range(salary_range));

-- Update any existing invalid salary_range data
UPDATE applications
SET salary_range = jsonb_build_object(
  'min', COALESCE((salary_range->>'min')::numeric, 0),
  'max', COALESCE((salary_range->>'max')::numeric, 0),
  'currency', COALESCE(
    CASE 
      WHEN salary_range->>'currency' IN ('USD', 'EUR', 'GBP', 'INR', 'CAD') 
      THEN salary_range->>'currency'
      ELSE 'USD'
    END,
    'USD'
  ),
  'period', COALESCE(
    CASE 
      WHEN salary_range->>'period' IN ('YEARLY', 'MONTHLY', 'HOURLY') 
      THEN salary_range->>'period'
      ELSE 'YEARLY'
    END,
    'YEARLY'
  )
)
WHERE salary_range IS NOT NULL
AND NOT validate_salary_range(salary_range); 