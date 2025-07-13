-- Temporäre RLS Policies für Development (ohne Authentifizierung)
-- Führen Sie diese Befehle zusätzlich aus, falls Sie noch keine Auth haben

-- Lösche die bestehenden Policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON customers;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON customers;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON customers;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON customers;

-- Erstelle neue Policies für anon Zugriff (nur für Development!)
CREATE POLICY "Enable read access for anon users" ON customers
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for anon users" ON customers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for anon users" ON customers
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for anon users" ON customers
    FOR DELETE USING (true);
