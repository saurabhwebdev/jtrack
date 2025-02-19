-- Enable the UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create a function to validate salary_range JSON
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

-- Create applications table
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    position_title TEXT NOT NULL,
    application_date DATE NOT NULL,
    application_source TEXT NOT NULL CHECK (
        application_source IN ('LINKEDIN', 'COMPANY_WEBSITE', 'JOB_BOARD', 'REFERRAL', 'OTHER')
    ),
    job_description TEXT,
    status TEXT NOT NULL CHECK (
        status IN ('DRAFT', 'APPLIED', 'INTERVIEWING', 'REJECTED', 'OFFERED', 'ACCEPTED', 'WITHDRAWN')
    ),
    salary_range JSONB CHECK (
        salary_range IS NULL OR validate_salary_range(salary_range)
    ),
    location TEXT,
    job_type TEXT CHECK (
        job_type IN ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP')
    ),
    work_mode TEXT CHECK (
        work_mode IN ('REMOTE', 'HYBRID', 'ON_SITE')
    ),
    notes TEXT,
    next_step TEXT,
    next_step_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create interviews table
CREATE TABLE interviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    round_number INTEGER NOT NULL,
    interview_date TIMESTAMPTZ NOT NULL,
    interview_type TEXT NOT NULL CHECK (
        interview_type IN ('PHONE', 'VIDEO', 'ON_SITE', 'TECHNICAL', 'BEHAVIORAL')
    ),
    interviewer_name TEXT,
    interviewer_title TEXT,
    status TEXT NOT NULL CHECK (
        status IN ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED')
    ),
    feedback TEXT,
    next_steps TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create referrals table
CREATE TABLE referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    referrer_name TEXT NOT NULL,
    referrer_email TEXT,
    referrer_phone TEXT,
    relationship TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all tables
CREATE TRIGGER update_applications_updated_at
    BEFORE UPDATE ON applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interviews_updated_at
    BEFORE UPDATE ON interviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_referrals_updated_at
    BEFORE UPDATE ON referrals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create RLS (Row Level Security) policies
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- Applications policies
CREATE POLICY "Users can view their own applications"
    ON applications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own applications"
    ON applications FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications"
    ON applications FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own applications"
    ON applications FOR DELETE
    USING (auth.uid() = user_id);

-- Interviews policies
CREATE POLICY "Users can view interviews for their applications"
    ON interviews FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM applications
        WHERE applications.id = interviews.application_id
        AND applications.user_id = auth.uid()
    ));

CREATE POLICY "Users can insert interviews for their applications"
    ON interviews FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM applications
        WHERE applications.id = interviews.application_id
        AND applications.user_id = auth.uid()
    ));

CREATE POLICY "Users can update interviews for their applications"
    ON interviews FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM applications
        WHERE applications.id = interviews.application_id
        AND applications.user_id = auth.uid()
    ));

CREATE POLICY "Users can delete interviews for their applications"
    ON interviews FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM applications
        WHERE applications.id = interviews.application_id
        AND applications.user_id = auth.uid()
    ));

-- Referrals policies
CREATE POLICY "Users can view referrals for their applications"
    ON referrals FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM applications
        WHERE applications.id = referrals.application_id
        AND applications.user_id = auth.uid()
    ));

CREATE POLICY "Users can insert referrals for their applications"
    ON referrals FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM applications
        WHERE applications.id = referrals.application_id
        AND applications.user_id = auth.uid()
    ));

CREATE POLICY "Users can update referrals for their applications"
    ON referrals FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM applications
        WHERE applications.id = referrals.application_id
        AND applications.user_id = auth.uid()
    ));

CREATE POLICY "Users can delete referrals for their applications"
    ON referrals FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM applications
        WHERE applications.id = referrals.application_id
        AND applications.user_id = auth.uid()
    )); 