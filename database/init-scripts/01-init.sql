-- Enable dblink extension
CREATE EXTENSION IF NOT EXISTS dblink;

-- Create antimemetics_base if not exists
DO
$$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'antimemetics_base') THEN
      PERFORM dblink_exec('dbname=postgres user=postgres password=postgres123', 'CREATE DATABASE antimemetics_base');
   END IF;
END
$$;

-- Create antimemetics_messenger if not exists
DO
$$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'antimemetics_messenger') THEN
      PERFORM dblink_exec('dbname=postgres user=postgres password=postgres123', 'CREATE DATABASE antimemetics_messenger');
   END IF;
END
$$;