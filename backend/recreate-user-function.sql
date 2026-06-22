-- Drop and recreate the function cleanly
DROP FUNCTION IF EXISTS create_new_user(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, INTEGER);
DROP FUNCTION IF EXISTS create_new_user(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, INT4);

CREATE OR REPLACE FUNCTION create_new_user(
  p_username TEXT,
  p_full_name TEXT,
  p_email TEXT,
  p_phone TEXT,
  p_password_hash TEXT,
  p_wallet_password_hash TEXT,
  p_reference_code TEXT,
  p_referrer_id INTEGER DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id INTEGER;
  v_wallet_exists BOOLEAN;
BEGIN
  -- Insert user
  INSERT INTO users (
    username, full_name, email, phone, password_hash, wallet_password_hash,
    reference_code, referrer_id, tier_id, credibility, min_withdrawal, max_withdrawal,
    user_status, wallet_status, user_type, total_orders, created_at
  ) VALUES (
    p_username, p_full_name, p_email, p_phone, p_password_hash, p_wallet_password_hash,
    p_reference_code, p_referrer_id, 1, 100, 50.00, 500.00,
    'Active', 'Deactivate', 'User', 0, NOW()
  ) RETURNING id INTO v_user_id;

  -- Check if wallet already exists for this user (safety check)
  SELECT EXISTS(SELECT 1 FROM wallets WHERE user_id = v_user_id) INTO v_wallet_exists;

  IF NOT v_wallet_exists THEN
    INSERT INTO wallets (user_id, balance, total_recharged, total_earned, total_withdrawn, updated_at)
    VALUES (v_user_id, 0.00, 0.00, 0.00, 0.00, NOW());
  END IF;

  RETURN json_build_object(
    'id', v_user_id,
    'username', p_username,
    'email', p_email,
    'full_name', p_full_name,
    'reference_code', p_reference_code,
    'user_type', 'User'
  );
END;
$$;

GRANT EXECUTE ON FUNCTION create_new_user(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, INTEGER) TO service_role;
GRANT EXECUTE ON FUNCTION create_new_user(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION create_new_user(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, INTEGER) TO anon;
