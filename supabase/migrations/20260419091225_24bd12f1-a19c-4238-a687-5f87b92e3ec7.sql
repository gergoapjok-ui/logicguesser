-- Fix send_notification_email: use pg_net (net.http_post) instead of non-existent extensions.http_post
CREATE OR REPLACE FUNCTION public.send_notification_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_email text;
  email_enabled boolean;
  email_url text := 'https://gkglmxjpdlvzlhronrjj.supabase.co/functions/v1/send-transactional-email';
  service_key text;
  cta_url text := 'https://logicguesser.com';
  cta_label text := 'Open LogicGuesser';
  emoji text := '⚡';
BEGIN
  SELECT COALESCE(s.email_notifications_enabled, false)
    INTO email_enabled
  FROM public.user_settings s
  WHERE s.user_id = NEW.user_id;

  IF email_enabled IS NOT TRUE THEN
    RETURN NEW;
  END IF;

  SELECT u.email INTO user_email FROM auth.users u WHERE u.id = NEW.user_id;
  IF user_email IS NULL THEN RETURN NEW; END IF;

  IF NEW.type = 'friend_request' THEN
    cta_url := 'https://logicguesser.com/friends'; cta_label := 'View request'; emoji := '👥';
  ELSIF NEW.type = 'friend_accept' THEN
    cta_url := 'https://logicguesser.com/friends'; cta_label := 'View friends'; emoji := '🤝';
  ELSIF NEW.type = 'battle_invite' THEN
    cta_url := COALESCE('https://logicguesser.com/battle/' || (NEW.data->>'battle_id'), 'https://logicguesser.com/lobbies');
    cta_label := 'Join battle'; emoji := '⚔️';
  ELSIF NEW.type = 'credit_reward' THEN
    cta_url := 'https://logicguesser.com/profile'; cta_label := 'See your credits'; emoji := '🪙';
  END IF;

  BEGIN
    SELECT decrypted_secret INTO service_key
    FROM vault.decrypted_secrets WHERE name = 'email_queue_service_role_key' LIMIT 1;
  EXCEPTION WHEN OTHERS THEN service_key := NULL; END;

  IF service_key IS NULL THEN
    RAISE WARNING 'send_notification_email: vault secret missing';
    RETURN NEW;
  END IF;

  PERFORM net.http_post(
    url := email_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || service_key
    ),
    body := jsonb_build_object(
      'templateName', 'game-notification',
      'recipientEmail', user_email,
      'idempotencyKey', 'notif-' || NEW.id::text,
      'templateData', jsonb_build_object(
        'title', NEW.title,
        'body', NEW.body,
        'ctaUrl', cta_url,
        'ctaLabel', cta_label,
        'emoji', emoji
      )
    )
  );

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'send_notification_email failed: %', SQLERRM;
  RETURN NEW;
END;
$function$;