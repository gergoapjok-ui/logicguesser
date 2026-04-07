ALTER TABLE public.user_settings
ADD COLUMN IF NOT EXISTS email_notifications_enabled boolean NOT NULL DEFAULT false;

CREATE OR REPLACE FUNCTION public.create_notification_if_enabled(
  _user_id uuid,
  _type text,
  _title text,
  _body text,
  _data jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  settings_row public.user_settings%ROWTYPE;
BEGIN
  SELECT *
  INTO settings_row
  FROM public.user_settings
  WHERE user_id = _user_id
  LIMIT 1;

  IF COALESCE(settings_row.notifications_enabled, true) = false THEN
    RETURN;
  END IF;

  IF _type IN ('friend_request', 'friend_accept') AND COALESCE(settings_row.notify_friend_requests, true) = false THEN
    RETURN;
  END IF;

  IF _type = 'battle_invite' AND COALESCE(settings_row.notify_battle_invites, true) = false THEN
    RETURN;
  END IF;

  IF _type = 'credit_reward' AND COALESCE(settings_row.notify_credits, true) = false THEN
    RETURN;
  END IF;

  INSERT INTO public.notifications (user_id, type, title, body, data)
  VALUES (_user_id, _type, _title, _body, COALESCE(_data, '{}'::jsonb));
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_friendship_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  requester_name text;
  addressee_name text;
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'pending' THEN
    SELECT COALESCE(username, 'Someone')
    INTO requester_name
    FROM public.profiles
    WHERE user_id = NEW.requester_id
    LIMIT 1;

    PERFORM public.create_notification_if_enabled(
      NEW.addressee_id,
      'friend_request',
      'New friend request',
      requester_name || ' sent you a friend request.',
      jsonb_build_object('friendship_id', NEW.id, 'requester_id', NEW.requester_id)
    );
  ELSIF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'accepted' THEN
    SELECT COALESCE(username, 'Someone')
    INTO addressee_name
    FROM public.profiles
    WHERE user_id = NEW.addressee_id
    LIMIT 1;

    PERFORM public.create_notification_if_enabled(
      NEW.requester_id,
      'friend_accept',
      'Friend request accepted',
      addressee_name || ' accepted your friend request.',
      jsonb_build_object('friendship_id', NEW.id, 'friend_id', NEW.addressee_id)
    );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS friendship_notifications_trigger ON public.friendships;
CREATE TRIGGER friendship_notifications_trigger
AFTER INSERT OR UPDATE ON public.friendships
FOR EACH ROW
EXECUTE FUNCTION public.handle_friendship_notification();

CREATE OR REPLACE FUNCTION public.handle_message_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  sender_name text;
BEGIN
  IF NEW.message_type = 'battle_invite' THEN
    SELECT COALESCE(username, 'Someone')
    INTO sender_name
    FROM public.profiles
    WHERE user_id = NEW.sender_id
    LIMIT 1;

    PERFORM public.create_notification_if_enabled(
      NEW.receiver_id,
      'battle_invite',
      'Friendly battle invite',
      sender_name || ' invited you to a friendly battle.',
      jsonb_build_object('message_id', NEW.id, 'battle_id', NEW.battle_invite_id, 'sender_id', NEW.sender_id)
    );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS message_notifications_trigger ON public.messages;
CREATE TRIGGER message_notifications_trigger
AFTER INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.handle_message_notification();

CREATE OR REPLACE FUNCTION public.handle_credit_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  credit_delta integer;
BEGIN
  credit_delta := COALESCE(NEW.credits, 0) - COALESCE(OLD.credits, 0);

  IF credit_delta > 0 THEN
    PERFORM public.create_notification_if_enabled(
      NEW.user_id,
      'credit_reward',
      'Credits added',
      'You received ' || credit_delta || ' credits.',
      jsonb_build_object('amount', credit_delta)
    );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS credit_notifications_trigger ON public.profiles;
CREATE TRIGGER credit_notifications_trigger
AFTER UPDATE OF credits ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_credit_notification();

DROP POLICY IF EXISTS "Creators can delete own lobbies" ON public.lobbies;
CREATE POLICY "Creators can delete own lobbies"
ON public.lobbies
FOR DELETE
TO authenticated
USING (auth.uid() = creator_id);

DROP POLICY IF EXISTS "Users can leave lobbies" ON public.lobby_participants;
CREATE POLICY "Users can leave lobbies"
ON public.lobby_participants
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Creators can kick lobby participants" ON public.lobby_participants;
CREATE POLICY "Creators can kick lobby participants"
ON public.lobby_participants
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.lobbies l
    WHERE l.id = lobby_participants.lobby_id
      AND l.creator_id = auth.uid()
  )
);
