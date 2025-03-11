/*
  # Vocabulary App Schema

  1. New Tables
    - `vocabulary_items`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `word` (text)
      - `meaning` (text)
      - `notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on vocabulary_items table
    - Add policies for CRUD operations
*/

CREATE TABLE vocabulary_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  word text NOT NULL,
  meaning text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE vocabulary_items ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own vocabulary items
CREATE POLICY "Users can read own vocabulary items"
  ON vocabulary_items
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to insert their own vocabulary items
CREATE POLICY "Users can insert own vocabulary items"
  ON vocabulary_items
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own vocabulary items
CREATE POLICY "Users can update own vocabulary items"
  ON vocabulary_items
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own vocabulary items
CREATE POLICY "Users can delete own vocabulary items"
  ON vocabulary_items
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);